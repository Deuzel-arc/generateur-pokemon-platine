import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const catalog = readJson("data/rom_catalog.json");
const audit = readJson("data/rom_mapping_audit.json");
const triage = readJson("data/rom_delta_triage.json");
const hypotheses = readJson("data/rom_identity_hypotheses.json");
const special = readJson("data/rom_special_entry_audit.json");
const canonical = readJson("data/gen4_id_reference.json");
const projectPmTypes = readJson("data/project_pm_type_mapping.json");
const itemReference = readJson("data/gen4_item_id_reference.json");

assert.equal(itemReference.source.commit, canonical.source.commit, "item reference must use the same pinned Gen IV source commit");
assert.equal(itemReference.itemIds.length, 468, "canonical item reference must cover logical IDs 0–467");
assert.deepEqual(itemReference.itemIds.map((row) => row.id), Array.from({ length: 468 }, (_, id) => id), "canonical item IDs must be sequential and explicit");
assert.equal(itemReference.itemIds.filter((row) => row.status === "reserved_unused_slot").length, 22, "expected 22 reserved unused canonical item slots");
assert.deepEqual(itemReference.itemIds.filter((row) => row.status === "reserved_unused_slot").map((row) => row.id), Array.from({ length: 22 }, (_, index) => index + 113), "unused item slots must remain IDs 113–134");
assert.equal(itemReference.structuralReconciliation.canonicalDefinedItemIdCount, 446, "canonical non-reserved item count must be 446");
assert.equal(itemReference.structuralReconciliation.platinumPlItemDataArchiveEntries, 446, "original Platinum pl_item_data archive count must match the recorded audit");
assert.equal(itemReference.structuralReconciliation.projectPmPlItemDataArchiveEntries, catalog.profiles.project_pm.itemEntries, "Project PM pl_item_data count must match the ROM catalog");
assert.equal(itemReference.structuralReconciliation.status, "count_match_mapping_not_proven", "matching counts must not be treated as proof of archive ordering");
assert.match(itemReference.policies.join(" "), /jamais joindre.*par position/i, "item policy must prohibit unverified positional joins");
assert.equal(itemReference.holdEffects.length, 147, "canonical hold-effect reference count must remain stable");

assert.equal(projectPmTypes.profile.gameCode, "CPUE", "Project PM type mapping must target CPUE only");
assert.equal(projectPmTypes.profile.sha256, catalog.profiles.project_pm.sha256, "Project PM type mapping ROM hash must match the catalog");
assert.equal(projectPmTypes.policy.noCrossRomInheritance, true, "Project PM type mappings must not inherit across ROM profiles");
assert.equal(projectPmTypes.policy.originalPlatinumTypeId9MustRemainUnchanged, true, "raw type ID 9 in original Platinum must remain untouched");
assert.equal(projectPmTypes.mappings.length, 1, "expected only the explicitly confirmed Project PM type mapping");
assert.deepEqual(projectPmTypes.mappings[0].rawTypeId, 9, "the user-confirmed Fairy mapping must remain tied to raw type ID 9");
assert.equal(projectPmTypes.mappings[0].nameFr, "Fée", "the confirmed Project PM type ID 9 label must remain Fée");
assert.equal(projectPmTypes.mappings[0].scope, "Project PM uniquement", "the Fairy mapping must remain Project PM-only");
assert.equal(projectPmTypes.mappings[0].status, "user_confirmed", "do not silently upgrade user confirmation to independent ROM verification");
assert.equal(projectPmTypes.mappings[0].appliesTo, "Valeurs de type brut ID 9 dans les tables d'espèces et d'attaques de cette ROM exacte.", "the mapping must stay limited to the declared raw tables");

