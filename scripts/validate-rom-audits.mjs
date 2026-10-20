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

assert.equal(typeByteAudit.exhaustiveType9Conclusion.status, "raw_type_id_9_counts_reconciled_for_both_roms", "raw type ID 9 comparison must stay explicit");
assert.equal(typeByteAudit.exhaustiveType9Conclusion.cpuF.speciesSlotOccurrences, 0, "CPUF must not inherit Project PM Fairy species mappings");
assert.deepEqual(typeByteAudit.exhaustiveType9Conclusion.cpuF.moveEntriesContainingTypeId9, [174], "CPUF raw type ID 9 must retain its original Platinum interpretation");
assert.equal(typeByteAudit.exhaustiveType9Conclusion.cpue.speciesSlotOccurrences, 37, "CPUE raw type ID 9 species slot count must remain 37");
assert.deepEqual(typeByteAudit.exhaustiveType9Conclusion.cpue.moveEntriesContainingTypeId9, [66, 140, 186, 204, 236, 295, 296, 461], "CPUE Fairy move IDs must match the direct raw type-byte audit");
assert.ok(typeByteAudit.exhaustiveType9Conclusion.limitations.includes("Project PM move effects remain unverified."), "CPUE move effects must remain flagged as unverified");

const evolutionMethodAudit = readJson("data/project_pm_evolution_method_audit.json");
const speciesNameBankAudit = readJson("data/rom_species_name_bank_audit.json");
const speciesCoreDeltaAudit = readJson("data/rom_species_core_delta_audit.json");
const extendedNameBankAudit = readJson("data/rom_extended_name_banks_audit.json");
const itemReference = readJson("data/gen4_item_id_reference.json");
const romRosterProfiles = readJson("data/rom_roster_profiles.json");
const candidateRosterProfiles = readJson("data/rom_roster_profiles_candidate_493.json");
const frenchSpeciesNames = readJson("data/gen4_french_species_name_reference.json");
const rosterCoverageAudit = readJson("data/rom_roster_coverage_audit.json");
const fairyMoveIdentityGuard = readJson("data/project_pm_fairy_move_identity_guard.json");
const fairyMoveSemanticsAudit = readJson("data/project_pm_fairy_move_semantics_audit.json");
const levelUpMoveUsageAudit = readJson("data/project_pm_levelup_move_usage_audit.json");

const optimizationGapAudit = readJson("data/generator_optimization_gap_audit.json");
assert.equal(optimizationGapAudit.status, "priorities_synthesized_from_existing_rom_audits_not_runtime_verified", "optimization gap audit must remain a roadmap, not a runtime verification claim");
assert.equal(optimizationGapAudit.currentVerifiedBaseline.runtimeRosterProfiles, 71, "optimization baseline must retain the measured runtime roster coverage");
assert.equal(optimizationGapAudit.currentVerifiedBaseline.canonicalSpeciesMissing, 422, "optimization baseline must track missing runtime species");
assert.equal(optimizationGapAudit.currentVerifiedBaseline.candidateProfilesRuntimeIntegrated, false, "candidate roster must not be described as runtime-integrated");
assert.equal(optimizationGapAudit.priorities.length, 8, "optimization gap audit must preserve all prioritized workstreams");
assert.ok(optimizationGapAudit.policies.includes("Do not merge CPUF and CPUE records by numeric index without independent identity checks."), "optimization plan must prevent unsafe cross-ROM index assumptions");


assert.equal(fairyMoveSemanticsAudit.crossRomConclusion.status, "cpuF_raw_move_records_crosschecked_for_all_eight_cpue_fairy_ids", "CPUF/CPUE Fairy-ID cross-check must remain explicit");
assert.equal(fairyMoveSemanticsAudit.crossRomConclusion.cpuFTypeId9OccurrencesAmongTheseIds, 0, "none of the eight corresponding CPUF records may be mislabelled as Project PM Fairy");
assert.deepEqual(fairyMoveSemanticsAudit.crossRomConclusion.sameDisplayNameIds, [186, 204, 236], "only the three same-name IDs should be described as name-matched");
assert.ok(fairyMoveSemanticsAudit.crossRomConclusion.limitations.includes("Les effets de combat CPUE restent non certifiés."), "CPUE move effects must remain marked unverified");
assert.equal(levelUpMoveUsageAudit.platinumNameCrosscheck.status, "names_crosschecked_for_eight_project_pm_fairy_type_ids", "CPUF name cross-check must stay scoped to the eight IDs");
assert.deepEqual(levelUpMoveUsageAudit.moves.filter((move) => move.platinumNameFrFromNameBank).map((move) => move.moveId), [66, 140, 186, 204, 236, 295, 296, 461], "CPUF name cross-check must cover exactly the eight CPUE Fairy IDs");


