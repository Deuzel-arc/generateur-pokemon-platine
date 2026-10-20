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
const typeByteAudit = readJson("data/project_pm_type_byte_audit.json");
const evolutionMethodAudit = readJson("data/project_pm_evolution_method_audit.json");
const itemReference = readJson("data/gen4_item_id_reference.json");

const itemArchiveDiff = readJson("data/project_pm_item_archive_diff.json");
assert.equal(itemArchiveDiff.source.platinum.gameCode, "CPUF", "item archive diff must identify original Platinum");
assert.equal(itemArchiveDiff.source.projectPm.gameCode, "CPUE", "item archive diff must identify Project PM");
assert.equal(itemArchiveDiff.source.platinum.entries, 446, "original Platinum item archive count must remain 446");
assert.equal(itemArchiveDiff.source.projectPm.entries, 470, "Project PM item archive count must remain 470");
assert.equal(itemArchiveDiff.results.sharedIndexRange.count, 446, "shared item archive index range must contain 446 entries");
assert.equal(itemArchiveDiff.results.exactRawEntryMatches, 281, "exact raw item archive matches must remain audited");
assert.equal(itemArchiveDiff.results.rawEntryDifferencesAtSharedIndices, 165, "shared-index raw differences must remain audited");
assert.equal(itemArchiveDiff.results.differingArchiveIndices.length, 165, "differing archive index list must match its count");
assert.deepEqual(itemArchiveDiff.results.extraEntries, { firstIndex: 446, lastIndex: 469, count: 24, status: "unidentified_project_pm_extra_entry" }, "Project PM extra items must remain separate and unnamed");
assert.equal(itemArchiveDiff.results.extraEntrySha256.length, 24, "all 24 extra raw entries must have hashes");
assert.equal(new Set(itemArchiveDiff.results.extraEntrySha256).size, 24, "extra raw entry hashes must be unique");
assert.equal(itemArchiveDiff.policy.noNameInferenceFromPosition, true, "item audit must prohibit assigning names from position alone");
assert.equal(itemArchiveDiff.policy.noCrossRomEffectInheritance, true, "item audit must prohibit inheriting effects across ROMs");
assert.equal(itemArchiveDiff.policy.extraEntryNamingStatus, "unidentified_until_semantic_validation", "extra Project PM entries must remain unidentified until validation");
assert.equal(itemArchiveDiff.policy.mappingStatus, "structural_diff_verified_semantic_mapping_pending", "structural differences must not be described as semantic certification");

assert.equal(itemArchiveDiff.byteDiffAnalysis.changedEntryCount, 165, "byte-level item audit must account for all 165 differing shared entries");
assert.equal(itemArchiveDiff.byteDiffAnalysis.recordSizeBytes, 34, "item archive entry size must remain 34 bytes");
assert.equal(itemArchiveDiff.byteDiffAnalysis.changedBytePositions["0_price_low_byte"], 148, "price low-byte differences must remain counted");
assert.equal(itemArchiveDiff.byteDiffAnalysis.changedBytePositions["1_price_high_byte"], 83, "price high-byte differences must remain counted");
assert.equal(itemArchiveDiff.byteDiffAnalysis.changedBytePositions["3_effectParam"], 6, "effect parameter differences must remain counted");
assert.equal(itemArchiveDiff.byteDiffAnalysis.changedBytePositions["10_fieldUseFunc"], 11, "field-use function differences must remain counted");
assert.equal(itemArchiveDiff.byteDiffAnalysis.changedBytePositions["12_partyUse"], 11, "party-use flag differences must remain counted");
assert.equal(itemArchiveDiff.byteDiffAnalysis.changedBytePositions["15_partyUseParam_union_byte"], 11, "union parameter byte differences must remain counted");
assert.equal(itemArchiveDiff.byteDiffAnalysis.interpretation.holdEffectByteOffset2ChangedEntries, 0, "hold-effect byte offset differences must remain accurately recorded");
for (const [offset, indices] of Object.entries(itemArchiveDiff.byteDiffAnalysis.indicesByChangedByte)) {
  assert.equal(indices.length, itemArchiveDiff.byteDiffAnalysis.changedBytePositions[Object.keys(itemArchiveDiff.byteDiffAnalysis.changedBytePositions).find((key) => key.startsWith(offset + "_"))], `byte offset ${offset}: changed index list count differs`);
}
assert.match(itemArchiveDiff.byteDiffAnalysis.interpretation.caution, /provisional/, "byte offsets must not be overinterpreted as Project PM semantic certification");



