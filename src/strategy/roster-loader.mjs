/**
 * Explicitly experimental projection of the 493-species ROM roster candidate.
 * This module does not certify ROM semantics or infer strategic tags/legendary
 * status. Consumers must opt in and keep the source profile (CPUF/CPUE) explicit.
 */
import { readFileSync } from "node:fs";

export const ROSTER_MODES = Object.freeze({
  VERIFIED: "verified",
  EXPERIMENTAL: "experimental",
});

const KNOWN_TYPES = new Set([
  "Normal", "Feu", "Eau", "Plante", "Électrik", "Glace", "Combat",
  "Poison", "Sol", "Vol", "Psy", "Insecte", "Roche", "Spectre",
  "Dragon", "Ténèbres", "Acier", "Fée", "Inconnu",
]);

export function loadRosterProfiles({ mode = ROSTER_MODES.VERIFIED, dataSource = "platinum", candidatePath = "data/rom_roster_profiles_candidate_493.json", verifiedPath = "data/rom_roster_profiles.json" } = {}) {
  if (!["platinum", "multiplayer"].includes(dataSource)) {
    throw new TypeError("dataSource must be platinum or multiplayer");
  }
  if (mode === ROSTER_MODES.VERIFIED) {
    const profile = JSON.parse(readFileSync(verifiedPath, "utf8"));
    return profile.base.map(([name, id, types, hp, attack, defense, speed, specialAttack, specialDefense]) => ({
      name, id, types: [...types],
      baseStats: { hp, attack, defense, speed, specialAttack, specialDefense },
      status: "verified_roster",
      strategicMetadataStatus: "partial",
      legendaryStatus: "unknown",
      tags: [],
      sourceProfile: dataSource,
    }));
  }
  if (mode !== ROSTER_MODES.EXPERIMENTAL) {
    throw new TypeError("mode must be verified or experimental");
  }

  const candidate = JSON.parse(readFileSync(candidatePath, "utf8"));
  if (candidate.status !== "candidate_full_roster_493_needs_semantic_and_runtime_review") {
    throw new Error("Candidate roster status is not the expected unverified status");
  }
  const overrides = candidate.project_pm_overrides ?? {};
  return candidate.base.map(([name, id, baseTypes, hp, attack, defense, speed, specialAttack, specialDefense]) => {
    const [overrideTypes, overrideStats] = dataSource === "multiplayer" ? (overrides[name] ?? [null, null]) : [null, null];
    const types = overrideTypes ?? baseTypes;
    const stats = overrideStats ?? [hp, attack, defense, speed, specialAttack, specialDefense];
    if (!Array.isArray(types) || types.length !== 2 || !types.every(type => KNOWN_TYPES.has(type))) {
      throw new Error(`Species ${id} has invalid or unknown type labels`);
    }
    if (!Array.isArray(stats) || stats.length !== 6 || !stats.every(value => Number.isInteger(value) && value >= 1 && value <= 255)) {
      throw new Error(`Species ${id} has invalid base stats`);
    }
    return {
      name, id, types: [...types],
      baseStats: { hp: stats[0], attack: stats[1], defense: stats[2], speed: stats[3], specialAttack: stats[4], specialDefense: stats[5] },
      status: "experimental_candidate",
      strategicMetadataStatus: "not_certified",
      legendaryStatus: "unknown",
      tags: [],
      sourceProfile: dataSource,
      evidence: {
        candidateFile: candidatePath,
        platinumSha256: candidate.source.platinumSha256,
        projectPmSha256: candidate.source.projectPmSha256,
        typeStatsSemanticsCertified: false,
      },
    };
  });
}