assert.equal(candidateRosterProfiles.status, "candidate_full_roster_493_needs_semantic_and_runtime_review", "493-species candidate must not be treated as integrated runtime data");
assert.equal(candidateRosterProfiles.policy.runtimeIntegrated, false, "candidate roster must remain out of runtime until reviewed");
assert.equal(candidateRosterProfiles.source.platinumSha256, catalog.profiles.platinum.sha256, "candidate roster must match CPUF ROM hash");
assert.equal(candidateRosterProfiles.source.projectPmSha256, catalog.profiles.project_pm.sha256, "candidate roster must match CPUE ROM hash");
assert.equal(candidateRosterProfiles.base.length, 493, "candidate roster must cover all 493 standard species");
assert.deepEqual(candidateRosterProfiles.base.map((row) => row[1]), Array.from({ length: 493 }, (_, i) => i + 1), "candidate roster IDs must be complete, unique, and ordered");
assert.equal(new Set(candidateRosterProfiles.base.map((row) => row[0])).size, 493, "candidate roster French names must be unique");
assert.deepEqual(candidateRosterProfiles.base.map((row) => row[0]), frenchSpeciesNames.species.map((row) => row.nameFr), "candidate roster names must match the French reference");
assert.equal(candidateRosterProfiles.counts.projectPmOverrides, Object.keys(candidateRosterProfiles.project_pm_overrides).length, "candidate override count must match its records");
assert.equal(candidateRosterProfiles.counts.statsChanged, 197, "candidate audit must retain the 197 CPUE stat changes");
assert.equal(candidateRosterProfiles.counts.typesChanged, 60, "candidate audit must retain the 60 CPUE type-pair changes");
assert.equal(candidateRosterProfiles.counts.bothStatsAndTypesChanged, 42, "candidate audit must retain the 42 species changing both stats and types");
assert.equal(candidateRosterProfiles.counts.projectPmOverrides, 215, "candidate audit must retain all stat/type overrides");
assert.ok(candidateRosterProfiles.base.every((row) => row.length === 9 && row[2].length === 2 && row.slice(3).every((stat) => Number.isInteger(stat) && stat > 0)), "candidate base rows must contain two types and six positive base stats");
assert.ok(Object.values(candidateRosterProfiles.project_pm_overrides).every((row) => row.length === 2 && row[0].length === 2 && !row[0].includes("Inconnu") && row[1].length === 6 && row[1].every((stat) => Number.isInteger(stat) && stat > 0)), "candidate CPUE overrides must have resolved types and six positive stats");
const candidateBaseById = new Map(candidateRosterProfiles.base.map((row) => [row[1], row]));
const candidateBaseByName = new Map(candidateRosterProfiles.base.map((row) => [row[0], row]));
assert.equal(Object.keys(candidateRosterProfiles.project_pm_overrides).length, 215, "CPUE override keys must cover the audited 215 species");
assert.ok(Object.keys(candidateRosterProfiles.project_pm_overrides).every((name) => candidateBaseByName.has(name)), "every CPUE override must resolve to a candidate species name");
const candidateDeltaCounts = Object.entries(candidateRosterProfiles.project_pm_overrides).reduce((counts, [name, override]) => {
  const baseRow = candidateBaseByName.get(name);
  assert.ok(baseRow, `CPUE override ${name} must have a base species row`);
  const typeChanged = JSON.stringify(baseRow[2]) !== JSON.stringify(override[0]);
  const statsChanged = JSON.stringify(baseRow.slice(3)) !== JSON.stringify(override[1]);
  if (typeChanged) counts.typesChanged++;
  if (statsChanged) counts.statsChanged++;
  if (typeChanged && statsChanged) counts.bothStatsAndTypesChanged++;
  return counts;
}, { typesChanged: 0, statsChanged: 0, bothStatsAndTypesChanged: 0 });
assert.deepEqual(candidateDeltaCounts, {
  typesChanged: candidateRosterProfiles.counts.typesChanged,
  statsChanged: candidateRosterProfiles.counts.statsChanged,
  bothStatsAndTypesChanged: candidateRosterProfiles.counts.bothStatsAndTypesChanged
}, "candidate CPUE delta summary must be recomputed from base rows and override records");
assert.ok(candidateRosterProfiles.base.every((row) => row.slice(3).every((stat) => stat <= 255)), "candidate base stats must fit unsigned ROM stat bytes");
assert.ok(Object.values(candidateRosterProfiles.project_pm_overrides).every((row) => row[1].every((stat) => stat <= 255)), "candidate CPUE override stats must fit unsigned ROM stat bytes");
for (const row of romRosterProfiles.base) {
  assert.deepEqual(candidateBaseById.get(row[1]), row, `existing base profile ${row[0]} must match candidate CPUF profile`);
}
for (const [name, override] of Object.entries(romRosterProfiles.project_pm_overrides)) {
  assert.deepEqual(candidateRosterProfiles.project_pm_overrides[name], override, `existing CPUE override ${name} must match candidate profile`);
}