assert.equal(itemReference.source.commit, canonical.source.commit, "item reference must use the same pinned Gen IV source commit");
assert.equal(itemReference.itemIds.length, 468, "canonical item reference must cover logical IDs 0–467");
assert.deepEqual(itemReference.itemIds.map((row) => row.id), Array.from({ length: 468 }, (_, id) => id), "canonical item IDs must be sequential and explicit");
assert.equal(itemReference.itemIds.filter((row) => row.status === "reserved_unused_slot").length, 22, "expected 22 reserved unused canonical item slots");
assert.deepEqual(itemReference.itemIds.filter((row) => row.status === "reserved_unused_slot").map((row) => row.id), Array.from({ length: 22 }, (_, index) => index + 113), "unused item slots must remain IDs 113–134");
assert.equal(itemReference.structuralReconciliation.canonicalDefinedItemIdCount, 446, "canonical non-reserved item count must be 446");
assert.equal(itemReference.structuralReconciliation.platinumPlItemDataArchiveEntries, 446, "original Platinum pl_item_data archive count must match the recorded audit");
assert.equal(itemReference.structuralReconciliation.projectPmPlItemDataArchiveEntries, catalog.profiles.project_pm.itemEntries, "Project PM pl_item_data count must match the ROM catalog");
assert.match(itemReference.structuralReconciliation.status, /13_price_anchors_checked/, "candidate mapping must reflect expanded anchor checks and remain short of full certification");
assert.match(itemReference.policies.join(" "), /jamais joindre.*par position/i, "item policy must prohibit unverified positional joins");
assert.equal(itemReference.holdEffects.length, 147, "canonical hold-effect reference count must remain stable");
assert.equal(itemReference.itemIds.filter((row) => row.archiveIndex !== null).length, 446, "candidate archive mapping must cover 446 non-reserved items");
assert.equal(itemReference.itemIds.filter((row) => row.archiveIndex === null).length, 22, "reserved item IDs must not map to archive entries");
assert.deepEqual(itemReference.itemIds.filter((row) => row.archiveIndex !== null).map((row) => row.archiveIndex), Array.from({ length: 446 }, (_, index) => index), "candidate archive indices must be sequential and gap-free");
assert.deepEqual(itemReference.structuralReconciliation.verifiedAnchors.map((row) => [row.logicalItemId, row.symbol, row.archiveIndex, row.observedPrice]), [
  [17, "ITEM_POTION", 17, 300],
  [80, "ITEM_SUN_STONE", 80, 2100],
  [100, "ITEM_CLAW_FOSSIL", 100, 1000],
  [112, "ITEM_GRISEOUS_ORB", 112, 10000],
  [135, "ITEM_ADAMANT_ORB", 113, 10000],
  [150, "ITEM_CHESTO_BERRY", 128, 20],
  [200, "ITEM_CHILAN_BERRY", 178, 20],
  [250, "ITEM_DRAGON_FANG", 228, 100],
  [300, "ITEM_ZAP_PLATE", 278, 1000],
  [350, "ITEM_TM23", 328, 3000],
  [400, "ITEM_TM73", 378, 2000],
  [445, "ITEM_OLD_ROD", 423, 0],
  [467, "ITEM_SECRET_KEY", 445, 0],
], "candidate mapping's 13 source/raw price anchors must remain fixed");
assert.equal(itemReference.structuralReconciliation.verifiedAnchors.length, 13, "expected 13 independently checked source/raw item price anchors");
assert.match(itemReference.structuralReconciliation.status, /13_price_anchors_checked/, "item reference status must reflect the expanded anchor audit");
assert.ok(itemReference.structuralReconciliation.verifiedAnchors.every((row) => row.validation.includes("source JSON") && row.validation.includes("raw CPUF")), "each item anchor must record source and raw ROM agreement");
assert.match(itemReference.structuralReconciliation.status, /full_field_validation_pending/, "candidate item mapping must not be described as fully certified");

