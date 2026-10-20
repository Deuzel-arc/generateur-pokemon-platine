/**
 * Hybrid strategy search primitives.
 *
 * Important: this module is deliberately data-driven. It does not infer move,
 * ability, item, type-chart or battle effects. Only facts explicitly marked
 * certified may influence the default recommendation score.
 * It is a search/scoring layer, NOT a battle simulator.
 */

const DEFAULT_WEIGHTS = Object.freeze({
  statBudget: 0.15,
  typeDiversity: 0.15,
  defensiveCoverage: 0.25,
  pairSynergy: 0.30,
  uncertaintyPenalty: 0.15,
});

const CERTIFIED = new Set(["certified", "verified"]);

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function finiteNumber(value, message) {
  assert(typeof value === "number" && Number.isFinite(value), message);
  return value;
}

function unique(values) {
  return [...new Set(values)];
}

function normalizeWeights(weights = {}) {
  const merged = { ...DEFAULT_WEIGHTS, ...weights };
  for (const [key, value] of Object.entries(merged)) {
    finiteNumber(value, `Weight ${key} must be finite`);
    assert(value >= 0, `Weight ${key} cannot be negative`);
  }
  const total = Object.values(merged).reduce((sum, value) => sum + value, 0);
  assert(total > 0, "At least one scoring weight must be positive");
  return Object.fromEntries(Object.entries(merged).map(([key, value]) => [key, value / total]));
}

function isCertified(record) {
  return record && CERTIFIED.has(record.status);
}

function statTotal(species) {
  const stats = species.baseStats;
  if (!stats || !isCertified(species.baseStatsEvidence)) return null;
  const values = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"].map(key => stats[key]);
  if (!values.every(value => Number.isInteger(value) && value > 0)) return null;
  return values.reduce((sum, value) => sum + value, 0);
}

function getPairKey(a, b) {
  return [a, b].sort((x, y) => x - y).join(":");
}

function validateRoster(roster) {
  assert(Array.isArray(roster), "roster must be an array");
  const seen = new Set();
  for (const species of roster) {
    assert(Number.isInteger(species.id) && species.id >= 1 && species.id <= 493, "species IDs must be canonical Gen I–IV IDs 1–493");
    assert(typeof species.name === "string" && species.name.length > 0, "species name is required");
    assert(!seen.has(species.id), `duplicate species ID ${species.id}`);
    seen.add(species.id);
  }
}

function validateHardConstraints(team, constraints = {}) {
  const violations = [];
  if (constraints.teamSize !== undefined && team.length !== constraints.teamSize) {
    violations.push(`team_size_expected_${constraints.teamSize}_got_${team.length}`);
  }
  const ids = team.map(p => p.id);
  if (new Set(ids).size !== ids.length) violations.push("duplicate_species");
  if (constraints.allowedSpeciesIds) {
    const allowed = new Set(constraints.allowedSpeciesIds);
    if (team.some(p => !allowed.has(p.id))) violations.push("species_outside_allowed_pool");
  }
  if (constraints.requiredSpeciesIds) {
    const have = new Set(ids);
    if (constraints.requiredSpeciesIds.some(id => !have.has(id))) violations.push("required_species_missing");
  }
  if (constraints.exactlyOneLegendary === true) {
    const count = team.filter(p => p.legendaryEvidence && isCertified(p.legendaryEvidence) && p.isLegendary === true).length;
    const unknown = team.some(p => !isCertified(p.legendaryEvidence));
    if (unknown) violations.push("legendary_status_unknown");
    else if (count !== 1) violations.push(`legendary_count_expected_1_got_${count}`);
  }
  if (constraints.starterIds && constraints.starterIds.length === 3) {
    const have = new Set(ids);
    if (constraints.starterIds.some(id => !have.has(id))) violations.push("starter_trio_incomplete");
  }
  return violations;
}