assert.equal(frenchSpeciesNames.status, "external_french_name_reference_candidate", "French species names must remain clearly labeled as an external reference");
assert.equal(frenchSpeciesNames.species.length, 493, "French name reference must cover all standard Gen IV species");
assert.equal(frenchSpeciesNames.validation.uniqueNamesFirst493, 493, "French names must be unique in the standard 1–493 range");
assert.deepEqual(frenchSpeciesNames.species.map((row, index) => row.id), Array.from({ length: 493 }, (_, i) => i + 1), "French names must map to canonical species IDs 1–493");
assert.deepEqual(frenchSpeciesNames.species.map((row) => row.canonicalSymbol), canonical.species.map((row) => row.symbol), "French names must preserve canonical Gen IV species ordering");
assert.deepEqual(frenchSpeciesNames.validation.mismatches, [], "corrected roster names must match the French reference");
assert.equal(frenchSpeciesNames.validation.exactNameMatches, romRosterProfiles.base.length, "all existing roster names must match the French reference");
assert.equal(frenchSpeciesNames.validation.mismatchCount, 0, "no current roster display name should remain mismatched");

assert.equal(rosterCoverageAudit.source.platinumSha256, catalog.profiles.platinum.sha256, "roster coverage audit must match CPUF hash");
assert.equal(rosterCoverageAudit.source.projectPmSha256, catalog.profiles.project_pm.sha256, "roster coverage audit must match CPUE hash");
assert.equal(rosterCoverageAudit.counts.canonicalSpecies, canonical.species.length, "roster coverage must count the full canonical Gen IV species range");
assert.equal(rosterCoverageAudit.counts.profilesInData, romRosterProfiles.base.length, "roster coverage profile count must match the source profiles");
assert.equal(rosterCoverageAudit.counts.uniqueProfileIds, new Set(romRosterProfiles.base.map(row => row[1])).size, "roster coverage unique-ID count must match source profiles");
assert.equal(rosterCoverageAudit.counts.canonicalIdsCovered, 71, "current audited roster coverage must remain 71 until a validated expansion is integrated");
assert.equal(rosterCoverageAudit.counts.canonicalIdsMissing, 422, "current uncovered canonical species count must remain explicit");
assert.deepEqual(rosterCoverageAudit.counts.profileIdsOutsideCanonicalRange, [], "roster profiles must not silently include IDs outside canonical 1–493");
assert.deepEqual(rosterCoverageAudit.counts.duplicateProfileIds, [], "roster profiles must not duplicate species IDs");
const rosterProfileIds = new Set(romRosterProfiles.base.map(row => row[1]));
assert.deepEqual(
  rosterCoverageAudit.covered,
  romRosterProfiles.base.map(row => ({ id: row[1], name: row[0], canonicalSymbol: canonical.species.find(species => species.id === row[1])?.symbol ?? null })).sort((a, b) => a.id - b.id),
  "roster coverage entries must match the current profiles and canonical symbols",
);
assert.deepEqual(
  rosterCoverageAudit.missing,
  canonical.species.filter(species => !rosterProfileIds.has(species.id)).map(species => ({ id: species.id, canonicalSymbol: species.symbol })),
  "roster coverage missing IDs must be the exact complement of the current profiles",
);
assert.equal(rosterCoverageAudit.scope.noRuntimeChanges, true, "coverage audit must not claim runtime expansion");
assert.equal(rosterCoverageAudit.scope.coverageIsNotSemanticCertification, true, "coverage must not be confused with semantic validation");


