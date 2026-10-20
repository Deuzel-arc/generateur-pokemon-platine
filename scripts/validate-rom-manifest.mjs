import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const path = process.argv[2] ?? "data/rom_catalog.json";
const catalog = JSON.parse(readFileSync(path, "utf8"));

assert.equal(catalog.schemaVersion, "1.0.0", "schemaVersion must be 1.0.0");
assert.ok(catalog.profiles?.platinum, "missing original Platinum profile");
assert.ok(catalog.profiles?.project_pm, "missing Project PM profile");
for (const [key, profile] of Object.entries(catalog.profiles)) {
  assert.ok(profile.gameCode, `${key}: missing game code`);
  assert.match(profile.sha256, /^[a-f0-9]{64}$/i, `${key}: invalid SHA-256`);
  for (const field of ["speciesEntries", "moveEntries", "levelUpLearnsets", "evolutionRecords", "itemEntries", "berryEntries"]) {
    assert.ok(Number.isInteger(profile[field]) && profile[field] > 0, `${key}: invalid ${field}`);
  }
}
assert.notEqual(catalog.profiles.platinum.sha256, catalog.profiles.project_pm.sha256, "profiles must identify distinct ROM files");
assert.equal(catalog.integration?.loadedByGenerator, false, "update this validator when dynamic integration is implemented");
assert.equal(catalog.integration?.itemEffectsSemanticallyDecoded, false, "do not claim semantic item decoding without evidence");
console.log(`ROM manifest valid: ${Object.keys(catalog.profiles).length} profiles; data integration status remains explicit.`);
