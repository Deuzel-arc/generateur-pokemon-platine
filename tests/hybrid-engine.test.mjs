import assert from "node:assert/strict";
import { evaluateCandidate, searchTeams, validateWeightUpdate } from "../src/strategy/hybrid-engine.mjs";

const evidence = { status: "certified", sourceIds: ["fixture:verified-facts"] };
const roster = [
  { id: 1, name: "A", types: ["Grass", "Poison"], typeEvidence: evidence, baseStats: { hp: 80, attack: 80, defense: 80, speed: 80, specialAttack: 80, specialDefense: 80 }, baseStatsEvidence: evidence },
  { id: 2, name: "B", types: ["Fire", "Flying"], typeEvidence: evidence, baseStats: { hp: 90, attack: 90, defense: 90, speed: 90, specialAttack: 90, specialDefense: 90 }, baseStatsEvidence: evidence },
  { id: 3, name: "C", types: ["Water", "Ice"], typeEvidence: evidence, baseStats: { hp: 100, attack: 100, defense: 100, speed: 100, specialAttack: 100, specialDefense: 100 }, baseStatsEvidence: evidence },
  { id: 4, name: "D", types: ["Electric", "Steel"], typeEvidence: evidence, baseStats: { hp: 110, attack: 110, defense: 110, speed: 110, specialAttack: 110, specialDefense: 110 }, baseStatsEvidence: evidence },
  { id: 5, name: "E", types: ["Ground", "Rock"], typeEvidence: evidence, baseStats: { hp: 120, attack: 120, defense: 120, speed: 120, specialAttack: 120, specialDefense: 120 }, baseStatsEvidence: evidence },
  { id: 6, name: "F", types: ["Psychic", "Fairy"], typeEvidence: evidence, baseStats: { hp: 130, attack: 130, defense: 130, speed: 130, specialAttack: 130, specialDefense: 130 }, baseStatsEvidence: evidence },
];
const typeChart = {
  evidence,
  rows: [
    ...["Grass", "Fire", "Water", "Electric", "Ground", "Psychic", "Poison", "Flying", "Ice", "Steel", "Rock", "Fairy"].map((attackType, i) => ({
      attackType, superEffectiveAgainst: i % 2 === 0 ? ["Fixture"] : [], evidence
    }))
  ]
};
const pairSynergies = [
  { speciesIds: [1, 2], score: 0.8, evidence, explanation: "fixture: complementarity" },
  { speciesIds: [3, 4], score: -0.5, evidence, explanation: "fixture: conflict" },
];
const options = { constraints: { teamSize: 6 }, typeChart, pairSynergies };

const valid = evaluateCandidate(roster, options);
assert.equal(valid.accepted, true);
assert.equal(valid.violations.length, 0);
assert.equal(valid.evidenceStatus, "certified_inputs_only");
assert.equal(valid.scoreBreakdown.pairSynergy, 0.575);
assert.ok(valid.score > 0 && valid.score <= 1);

const invalid = evaluateCandidate(roster.slice(0, 5), options);
assert.equal(invalid.accepted, false);
assert.deepEqual(invalid.violations, ["team_size_expected_6_got_5"]);
assert.equal(invalid.score, null);

const unverified = evaluateCandidate(roster.map((p, i) => i === 0 ? { ...p, typeEvidence: { status: "candidate" } } : p), options);
assert.equal(unverified.evidenceStatus, "partial_inputs");
assert.ok(unverified.scoreBreakdown.typeDiversity === null);
assert.ok(unverified.scoreBreakdown.uncertaintyPenalty > 0);

const search = searchTeams(roster, { ...options, maxCandidates: 10, maxResults: 3 });
assert.equal(search.visitedCandidates, 1);
assert.equal(search.truncated, false);
assert.equal(search.results.length, 1);
assert.match(search.warnings[0], /pas une simulation/i);

const truncated = searchTeams([...roster, { ...roster[0], id: 7, name: "G" }], { ...options, maxCandidates: 1 });
assert.equal(truncated.visitedCandidates, 1);
assert.equal(truncated.truncated, true);

const acceptedUpdate = validateWeightUpdate({
  currentWeights: { pairSynergy: 0.5 },
  proposedWeights: { pairSynergy: 0.7 },
  baselineValidationScore: 0.6,
  proposedValidationScore: 0.61,
  hardConstraintsUnchanged: true,
});
assert.equal(acceptedUpdate.accepted, true);

const rejectedUpdate = validateWeightUpdate({
  currentWeights: { pairSynergy: 0.5 },
  proposedWeights: { pairSynergy: 0.7 },
  baselineValidationScore: 0.6,
  proposedValidationScore: 0.61,
  hardConstraintsUnchanged: false,
});
assert.equal(rejectedUpdate.accepted, false);

console.log("[PASS] moteur hybride : contraintes dures, score explicable, incertitude, recherche reproductible et garde-fou d'optimisation");