assert.equal(fairyMoveSemanticsAudit.status, "raw_fields_crosschecked_effect_hypotheses_recorded_not_certified", "Fairy move audit must keep effect interpretations explicitly provisional");
assert.equal(fairyMoveSemanticsAudit.source.platinumSha256, catalog.profiles.platinum.sha256, "Fairy move semantics audit must match CPUF hash");
assert.equal(fairyMoveSemanticsAudit.source.projectPmSha256, catalog.profiles.project_pm.sha256, "Fairy move semantics audit must match CPUE hash");
assert.equal(fairyMoveSemanticsAudit.counts.records, 8, "Fairy move semantics audit must cover eight entries");
assert.equal(fairyMoveSemanticsAudit.counts.typeId9, 8, "all audited CPUE moves must retain raw type ID 9");
assert.equal(fairyMoveSemanticsAudit.counts.namesVerified, 8, "all eight audited move display names must be verified");
assert.equal(fairyMoveSemanticsAudit.counts.multiFieldChanges, 5, "five Fairy moves must retain multi-field changes");
assert.equal(fairyMoveSemanticsAudit.counts.typeOnlyChanges, 3, "three Fairy moves must retain type-only changes");
assert.equal(fairyMoveSemanticsAudit.counts.effectIdChanged, 5, "five Fairy moves must retain explicit effect-ID changes");
assert.equal(fairyMoveSemanticsAudit.policies.nameEvidenceDoesNotCertifyBattleEffect, true, "decoded move names must not certify battle semantics");
assert.equal(fairyMoveSemanticsAudit.policies.noInheritanceOfCanonicalEffectSemantics, true, "canonical move effects must not be inherited automatically");
assert.equal(fairyMoveSemanticsAudit.policies.noRuntimeActivationUntilEffectsVerified, true, "unverified Fairy moves must remain out of runtime mechanics");
assert.equal(fairyMoveSemanticsAudit.policies.canonicalEffectSymbolsAreHypothesesOnly, true, "canonical effect symbols must remain hypotheses for CPUE");
assert.equal(fairyMoveSemanticsAudit.policies.semanticHypothesesDoNotPermitRuntimeActivation, true, "effect hypotheses must not permit runtime activation");
assert.equal(fairyMoveSemanticsAudit.policies.noGen4CompatibilityClaimWithoutBattleHandlerEvidence, true, "Gen IV compatibility requires battle-handler evidence");
assert.equal(fairyMoveSemanticsAudit.semanticHypotheses.length, 8, "all eight Fairy moves must have a recorded effect hypothesis");
assert.deepEqual(fairyMoveSemanticsAudit.semanticHypotheses.map(row => row.id), [66, 140, 186, 204, 236, 295, 296, 461], "effect hypotheses must map to the eight audited move IDs");
assert.ok(fairyMoveSemanticsAudit.semanticHypotheses.every(row => row.verifiedForProjectPmRuntime === false && row.verifiedForGen4Mechanics === false), "effect hypotheses must never be marked runtime- or Gen IV-verified");
assert.deepEqual(fairyMoveSemanticsAudit.semanticHypotheses.map(row => row.canonicalSymbolAtSameIndex), ["BATTLE_EFFECT_LOWER_ATTACK_HIT", "BATTLE_EFFECT_RECOVER_HALF_DAMAGE_DEALT", "BATTLE_EFFECT_STATUS_CONFUSE", "BATTLE_EFFECT_ATK_DOWN_2", "BATTLE_EFFECT_HEAL_HALF_MORE_IN_SUN", "BATTLE_EFFECT_HIT", "BATTLE_EFFECT_BYPASS_ACCURACY", "BATTLE_EFFECT_LOWER_SP_ATK_HIT"], "canonical symbols at effect IDs must remain cross-checked candidates");

assert.deepEqual(fairyMoveSemanticsAudit.records.map(row => [row.id, row.nameFrProjectPm]), [[66, "Câlinerie"], [140, "Vampibaiser"], [186, "Doux Baiser"], [204, "Charme"], [236, "Rayon Lune"], [295, "Éclat Magique"], [296, "Voix Enjôleuse"], [461, "Pouvoir Lunaire"]], "Fairy move names must match the decoded bank crosswalk");
assert.ok(fairyMoveSemanticsAudit.records.every(row => row.projectPm.typeId === 9 && row.effectAssessment.runtimeEffectSemanticsVerified === false), "all Fairy move raw records must preserve unresolved effect semantics");