assert.equal(itemReference.structuralReconciliation.mappingDerivation.sourceCommit, itemReference.source.commit, "item mapping derivation must use the pinned source commit");
assert.equal(itemReference.structuralReconciliation.mappingDerivation.sourceFile, "tools/dataproc/src/itemproc.c", "item mapping derivation must identify the source algorithm");
assert.match(itemReference.structuralReconciliation.mappingDerivation.derivedRule, /nombre de slots réservés précédents/, "item mapping derivation must state the reserved-slot rule");
assert.match(itemReference.structuralReconciliation.mappingDerivation.confidence, /commercial_ROM_exhaustive_field_check_pending/, "source algorithm evidence must not be treated as exhaustive ROM field certification");
assert.equal(itemReference.structuralReconciliation.mappingDerivation.limitations.length, 3, "mapping limitations must remain explicit");


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

assert.equal(typeByteAudit.source.databaseSha256, "eba0d4f71b26d3d190d53c0e3da8b11d7c18f08089a712e381d1087261a14e78", "type-byte audit must identify the exact saved extraction");
assert.equal(typeByteAudit.source.platinum.sha256, catalog.profiles.platinum.sha256, "type-byte audit must match current Platinum hash");
assert.equal(typeByteAudit.source.project_pm.sha256, catalog.profiles.project_pm.sha256, "type-byte audit must match current Project PM hash");
assert.equal(typeByteAudit.source.canonicalReference.commit, canonical.source.commit, "type-byte audit must use the pinned Gen IV type reference");
assert.equal(typeByteAudit.source.canonicalReference.typeId16, "TYPE_DRAGON", "canonical type ID 16 must remain Dragon");
assert.equal(typeByteAudit.source.canonicalReference.typeId9, "TYPE_MYSTERY", "canonical type ID 9 must remain Mystery outside Project PM");
assert.deepEqual(typeByteAudit.typeId9.platinum.speciesEntriesContainingId, [], "original Platinum species must not receive the Project PM Fairy mapping");
assert.deepEqual(typeByteAudit.typeId9.platinum.moveEntriesContainingId, [174], "original Platinum move type ID 9 must remain separately recorded");
assert.equal(typeByteAudit.typeId9.project_pm.speciesEntriesContainingId.length, 31, "Project PM type ID 9 audit must cover all affected species records");
assert.equal(typeByteAudit.typeId9.project_pm.speciesSlotOccurrences, 37, "Project PM type ID 9 species slots must retain exact count");
assert.deepEqual(typeByteAudit.typeId9.project_pm.moveEntriesContainingId, [66, 140, 186, 204, 236, 295, 296, 461], "Project PM type ID 9 moves must remain fully enumerated");
assert.equal(typeByteAudit.typeId9.project_pm.moveSlotOccurrences, 8, "Project PM type ID 9 move slots must retain exact count");
assert.equal(typeByteAudit.typeId9.project_pm.confirmedProjectPmLabel, projectPmTypes.mappings[0].nameFr, "type-byte audit label must match the user-confirmed mapping");
assert.deepEqual(typeByteAudit.charizardCandidate.project_pm.rawTypeIds, [10, 16], "current Project PM species ID 6 raw type bytes must remain intact");
assert.equal(typeByteAudit.charizardCandidate.project_pm.canonicalSecondaryTypeSymbol, "TYPE_DRAGON", "current raw secondary type ID 16 must map to Dragon in the pinned reference");
assert.equal(typeByteAudit.charizardCandidate.historicalConflict.previousOverrideValue, "Ténèbres", "historical conflict must remain documented rather than silently erased");
assert.equal(typeByteAudit.charizardCandidate.historicalConflict.previousProjectPmSha256, "78b95905031e0524942ac079afe2d444a6bcfb47aae7a07106800c5591d970f7", "historical override provenance hash must remain explicit");
assert.equal(typeByteAudit.policies.doNotTransferOverridesAcrossRomHashes, true, "overrides must not be inherited across differing ROM hashes");