const platinumSha = catalog.profiles.platinum.sha256;
const projectPmSha = catalog.profiles.project_pm.sha256;
for (const [label, source] of [
  ["mapping audit", audit.source],
  ["delta triage", triage.source],
  ["identity hypotheses", hypotheses.source],
  ["special-entry audit", special.source],
]) {
  const sourcePlatinum = source.platinumSha256 ?? source.platinum?.sha256 ?? source.platinumSha;
  const sourceProjectPm = source.projectPmSha256 ?? source.project_pm?.sha256 ?? source.projectPmSha;
  assert.equal(sourcePlatinum, platinumSha, `${label}: original ROM SHA-256 differs from catalog`);
  assert.equal(sourceProjectPm, projectPmSha, `${label}: Project PM SHA-256 differs from catalog`);
}
assert.equal(canonical.source.commit, triage.source.referenceCommit, "triage reference commit must match pinned canonical reference");
assert.equal(triage.source.auditPath, "data/rom_mapping_audit.json", "triage must identify its structural audit");
const auditBytes = readFileSync("data/rom_mapping_audit.json");
const actualAuditBlobSha = createHash("sha1").update(Buffer.concat([
  Buffer.from(`blob ${auditBytes.length}\0`), auditBytes
])).digest("hex");
assert.equal(triage.source.auditSha, actualAuditBlobSha, "triage is stale: its recorded structural-audit blob SHA does not match the current file");

function assertUniqueIds(rows, label) {
  const ids = rows.map((row) => row.id);
  assert.equal(new Set(ids).size, ids.length, `${label}: duplicate IDs`);
}
assertUniqueIds(triage.species, "triage species");
assertUniqueIds(triage.moves, "triage moves");
assertUniqueIds(hypotheses.mappings, "special species hypotheses");
assertUniqueIds(hypotheses.extraMoves, "extra move hypotheses");
assertUniqueIds(special.specialSpecies, "special species audit");
assertUniqueIds(special.extraMoves, "extra move audit");

const canonicalSpeciesIds = new Set(canonical.species.map((row) => row.id));
const canonicalMoveIds = new Set(canonical.moves.map((row) => row.id));
for (const row of triage.species) {
  if (canonicalSpeciesIds.has(row.id)) {
    assert.ok(row.canonicalSymbolCandidate, `species ${row.id}: canonical ID lacks candidate symbol`);
  } else {
    assert.equal(row.canonicalSymbolCandidate, null, `species ${row.id}: out-of-range ID must remain unmapped`);
    assert.equal(row.mappingStatus, "unmapped_outside_canonical_reference", `species ${row.id}: incorrect out-of-range status`);
  }
}
for (const row of triage.moves) {
  if (canonicalMoveIds.has(row.id)) {
    assert.ok(row.canonicalSymbolCandidate, `move ${row.id}: canonical ID lacks candidate symbol`);
  } else {
    assert.equal(row.canonicalSymbolCandidate, null, `move ${row.id}: out-of-range ID must remain unmapped`);
    assert.equal(row.mappingStatus, "unmapped_outside_canonical_reference", `move ${row.id}: incorrect out-of-range status`);
  }
}
assert.equal(triage.species.length, triage.summary.speciesIdsAffected, "species triage count differs from summary");
assert.equal(triage.moves.length, triage.summary.moveIdsAffected, "move triage count differs from summary");
assert.equal(triage.species.filter((row) => row.canonicalSymbolCandidate).length, triage.summary.speciesIdsWithCanonicalCandidate, "species candidate count differs from summary");
assert.equal(triage.moves.filter((row) => row.canonicalSymbolCandidate).length, triage.summary.moveIdsWithCanonicalCandidate, "move candidate count differs from summary");
assert.equal(hypotheses.mappings.find((row) => row.id === 508)?.status, "unmapped", "Project PM species ID 508 must remain unmapped");
assert.equal(hypotheses.extraMoves.length, 4, "expected four extra Project PM move hypotheses");
for (const move of hypotheses.extraMoves) {
  assert.equal(move.nameCandidate, null, `extra move ${move.id} must not have an unverified display name`);
  assert.match(move.status, /^name_unmapped(?:_|$)/, `extra move ${move.id} must remain semantically unverified`);
}
assert.equal(catalog.integration.loadedByGenerator, false, "update audit validator when full runtime integration is implemented");
console.log(`ROM audits consistent: ${triage.species.length} species deltas, ${triage.moves.length} move deltas; candidate-only IDs remain guarded.`);