assert.equal(levelUpMoveUsageAudit.status, "decoded_level_up_references_crosschecked_numeric_id_semantics_not_assumed", "learnset usage audit must not infer move identity from numeric ID");
assert.equal(levelUpMoveUsageAudit.source.platinumSha256, catalog.profiles.platinum.sha256, "learnset usage audit must match CPUF hash");
assert.equal(levelUpMoveUsageAudit.source.projectPmSha256, catalog.profiles.project_pm.sha256, "learnset usage audit must match CPUE hash");
assert.deepEqual(levelUpMoveUsageAudit.counts, { standardSpeciesRowsPlatinum: 493, standardSpeciesRowsProjectPm: 493, platinumLearnsetEntries: 6598, projectPmLearnsetEntries: 8590, invalidMoveReferencesPlatinum: 0, invalidMoveReferencesProjectPm: 0, moveIdsCompared: 12 }, "learnset usage audit counts must remain cross-checked");
assert.equal(levelUpMoveUsageAudit.moves.length, 12, "learnset usage audit must cover eight Fairy-type entries and four extra CPUE moves");
assert.deepEqual(levelUpMoveUsageAudit.moves.map(row => row.moveId), [66, 140, 186, 204, 236, 295, 296, 461, 468, 469, 470, 471], "learnset usage audit move IDs must be complete and ordered");
assert.equal(levelUpMoveUsageAudit.policies.noSemanticIdentityInferenceFromNumericId, true, "learnset comparisons must not infer semantic move identity by ID");
assert.ok(levelUpMoveUsageAudit.moves.every(row => row.platinumSameNumericIdUsage.speciesCount === row.platinumSameNumericIdUsage.records.length && row.projectPmUsage.speciesCount === row.projectPmUsage.records.length), "learnset usage counts must match their detailed records");
assert.ok(levelUpMoveUsageAudit.moves.every(row => row.numericIdIdentityWarning === true || row.platinumSameNumericIdNameChange === null), "renamed or extra moves must retain numeric-ID identity warnings");
assert.ok(levelUpMoveUsageAudit.moves.every(row => row.projectPmUsage.records.every(record => Number.isInteger(record.speciesId) && record.speciesId >= 1 && record.speciesId <= 493 && record.levels.length > 0)), "CPUE learnset usage entries must remain in the standard species range");
assert.equal(fairyMoveIdentityGuard.source.projectPmSha256, catalog.profiles.project_pm.sha256, "Fairy move identity guard must match the active CPUE hash");
assert.equal(fairyMoveIdentityGuard.source.projectPmTypeId, 9, "Fairy move identity guard must retain raw type ID 9");
assert.equal(fairyMoveIdentityGuard.status, "names_decoded_effect_semantics_pending", "Fairy move names must be decoded while effect semantics remain pending");
assert.equal(fairyMoveIdentityGuard.policy.allowRuntimeNameJoinByIndex, true, "direct ROM name-bank evidence permits the display-name join for these audited IDs");
assert.equal(fairyMoveIdentityGuard.policy.requireSemanticEffectValidation, true, "Project PM move battle effects must remain pending until independently validated");
assert.equal(fairyMoveIdentityGuard.runtimeChanges, false, "identity guard must not claim runtime changes");
assert.deepEqual(fairyMoveIdentityGuard.entries.map(row => row.id).sort((a,b) => a-b), [66,140,186,204,236,295,296,461], "Fairy move guard must contain the exact eight audited IDs");
assert.equal(new Set(fairyMoveIdentityGuard.entries.map(row => row.id)).size, 8, "Fairy move guard IDs must be unique");
assert.equal(fairyMoveIdentityGuard.entries.filter(row => row.changeClass === "multiple_fields_changed").length, 5, "five Fairy-type entries must remain flagged for multi-field changes");
assert.equal(fairyMoveIdentityGuard.entries.filter(row => row.changeClass === "type_field_only_changed").length, 3, "three Fairy-type entries must remain flagged as type-only changes");
const expectedFairyMoveNames = new Map([[66, "Câlinerie"], [140, "Vampibaiser"], [186, "Doux Baiser"], [204, "Charme"], [236, "Rayon Lune"], [295, "Éclat Magique"], [296, "Voix Enjôleuse"], [461, "Pouvoir Lunaire"]]);
for (const entry of fairyMoveIdentityGuard.entries) {
  assert.ok(entry.canonicalSymbolReferenceOnly, `move ${entry.id} must retain its canonical reference symbol`);
  assert.equal(entry.nameBankText, expectedFairyMoveNames.get(entry.id), `move ${entry.id} must match the decoded Project PM name-bank text`);
  assert.equal(entry.nameStatus, "verified_name_only", `move ${entry.id} name must be verified without implying effect validation`);
  assert.equal(entry.changedFields.typeId[1], 9, `move ${entry.id} must target Project PM raw type 9`);
}

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