assert.equal(evolutionMethodAudit.source.databaseSha256, typeByteAudit.source.databaseSha256, "evolution audit must use the same identified extraction database");
assert.equal(evolutionMethodAudit.source.platinum.sha256, catalog.profiles.platinum.sha256, "evolution audit must match current Platinum hash");
assert.equal(evolutionMethodAudit.source.project_pm.sha256, catalog.profiles.project_pm.sha256, "evolution audit must match current Project PM hash");
assert.equal(evolutionMethodAudit.source.canonicalReference.commit, canonical.source.commit, "evolution method audit must use the pinned canonical reference");
assert.deepEqual(evolutionMethodAudit.source.canonicalReference.canonicalMethodIds, Array.from({ length: 27 }, (_, id) => id), "canonical evolution methods must remain IDs 0 through 26");
assert.equal(Object.values(evolutionMethodAudit.methodCounts.platinum).reduce((sum, count) => sum + count, 0), evolutionMethodAudit.source.platinum.evolutionRecordCount, "Platinum evolution method counts must sum to the audited record total");
assert.equal(Object.values(evolutionMethodAudit.methodCounts.project_pm).reduce((sum, count) => sum + count, 0), evolutionMethodAudit.source.project_pm.evolutionRecordCount, "Project PM evolution method counts must sum to the audited record total");
assert.deepEqual(evolutionMethodAudit.projectPmNonCanonicalMethodIds.map((row) => row.methodId), [27], "only method 27 should be classified as outside the canonical list");
assert.equal(evolutionMethodAudit.projectPmNonCanonicalMethodIds[0].count, 2, "custom method 27 must cover both observed records");
assert.deepEqual(evolutionMethodAudit.projectPmNonCanonicalMethodIds[0].entries, [
  { sourceSpeciesId: 223, parameter: 458, targetSpeciesId: 224 },
  { sourceSpeciesId: 458, parameter: 223, targetSpeciesId: 226 }
], "custom method 27 source/parameter/target triples must remain unchanged");
assert.equal(evolutionMethodAudit.projectPmNonCanonicalMethodIds[0].status, "custom_method_candidate_semantics_unverified", "custom evolution method semantics must remain unverified");
assert.equal(evolutionMethodAudit.policies.doNotRenameCustomMethodWithoutCodeEvidence, true, "custom method names must require implementation evidence");

assert.equal(evolutionMethodAudit.directRomVerification.scriptPath, "scripts/audit-evolution-roms.mjs", "evolution audit must identify its reproducible binary parser");
assert.deepEqual(evolutionMethodAudit.directRomVerification.nitroFsFileCount, { platinum: 340, project_pm: 340 }, "direct ROM audit must preserve validated NitroFS file counts");
assert.equal(evolutionMethodAudit.directRomVerification.archivePath, "poketool/personal/evo.narc", "direct ROM audit must identify the evolution archive path");
assert.deepEqual(evolutionMethodAudit.directRomVerification.archiveEntryCount, { platinum: 508, project_pm: 509 }, "direct ROM audit must preserve archive entry counts");
assert.equal(evolutionMethodAudit.directRomVerification.recordSizeBytes, 44, "direct ROM evolution records must remain 44 bytes");
assert.deepEqual(evolutionMethodAudit.directRomVerification.selectedRawEntries.platinum.sourceSpeciesId458, [{ slot: 0, methodId: 21, parameter: 223, targetSpeciesId: 226 }], "original Mantyke-candidate entry must preserve its canonical method 21 record");
assert.deepEqual(evolutionMethodAudit.directRomVerification.selectedRawEntries.project_pm.sourceSpeciesId223, [
  { slot: 0, methodId: 4, parameter: 35, targetSpeciesId: 224 },
  { slot: 1, methodId: 27, parameter: 458, targetSpeciesId: 224 }
], "Project PM source ID 223 must preserve both raw evolution slots");
assert.deepEqual(evolutionMethodAudit.directRomVerification.selectedRawEntries.project_pm.sourceSpeciesId458, [{ slot: 0, methodId: 27, parameter: 223, targetSpeciesId: 226 }], "Project PM source ID 458 must preserve method 27 and reciprocal parameter");
assert.match(evolutionMethodAudit.directRomVerification.observations.join(" "), /remplace la méthode 21 par la méthode 27/, "audit must retain the observed method-21 to method-27 change");
assert.match(evolutionMethodAudit.directRomVerification.limitations.join(" "), /ne prouve pas que 27 a la même implémentation/, "audit must not assume custom method semantics");