function typeCoverageScore(team, typeChart) {
  if (!typeChart || !isCertified(typeChart.evidence) || !Array.isArray(typeChart.rows)) {
    return { score: null, status: "unknown", explanation: "Matrice de types non certifiée : couverture non notée." };
  }
  const types = unique(team.flatMap(p => isCertified(p.typeEvidence) && Array.isArray(p.types) ? p.types : []));
  if (types.length === 0 || team.some(p => !isCertified(p.typeEvidence))) {
    return { score: null, status: "incomplete", explanation: "Au moins un type d'espèce n'est pas certifié." };
  }
  const multipliers = new Map(typeChart.rows.map(row => [row.attackType, row]));
  let covered = 0;
  let total = 0;
  for (const attackType of types) {
    const row = multipliers.get(attackType);
    if (!row || !isCertified(row.evidence)) continue;
    total += 1;
    if (row.superEffectiveAgainst && row.superEffectiveAgainst.length > 0) covered += 1;
  }
  if (total !== types.length) return { score: null, status: "incomplete", explanation: "La matrice certifiée ne couvre pas tous les types de l'équipe." };
  return { score: covered / total, status: "certified", explanation: `Couverture offensive de types calculée sur ${total} types distincts.` };
}

function calculateScores(team, options) {
  const weights = normalizeWeights(options.weights);
  const stats = team.map(statTotal);
  const usableStats = stats.filter(value => value !== null);
  const statBudget = usableStats.length === team.length
    ? Math.min(1, usableStats.reduce((sum, value) => sum + value, 0) / (team.length * 600))
    : null;

  const typed = team.every(p => isCertified(p.typeEvidence) && Array.isArray(p.types));
  const allTypes = typed ? team.flatMap(p => p.types) : [];
  const distinctTypes = unique(allTypes);
  const typeDiversity = typed && allTypes.length > 0 ? distinctTypes.length / allTypes.length : null;

  const coverage = typeCoverageScore(team, options.typeChart);
  const pairMap = new Map();
  for (const pair of options.pairSynergies ?? []) {
    if (!isCertified(pair.evidence) || !Array.isArray(pair.speciesIds) || pair.speciesIds.length !== 2) continue;
    pairMap.set(getPairKey(pair.speciesIds[0], pair.speciesIds[1]), pair);
  }
  let pairSum = 0;
  let pairCount = 0;
  const explanations = [];
  for (let i = 0; i < team.length; i++) {
    for (let j = i + 1; j < team.length; j++) {
      const pair = pairMap.get(getPairKey(team[i].id, team[j].id));
      if (!pair) continue;
      pairSum += Math.max(-1, Math.min(1, finiteNumber(pair.score, "pair synergy score must be finite")));
      pairCount++;
      explanations.push({
        speciesIds: [team[i].id, team[j].id],
        score: pair.score,
        explanation: pair.explanation ?? "Synergie certifiée sans explication détaillée.",
        sourceIds: pair.evidence.sourceIds ?? [],
      });
    }
  }
  const pairSynergy = pairCount > 0 ? (pairSum / pairCount + 1) / 2 : null;
  const knownComponents = [
    ["statBudget", statBudget],
    ["typeDiversity", typeDiversity],
    ["defensiveCoverage", coverage.score],
    ["pairSynergy", pairSynergy],
  ];
  const available = knownComponents.filter(([, value]) => value !== null);
  const availableWeight = available.reduce((sum, [key]) => sum + weights[key], 0);
  const normalizedScore = availableWeight > 0
    ? available.reduce((sum, [key, value]) => sum + weights[key] * value, 0) / availableWeight
    : null;
  const uncertaintyPenalty = 1 - (available.length / knownComponents.length);
  const adjustedScore = normalizedScore === null
    ? null
    : Math.max(0, normalizedScore - weights.uncertaintyPenalty * uncertaintyPenalty);

  return {
    score: adjustedScore === null ? null : Number(adjustedScore.toFixed(6)),
    scoreBreakdown: {
      statBudget,
      typeDiversity,
      defensiveCoverage: coverage.score,
      pairSynergy,
      uncertaintyPenalty: Number(uncertaintyPenalty.toFixed(6)),
      weights,
      availableComponents: available.map(([key]) => key),
    },
    evidenceStatus: available.length === knownComponents.length ? "certified_inputs_only" : "partial_inputs",
    explanations: [
      coverage.explanation,
      ...explanations.map(item => `${item.speciesIds.join(" + ")} : ${item.explanation}`),
    ],
    pairEvidence: explanations,
  };
}