assert.equal(typeByteAudit.source.directRomBinaryRecheck, true, "type-byte report must record direct ROM binary rechecking");
assert.equal(typeByteAudit.directRomVerification.scriptPath, "scripts/audit-rom-type-bytes.mjs", "type-byte audit must identify its reproducible ROM parser");
assert.deepEqual(typeByteAudit.directRomVerification.nitroFsFileCount, { platinum: 340, project_pm: 340 }, "direct type audit must preserve verified NitroFS counts");
assert.deepEqual(typeByteAudit.directRomVerification.personalArchive.entries, { platinum: 508, project_pm: 509 }, "direct personal archive counts must remain verified");
assert.deepEqual(typeByteAudit.directRomVerification.moveArchive.entries, { platinum: 471, project_pm: 472 }, "direct move archive counts must remain verified");
assert.deepEqual(typeByteAudit.directRomVerification.platinum.speciesEntriesContainingTypeId9, [], "direct CPUF type audit must not map type ID 9 to Fairy");
assert.equal(typeByteAudit.directRomVerification.platinum.speciesTypeId9SlotCount, 0, "direct CPUF species type ID 9 slot count must remain zero");
assert.deepEqual(typeByteAudit.directRomVerification.platinum.movesContainingTypeId9, [174], "direct CPUF move type ID 9 must remain isolated");
assert.equal(typeByteAudit.directRomVerification.project_pm.speciesEntriesContainingTypeId9.length, 31, "direct CPUE type ID 9 species list must contain 31 entries");
assert.equal(typeByteAudit.directRomVerification.project_pm.speciesTypeId9SlotCount, 37, "direct CPUE type ID 9 must occur in 37 type slots");
assert.deepEqual(typeByteAudit.directRomVerification.project_pm.movesContainingTypeId9, [66, 140, 186, 204, 236, 295, 296, 461], "direct CPUE type ID 9 move IDs must match the ROM bytes");
assert.deepEqual(typeByteAudit.directRomVerification.project_pm.internalSpeciesId6RawTypeIds, [10, 16], "direct CPUE species ID 6 type bytes must match current ROM");
assert.equal(typeByteAudit.directRomVerification.project_pm.internalSpeciesId6RawPrefixHex, "4e544e646e550a102dd1", "direct CPUE species ID 6 raw bytes must remain recorded");

assert.equal(speciesNameBankAudit.source.platinumSha256, catalog.profiles.platinum.sha256, "species name-bank audit must match CPUF hash");
assert.equal(speciesNameBankAudit.source.projectPmSha256, catalog.profiles.project_pm.sha256, "species name-bank audit must match CPUE hash");
assert.equal(speciesNameBankAudit.source.nameBankIndex, 412, "species name-bank index must remain tied to the pinned symbol table");
assert.equal(speciesNameBankAudit.source.nameBankKey, 30764, "species name-bank encryption key must match the pinned reference");
assert.equal(speciesNameBankAudit.source.nameBankEntryCount, 496, "species name bank must contain 496 decoded entries");
assert.equal(speciesNameBankAudit.results.bothRomBanksIdentical, true, "species name banks must remain byte-decoded identically across the two ROM profiles");
assert.deepEqual(speciesNameBankAudit.results.anchors, {"1":"BULBIZARRE","6":"DRACAUFEU","35":"MELOFEE","122":"M. MIME","223":"REMORAID","458":"BABIMANTA","467":"MAGANON","468":"TOGEKISS","493":"ARCEUS"}, "species name-bank anchor crosswalk must remain stable");
assert.deepEqual(speciesNameBankAudit.results.sharedFormIdsWithoutDedicatedNames, [496,497,498,499,500,501,502,503,504,505,506,507], "unmapped form IDs must remain explicit");
assert.equal(speciesNameBankAudit.results.projectPmExtraSpeciesIdWithoutDedicatedName, 508, "Project PM extra species ID must remain explicitly unmapped by this name bank");