const itemFieldDiff = readJson("data/project_pm_item_field_diff_summary.json");
assert.equal(itemFieldDiff.validation.bothArchivesRecordSize34, true, "field-level item report must confirm 34-byte records");
assert.equal(itemFieldDiff.validation.platinumEntryCount, 446, "field-level item report must preserve CPUF entry count");
assert.equal(itemFieldDiff.validation.projectPmEntryCount, 470, "field-level item report must preserve CPUE entry count");
assert.equal(itemFieldDiff.validation.sharedIndicesCompared, 446, "field-level item report must compare all shared indices");
assert.equal(itemFieldDiff.validation.identicalRawEntries, 281, "field-level item report must preserve identical-entry count");
assert.equal(itemFieldDiff.validation.differentRawEntries, 165, "field-level item report must preserve differing-entry count");
assert.equal(itemFieldDiff.validation.extraProjectPmEntries, 24, "field-level item report must preserve extra-entry count");
assert.equal(itemFieldDiff.fieldDifferences.price_u16_le_bytes_0_1.changedEntries, 148, "field-level price diff count must match raw comparison");
assert.equal(itemFieldDiff.fieldDifferences.holdEffect_byte_2.changedEntries, 0, "hold-effect byte must remain unchanged in the raw comparison");
assert.equal(itemFieldDiff.fieldDifferences.effectParam_byte_3.changedEntries, 6, "effect parameter diff count must match raw comparison");
assert.equal(itemFieldDiff.fieldDifferences.fieldUseFunc_byte_10.changedEntries, 11, "field-use function diff count must match raw comparison");
assert.equal(itemFieldDiff.fieldDifferences.partyUse_byte_12.changedEntries, 11, "party-use diff count must match raw comparison");
assert.equal(itemFieldDiff.fieldDifferences.union_bytes_14_33.changedEntries, 17, "union region diff count must match raw comparison");
assert.equal(itemFieldDiff.policy.noNameInferenceFromPosition, true, "field-level item report must prohibit positional name inference");
assert.equal(itemFieldDiff.policy.noCrossRomEffectInheritance, true, "field-level item report must prohibit cross-ROM effect inheritance");
assert.match(itemFieldDiff.policy.fieldSemanticsForProjectPm, /provisional/, "Project PM field semantics must remain provisional");


const extraItemPatterns = readJson("data/project_pm_extra_item_patterns.json");
assert.equal(extraItemPatterns.source.gameCode, "CPUE", "extra item pattern report must target Project PM");
assert.equal(extraItemPatterns.source.recordSizeBytes, 34, "extra item records must remain 34 bytes");
assert.equal(extraItemPatterns.totalEntries, 24, "extra item pattern report must cover all 24 extra entries");
assert.deepEqual([extraItemPatterns.contiguousVariantGroup.firstArchiveIndex, extraItemPatterns.contiguousVariantGroup.lastArchiveIndex, extraItemPatterns.contiguousVariantGroup.count], [448, 465, 18], "extra item variant group boundaries must remain fixed");
assert.deepEqual(extraItemPatterns.contiguousVariantGroup.observedByteValues, Array.from({ length: 18 }, (_, index) => index), "extra item variant byte values must remain sequential 0–17");
assert.equal(extraItemPatterns.contiguousVariantGroup.otherBytesIdenticalWithinGroup, true, "extra item variant group must explicitly record all other bytes identical");
assert.equal(extraItemPatterns.otherEntries.length, 6, "six extra entries outside the contiguous variant group must remain separately classified");
assert.match(extraItemPatterns.policy, /ne prouve ni le nom/i, "extra item patterns must not be treated as semantic names or effects");

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
