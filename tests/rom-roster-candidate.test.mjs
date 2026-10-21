import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const profile = JSON.parse(readFileSync("data/rom_roster_profiles_candidate_493.json", "utf8"));
const catalog = JSON.parse(readFileSync("data/rom_catalog.json", "utf8"));
const expectedHashes = {
  platinum: "1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8",
  projectPm: "435b0288238f01f21eeeef7b5de6de3e3c9c3a9b70ea3b18d71b31ba282ae4e1",
};

assert.equal(profile.status, "candidate_full_roster_493_needs_semantic_and_runtime_review");
assert.equal(profile.source.platinumSha256, expectedHashes.platinum);
assert.equal(profile.source.projectPmSha256, expectedHashes.projectPm);
assert.equal(catalog.profiles.platinum.sha256, expectedHashes.platinum);
assert.equal(catalog.profiles.project_pm.sha256, expectedHashes.projectPm);
assert.equal(profile.policy.runtimeIntegrated, false, "candidate roster must not be mistaken for runtime integration");
assert.deepEqual(profile.statsOrder, ["hp", "attack", "defense", "speed", "specialAttack", "specialDefense"]);
assert.equal(profile.base.length, 493);
assert.equal(profile.counts.canonicalSpecies, 493);
assert.equal(profile.counts.baseProfiles, 493);
assert.equal(profile.counts.uniqueIds, 493);

const ids = new Set();
const names = new Set();
for (const row of profile.base) {
  assert.equal(row.length, 9, "candidate row must contain name, ID, two types and six stats");
  const [name, id, types, ...stats] = row;
  assert.equal(typeof name, "string");
  assert.ok(name.trim().length > 0);
  assert.ok(Number.isInteger(id) && id >= 1 && id <= 493);
  assert.ok(!ids.has(id), `duplicate National Dex ID ${id}`);
  assert.ok(!names.has(name), `duplicate French display name ${name}`);
  ids.add(id); names.add(name);
  assert.ok(Array.isArray(types) && types.length === 2);
  for (const type of types) assert.ok(typeof type === "string" && type.length > 0, `species ${id}: invalid type label`);
  assert.equal(stats.length, 6);
  for (const stat of stats) assert.ok(Number.isInteger(stat) && stat >= 1 && stat <= 255, `species ${id}: invalid base stat ${stat}`);
}
for (let id = 1; id <= 493; id++) assert.ok(ids.has(id), `missing National Dex ID ${id}`);

const overrides = profile.project_pm_overrides;
assert.ok(overrides && typeof overrides === "object" && !Array.isArray(overrides));
assert.equal(Object.keys(overrides).length, profile.counts.projectPmOverrides);
for (const [name, entry] of Object.entries(overrides)) {
  assert.ok(names.has(name), `Project PM override references unknown candidate name: ${name}`);
  assert.ok(Array.isArray(entry) && entry.length === 2, `${name}: override must contain types and stats`);
  assert.ok(Array.isArray(entry[0]) && entry[0].length === 2, `${name}: override types malformed`);
  assert.ok(entry[0].every(type => typeof type === "string" && type.length > 0), `${name}: invalid override type`);
  assert.ok(Array.isArray(entry[1]) && entry[1].length === 6, `${name}: override stats malformed`);
  assert.ok(entry[1].every(stat => Number.isInteger(stat) && stat >= 1 && stat <= 255), `${name}: invalid override base stat`);
}
assert.equal(profile.counts.statsChanged, 197);
assert.equal(profile.counts.typesChanged, 60);
assert.equal(profile.counts.bothStatsAndTypesChanged, 42);
assert.equal(profile.counts.noChangeBetweenProfiles, 278);
assert.equal(catalog.integration.loadedByGenerator, false);

console.log("[PASS] roster ROM candidat : 493 IDs, noms uniques, statistiques valides, overrides CPUE et empreintes vérifiés; sémantique toujours non certifiée");