assert.equal(speciesCoreDeltaAudit.source.platinumSha256, catalog.profiles.platinum.sha256, "species delta audit must match CPUF hash");
assert.equal(speciesCoreDeltaAudit.source.projectPmSha256, catalog.profiles.project_pm.sha256, "species delta audit must match CPUE hash");
assert.equal(speciesCoreDeltaAudit.counts.standardSpeciesCompared, 493, "species delta audit must compare all standard IDs 1-493");
assert.equal(speciesCoreDeltaAudit.counts.fullPersonalRecordChanged, 488, "species delta audit must preserve full-record change count");
assert.equal(speciesCoreDeltaAudit.counts.fullPersonalRecordUnchanged, 5, "species delta audit must preserve unchanged-record count");
assert.equal(speciesCoreDeltaAudit.counts.baseStatsChanged, 197, "species delta audit must preserve stat-change count");
assert.equal(speciesCoreDeltaAudit.counts.typePairChanged, 60, "species delta audit must preserve type-change count");
assert.equal(speciesCoreDeltaAudit.counts.speciesWithBothStatsAndTypesChanged, 42, "species delta audit must preserve overlapping stat/type changes");
assert.deepEqual(speciesCoreDeltaAudit.source.standardSpeciesIds, [1, 493], "species delta audit must keep the standard species range explicit");

assert.equal(extendedNameBankAudit.source.platinumSha256, catalog.profiles.platinum.sha256, "extended name bank audit must match CPUF hash");
assert.equal(extendedNameBankAudit.source.projectPmSha256, catalog.profiles.project_pm.sha256, "extended name bank audit must match CPUE hash");
assert.equal(extendedNameBankAudit.banks.items.index, 392, "item name bank index must match pinned reference");
assert.equal(extendedNameBankAudit.banks.items.platinumEntryCount, 468, "CPUF item-name count must remain recorded");
assert.equal(extendedNameBankAudit.banks.items.projectPmEntryCount, 492, "CPUE item-name count must remain recorded");
assert.equal(extendedNameBankAudit.banks.items.projectPmOnlyEntries.length, 24, "Project PM must retain 24 additional item names");
assert.deepEqual(extendedNameBankAudit.banks.items.projectPmOnlyEntries.find(([id]) => id === 479), [479, "Joyau Fée"], "Fairy gem name must remain mapped to its raw item ID");
assert.equal(extendedNameBankAudit.banks.abilities.projectPmEntryCount, 127, "Project PM ability-name bank must contain 127 entries");
assert.deepEqual(extendedNameBankAudit.banks.abilities.projectPmOnlyEntries, [[124,"Sans Limite"],[125,"Farceur"],[126,"Baigne Sable"]], "extra Project PM ability names must remain explicit");
assert.equal(extendedNameBankAudit.banks.moves.projectPmEntryCount, 472, "Project PM move-name bank must contain 472 entries");
assert.deepEqual(extendedNameBankAudit.banks.moves.projectPmOnlyEntries, [[468,"Piétinement"],[469,"Cavalerie Lourde"],[470,"Triple Axel"],[471,"Psycho-Croc"]], "extra Project PM move names must remain explicit");
const addedMoveDataAudit = readJson("data/project_pm_added_move_data_audit.json");
assert.equal(addedMoveDataAudit.source.platinumSha256, catalog.profiles.platinum.sha256, "added-move data audit must match CPUF hash");
assert.equal(addedMoveDataAudit.source.projectPmSha256, catalog.profiles.project_pm.sha256, "added-move data audit must match CPUE hash");
assert.deepEqual(addedMoveDataAudit.records.map((row) => [row.id, row.nameBankText]), extendedNameBankAudit.banks.moves.projectPmOnlyEntries, "added-move data names must match the decoded Project PM name bank");
assert.deepEqual(addedMoveDataAudit.records.map((row) => [row.id, row.effectId, row.category, row.power, row.type, row.accuracy, row.pp, row.raw]), [
  [468, 70, "physical", 60, "Sol", 100, 20, "4600003c046414640800003212040000"],
  [469, 0, "physical", 95, "Sol", 95, 10, "0000005f045f0a000000003311040000"],
  [470, 104, "physical", 20, "Glace", 90, 10, "680000140f5a0a000000007307000000"],
  [471, 186, "physical", 75, "Psy", 100, 25, "ba00004b0e6419000000003305030000"]
], "added-move data audit must preserve decoded raw move records");
assert.equal(addedMoveDataAudit.validation.runtimeEffectSemanticsVerified, false, "added move effects must not be treated as semantically certified");
assert.equal(addedMoveDataAudit.validation.canonicalGenerationCompatibilityVerified, false, "added moves must not be treated as Gen IV-compatible without validation");
assert.ok(addedMoveDataAudit.records.every((row) => /^[0-9a-f]{32}$/.test(row.raw)), "every added move must preserve a 16-byte raw record");
assert.equal(addedMoveDataAudit.validation.canonicalEffectSymbolCandidatesCrossReferenced, true, "added move audit must cross-reference candidate canonical effect symbols");
assert.equal(addedMoveDataAudit.validation.canonicalEffectIndicesCheckedAgainstPinnedReference, true, "added move effect indices must be checked against the pinned canonical table");
assert.deepEqual(
  addedMoveDataAudit.records.map((row) => [row.id, row.effectId, row.canonicalEffectIndex, row.canonicalEffectSymbolCandidate]),
  [
    [468, 70, 70, "BATTLE_EFFECT_LOWER_SPEED_HIT"],
    [469, 0, 0, "BATTLE_EFFECT_HIT"],
    [470, 104, 104, "BATTLE_EFFECT_HIT_THREE_TIMES"],
    [471, 186, 186, "BATTLE_EFFECT_REMOVE_SCREENS"],
  ],
  "added move effect IDs must match zero-based symbols in the pinned canonical reference",
);
assert.equal(addedMoveDataAudit.validation.identityCandidatesAreHypothesesOnly, true, "added move identity candidates must remain hypotheses");
assert.equal(addedMoveDataAudit.validation.effectRuntimeSemanticsVerified, false, "candidate effect symbols must not certify Project PM runtime semantics");
assert.deepEqual(
  addedMoveDataAudit.records.map((row) => [row.id, row.canonicalEffectSymbolCandidate, row.identityCandidate, row.identityConfidence]),
  special.extraMoves.map((row) => [row.id, row.canonicalEffectSymbol, row.identityCandidate, row.identityConfidence]),
  "added move candidate mappings must stay synchronized with the special-entry audit",
);