/**
 * Evaluate one candidate. Hard constraints are applied before any score;
 * an invalid team is never rescued by a high heuristic score.
 */
export function evaluateCandidate(team, options = {}) {
  assert(Array.isArray(team), "team must be an array");
  const violations = validateHardConstraints(team, options.constraints);
  if (violations.length) {
    return { accepted: false, violations, score: null, scoreBreakdown: null, evidenceStatus: "rejected_by_hard_constraints" };
  }
  const scored = calculateScores(team, options);
  return { accepted: scored.score !== null, violations: [], ...scored };
}

/**
 * Hybrid search over roster combinations. Candidate ranking is reproducible;
 * input order breaks exact score ties. This function does not simulate battles.
 */
export function searchTeams(roster, options = {}) {
  validateRoster(roster);
  const teamSize = options.constraints?.teamSize ?? 6;
  assert(Number.isInteger(teamSize) && teamSize > 0 && teamSize <= 6, "teamSize must be between 1 and 6");
  const maxCandidates = options.maxCandidates ?? 25000;
  const maxResults = options.maxResults ?? 20;
  assert(Number.isInteger(maxCandidates) && maxCandidates > 0, "maxCandidates must be positive");
  assert(Number.isInteger(maxResults) && maxResults > 0, "maxResults must be positive");
  const results = [];
  let visited = 0;
  let truncated = false;

  function walk(start, chosen) {
    if (visited >= maxCandidates) { truncated = true; return; }
    if (chosen.length === teamSize) {
      visited++;
      const evaluation = evaluateCandidate(chosen, options);
      if (evaluation.accepted) results.push({ speciesIds: chosen.map(p => p.id), ...evaluation });
      return;
    }
    const needed = teamSize - chosen.length;
    for (let i = start; i <= roster.length - needed; i++) {
      if (visited >= maxCandidates) { truncated = true; break; }
      chosen.push(roster[i]);
      walk(i + 1, chosen);
      chosen.pop();
    }
  }

  walk(0, []);
  results.sort((a, b) => b.score - a.score || a.speciesIds.join(",").localeCompare(b.speciesIds.join(",")));
  return {
    algorithm: "hybrid-exhaustive-combination-search",
    visitedCandidates: visited,
    truncated,
    results: results.slice(0, maxResults),
    warnings: [
      "Le classement n'est pas une simulation de combat.",
      "Les synergies absentes du corpus certifié ne sont pas inventées.",
      ...(truncated ? ["Recherche tronquée par maxCandidates."] : []),
    ],
  };
}

/**
 * Apply a proposed scoring-weight update only when it improves a held-out
 * validation score and does not change any hard-constraint decision.
 */
export function validateWeightUpdate({ currentWeights, proposedWeights, baselineValidationScore, proposedValidationScore, hardConstraintsUnchanged }) {
  finiteNumber(baselineValidationScore, "baselineValidationScore must be finite");
  finiteNumber(proposedValidationScore, "proposedValidationScore must be finite");
  const normalizedCurrent = normalizeWeights(currentWeights);
  const normalizedProposed = normalizeWeights(proposedWeights);
  const accepted = proposedValidationScore > baselineValidationScore && hardConstraintsUnchanged === true;
  return {
    accepted,
    currentWeights: normalizedCurrent,
    proposedWeights: normalizedProposed,
    baselineValidationScore,
    proposedValidationScore,
    reason: accepted
      ? "Improvement observed on held-out validation; hard constraints unchanged."
      : "Rejected: validation did not improve strictly or hard constraints changed.",
  };
}