assert.equal(extendedNameBankAudit.banks.moves.commonNamesChanged, 10, "common move-name changes must remain audited");
assert.equal(extendedNameBankAudit.banks.items.commonNamesChanged, 16, "common item-name changes must remain audited");

assert.equal(typeByteAudit.typeId9ProjectPmNameCrosswalk.length, 31, "Project PM type ID 9 must be cross-referenced to all 31 name-bank entries");
assert.deepEqual(typeByteAudit.typeId9ProjectPmNameCrosswalk.find(([id]) => id === 467), [467, "MAGANON"], "type ID 9 crosswalk must preserve the mod-specific Maganon entry");
assert.deepEqual(typeByteAudit.typeId9ProjectPmNameCrosswalk.find(([id]) => id === 468), [468, "TOGEKISS"], "type ID 9 crosswalk must preserve the Togekiss entry");

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
assert.deepEqual(evolutionMethodAudit.directRomVerification.speciesNameCrosswalk.anchors, {
  "223": { name: "REMORAID", displayName: "Remoraid" },
  "224": { name: "OCTILLERY", displayName: "Octillery" },
  "458": { name: "BABIMANTA", displayName: "Babimanta" },
  "226": { name: "DEMANTA", displayName: "Demanta" }
}, "evolution audit species names must match the decoded ROM name-bank anchors");
assert.equal(evolutionMethodAudit.directRomVerification.speciesNameCrosswalk.status, "direct_rom_name_bank_decoded", "species names must be sourced from the decoded ROM name bank");
assert.match(evolutionMethodAudit.directRomVerification.observations.join(" "), /remplace la méthode 21 par la méthode 27/, "audit must retain the observed method-21 to method-27 change");
assert.match(evolutionMethodAudit.directRomVerification.limitations.join(" "), /does not prove that 27 has the same implementation/, "audit must not assume custom method semantics");


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
