import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const berries = JSON.parse(readFileSync(new URL("../data/berries_gen4.json", import.meta.url), "utf8"));
const romCatalog = JSON.parse(readFileSync(new URL("../data/rom_catalog.json", import.meta.url), "utf8"));
const romOverrides = JSON.parse(readFileSync(new URL("../data/rom_overrides.json", import.meta.url), "utf8"));
const romRosterProfiles = JSON.parse(readFileSync(new URL("../data/rom_roster_profiles.json", import.meta.url), "utf8"));
const romDeltaAudit = JSON.parse(readFileSync(new URL("../data/rom_delta_audit.json", import.meta.url), "utf8"));
const gen4ReferenceStatus = JSON.parse(readFileSync(new URL("../data/gen4_reference_status.json", import.meta.url), "utf8"));
const gen4IdReference = JSON.parse(readFileSync(new URL("../data/gen4_id_reference.json", import.meta.url), "utf8"));
const checks = [];
function check(name, fn) {
  try { fn(); checks.push({ name, status: "PASS" }); }
  catch (error) { checks.push({ name, status: "FAIL", message: error.message }); }
}

check("Canonical Gen IV identifier reference has exact bounded IDs and sentinels excluded", () => {
  assert.equal(gen4IdReference.source.commit, gen4ReferenceStatus.reference.commit);
  assert.equal(gen4IdReference.species.length, 493);
  assert.equal(gen4IdReference.species[0].id, 1);
  assert.equal(gen4IdReference.species[0].symbol, "SPECIES_BULBASAUR");
  assert.equal(gen4IdReference.species[492].id, 493);
  assert.equal(gen4IdReference.species[492].symbol, "SPECIES_ARCEUS");
  assert.equal(gen4IdReference.moves.length, 467);
  assert.equal(gen4IdReference.moves[0].id, 1);
  assert.equal(gen4IdReference.moves[466].id, 467);
  assert.equal(gen4IdReference.moves[466].symbol, "MOVE_SHADOW_FORCE");
  assert.equal(gen4IdReference.abilities.length, 123);
  assert.equal(gen4IdReference.types.length, 18);
  assert.equal(gen4IdReference.types[9].symbol, "TYPE_MYSTERY");
  assert.ok(gen4IdReference.warnings.some(rule => rule.includes("pas des noms français affichables")));
  assert.ok(!gen4IdReference.moves.some(move => move.id >= 468));
});

check("Strategic data schema explicitly separates raw extraction from verified runtime data", () => {
  const schema = JSON.parse(readFileSync(new URL("../data/strategic_data_schema.json", import.meta.url), "utf8"));
  assert.equal(schema.schemaVersion, "1.0.0");
  assert.equal(schema.status, "specification_only_not_runtime_data");
  assert.equal(romCatalog.canonicalIdReference.path, "data/gen4_id_reference.json");
  assert.equal(romCatalog.canonicalIdReference.sourceCommit, gen4IdReference.source.commit);
  assert.equal(romCatalog.canonicalIdReference.counts.species, gen4IdReference.species.length);
  assert.equal(romCatalog.strategicSchema.path, "data/strategic_data_schema.json");
  assert.equal(romCatalog.strategicSchema.status, schema.status);
  assert.ok(romCatalog.strategicSchema.deferredTables.includes("trainerDataRaw"));
  assert.equal(schema.joinPolicy.allowIndexOnlyCrossRomJoin, false);
  assert.equal(schema.joinPolicy.allowUnverifiedOverridesInRuntime, false);
  assert.ok(schema.entities.species.required.includes("provenance"));
  assert.ok(schema.entities.move.required.includes("provenance"));
  assert.ok(schema.runtimeAcceptanceRules.some(rule => rule.includes("noms ou d'effets inventés")));
  assert.ok(schema.runtimeAcceptanceRules.some(rule => rule.includes("hors périmètre immédiat")));
});

check("Gen IV move reference boundary is explicit and extra ROM IDs remain unmapped", () => {
  const boundary = gen4ReferenceStatus.moveTableBoundary;
  assert.equal(gen4ReferenceStatus.reference.commit, "06c6e9a0348da283be8d9225d0bec03c349ff5c2");
  assert.equal(boundary.sourcePath, "generated/moves.txt");
  assert.equal(boundary.sourceCommit, gen4ReferenceStatus.reference.commit);
  assert.equal(boundary.canonicalLastMoveId, 467);
  assert.equal(boundary.maxMovesSentinel, 468);
  assert.deepEqual(boundary.platinumExtraRecordIds, [468, 469, 470]);
  assert.deepEqual(boundary.projectPmExtraRecordIds, [468, 469, 470, 471]);
  assert.equal(boundary.status, "boundary_confirmed_names_unmapped");
  assert.ok(gen4ReferenceStatus.blockingRules.some(rule => rule.includes("IDs 0–467")));
});

check("Extra Project PM move IDs are confirmed in level-up learnsets without invented names", () => {
  const usage = gen4ReferenceStatus.moveTableBoundary.learnsetUsage;
  assert.equal(usage.sourceFile, "rom_battle_database.json");
  assert.equal(usage.sourceSha256.platinum, romCatalog.profiles.platinum.sha256);
  assert.equal(usage.sourceSha256.project_pm, romCatalog.profiles.project_pm.sha256);
  assert.equal(usage.platinumLevelUpReferencesToIds468Plus, 0);
  assert.equal(usage.projectPmLevelUpReferencesToIds468Plus, 56);
  assert.deepEqual(usage.projectPmReferencesById, {"468": 38, "469": 10, "470": 5, "471": 3});
  assert.equal(usage.distinctSpeciesReferencingExtraIds, 56);
  assert.equal(usage.status, "usage_confirmed_names_unmapped");
  assert.match(usage.interpretation, /ne doivent pas être inventés/);
});
 
check("ROM delta audit preserves provenance and labels raw differences as uncertified", () => {
  assert.equal(romDeltaAudit.schemaVersion, "1.0.0");
  assert.equal(romDeltaAudit.source.platinum.gameCode, romCatalog.profiles.platinum.gameCode);
  assert.equal(romDeltaAudit.source.project_pm.gameCode, romCatalog.profiles.project_pm.gameCode);
  assert.equal(romDeltaAudit.source.platinum.sha256, romCatalog.profiles.platinum.sha256);
  assert.equal(romDeltaAudit.source.project_pm.sha256, romCatalog.profiles.project_pm.sha256);
  assert.equal(romDeltaAudit.tables.species.platinumEntries, 508);
  assert.equal(romDeltaAudit.tables.species.projectPmEntries, 509);
  assert.equal(romDeltaAudit.tables.moves.platinumEntries, 471);
  assert.equal(romDeltaAudit.tables.moves.projectPmEntries, 472);
  assert.equal(romDeltaAudit.tables.berriesRaw.bytePositionsWithDifferences["4"], 64);
  assert.ok(romDeltaAudit.tables.berriesRaw.notes.some(item => item.includes("stageDuration")));
  assert.ok(romDeltaAudit.sources.some(source => source.path === "include/berry_data.h" && source.commit === "06c6e9a0348da283be8d9225d0bec03c349ff5c2"));
  assert.equal(romDeltaAudit.certificationStatus, "partial_unverified_differences");
  assert.ok(romDeltaAudit.blockingConflicts.some(item => item.includes("empreintes")));
  assert.ok(romDeltaAudit.tables.items.notes.some(item => item.includes("pas encore de certifier")));
});

check("ROM catalogue manifest has separate original and Project PM profiles", () => {
  assert.equal(romCatalog.schemaVersion, "1.0.0");
  assert.ok(romCatalog.profiles.platinum.gameCode);
  assert.ok(romCatalog.profiles.project_pm.gameCode);
  assert.notEqual(romCatalog.profiles.platinum.sha256, romCatalog.profiles.project_pm.sha256);
});
check("ROM catalogue does not falsely claim complete generator integration", () => {
  assert.equal(romCatalog.integration.loadedByGenerator, false);
  assert.equal(romCatalog.integration.rosterProfilesEmbedded, true);
  assert.equal(romCatalog.integration.rosterEntriesIntegrated, 71);
  assert.equal(romCatalog.integration.itemEffectsSemanticallyDecoded, false);
  assert.equal(romCatalog.integration.encountersSemanticallyDecoded, false);
  assert.match(romCatalog.warning, /Manifeste/i);
});
check("ROM overrides preserve source provenance and verified-only status", () => {
  assert.equal(romOverrides.status, "historical_audit_unreconciled");
  assert.match(romOverrides.warning, /NE DOIT PAS être appliqué/);
  assert.ok(romOverrides.profiles.platinum.sha256);
  assert.ok(romOverrides.profiles.project_pm.sha256);
  assert.ok(romOverrides.pokemon.every((entry) => entry.status === "decoded_verified"));
  assert.ok(romOverrides.moves.every((entry) => entry.status === "decoded_verified"));
});
check("HTML document declares French language", () => {
  assert.match(html, /<html lang="fr">/);
});
check("one inline JavaScript program is present", () => {
  assert.match(html, /<script>[\s\S]*?<\/script>/);
});
check("inline JavaScript parses", () => {
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(match, "inline script not found");
  // Compile only; don't execute browser code in Node.
  new Function(match[1]);
});
check("strategic data-source selector offers both game references", () => {
  assert.match(html, /id="dataSources"/);
  assert.match(html, /data-value="platinum"[^>]*data-label="Pokémon Platine original"/);
  assert.match(html, /data-value="multiplayer"[^>]*data-label="Pokémon Platine multijoueur"/);
  assert.match(html, /const state=\{dataSource:"platinum"/);
});
check("selected reference drives team candidate roster and scoring", () => {
  assert.match(html, /function getActiveRoster\(\)/);
  assert.match(html, /const activeRoster=getActiveRoster\(\)/);
  assert.match(html, /activeRoster\.find/);
  assert.match(html, /eligibleLeg=activeRoster\.filter/);
  assert.match(html, /pool=activeRoster\.filter/);
  assert.match(html, /const romRosterData =/);
  assert.match(html, /verifiedProjectPmTypeOverrides=new Set\(\['Gardevoir','Togekiss'\]\)/);
  assert.match(html, /verifiedProjectPmTypeOverrides\.has\(p\.name\)/);
  assert.match(html, /p\.baseStats=stats/);
  assert.match(html, /p\.off=Math\.max\(stats\.attack,stats\.specialAttack\)/);
  assert.equal(romRosterProfiles.base.length, 71);
  assert.ok(romRosterProfiles.project_pm_overrides.Dracaufeu);
  assert.deepEqual(romRosterProfiles.project_pm_overrides.Dracaufeu[0], ["Feu", "Dragon"]);
  assert.deepEqual(romRosterProfiles.project_pm_overrides.Gardevoir[0], ["Psy", "Fée"]);
  assert.deepEqual(romRosterProfiles.project_pm_overrides.Togekiss[0], ["Fée", "Vol"]);
  for (const row of romRosterProfiles.base) {
    assert.equal(row.length, 9, `invalid base row: ${row[0]}`);
    assert.ok(Number.isInteger(row[1]) && row[1] > 0, `invalid Pokédex ID: ${row[0]}`);
    assert.ok(row.slice(3).every(v => Number.isInteger(v) && v >= 1 && v <= 255), `invalid stat: ${row[0]}`);
  }
  assert.doesNotMatch(html, /state\.dataSource==='multiplayer'&&p\.types\.includes\('Ténèbres'\)/);
});
check("selected reference is recorded in the generated summary", () => {
  assert.match(html, /referentielStrategique:state\.dataSource/);
  assert.match(html, /referentielStatut:/);
  assert.match(html, /updateDataSourceStatus\(\)/);
});
check("requested legendary count has explicit mapping", () => {
  assert.match(html, /\{none:0,one:1,two:2,three:3\}\[state\.legendary\]/);
});
check("starter trio is checked before rendering", () => {
  assert.match(html, /if\(missingStarters\.length\)failReasons\.push/);
  assert.ok(html.indexOf("if(failReasons.length)") < html.indexOf("const names=team.map"));
});
check("team size is checked before rendering", () => {
  assert.match(html, /if\(team\.length!==6\)failReasons\.push/);
});
check("evolution-max mode fails closed without metadata", () => {
  assert.match(html, /if\(state\.evo\)failReasons\.push/);
});
check("zero to two imposed held items are allowed", () => {
  assert.match(html, /if\(state\.items\.length>2\)/);
  assert.match(html, /state\.items\.length<2/);
  assert.match(html, /0\/2 objets imposés sélectionnés/);
});
check("generation-block message uses real line breaks", () => {
  assert.match(html, /GÉNÉRATION BLOQUÉE\\n/);
  assert.doesNotMatch(html, /GÉNÉRATION BLOQUÉE\\\\n/);
});
check("imposed items are included in the six-item team assignment", () => {
  assert.match(html, /const chosenItems=\[\.\.\.state\.items\]/);
  assert.match(html, /const itemTargets=bestAssignment\|\|chosenItems\.map/);
  assert.match(html, /Objets imposés : /);
});
check("held-item targets are unique", () => {
  assert.match(html, /function searchItemAssignment\(index,used,assignment,total\)/);
  assert.match(html, /if\(used\.has\(p\.name\)\)continue/);
  assert.match(html, /used\.add\(p\.name\)/);
  assert.match(html, /used\.delete\(p\.name\)/);
});
check("held-item assignment considers section 7 team parameters", () => {
  assert.match(html, /const itemMainTags=state\.strategies\.map/);
  assert.match(html, /const itemSecondaryTag=tagForSecondary\[state\.secondary\]/);
  assert.match(html, /if\(state\.orientation==='offensive'\)/);
  assert.match(html, /if\(state\.orientation==='defensive'\)/);
  assert.match(html, /if\(state\.orientation==='balanced'\)/);
  assert.match(html, /function itemFit\(item,p\)/);
});
check("free slots are not filtered by other starter trios", () => {
  assert.doesNotMatch(html, /pool=pool\.filter\(p=>state\.starter==='none'\|\|!starterNames\.includes\(p\.name\)\)/);
});
check("CI automatic threshold is 0–24%", () => {
  assert.match(html, /const auto=c<25/);
});
check("manual CI parameters require explicit adjustment", () => {
  assert.match(html, /state\.ciFrequencyAdjusted&&state\.incongruityAdjusted/);
});
check("100% competitiveness disables CI", () => {
  assert.match(html, /const lock=c===100/);
});
check("CI unresolved state blocks generation", () => {
  assert.match(html, /if\(!ciResolved\)\{out\.textContent='CONFIGURATION INCOMPLÈTE/);
});
check("UI identifies the result as heuristic", () => {
  assert.match(html, /Ce n’est pas encore le moteur stratégique complet/);
});
check("berry effects are not exposed in item UI", () => {
  assert.doesNotMatch(html, /Baie Éka[^\n]{0,100}effet/i);
});


check("berry records have required fields and generation-IV scope", () => {
  assert.ok(Array.isArray(berries.berries) && berries.berries.length > 0);
  for (const berry of berries.berries) {
    assert.ok(berry.name && berry.effect && berry.category && berry.verification_status, `incomplete berry record: ${berry.name ?? "(unnamed)"}`);
    assert.equal(berry.generation, 4, `wrong generation: ${berry.name}`);
    assert.equal(berry.available_in_pokemon_platinum, true, `availability not confirmed: ${berry.name}`);
  }
});
check("berry names are unique", () => {
  const names = berries.berries.map((berry) => berry.name);
  assert.equal(new Set(names).size, names.length);
});
check("berry catalog does not claim all 64 berries are complete", () => {
  assert.ok(berries.berries.length < 64, "update this guard only after all 64 berries have been audited");
  assert.match(berries.mechanics, /Partiellement vérifié/);
});

check("roster species IDs, names, types and overrides are structurally consistent", () => {
  assert.equal(romRosterProfiles.schemaVersion, "1.0.0");
  assert.deepEqual(romRosterProfiles.statsOrder, ["hp", "attack", "defense", "speed", "specialAttack", "specialDefense"]);
  const rows = romRosterProfiles.base;
  assert.ok(rows.every(row => !row[2].includes("Fée")), "Fairy type must never leak into the original Platinum base profile");
  assert.equal(rows.length, romCatalog.integration.rosterEntriesIntegrated);
  assert.equal(new Set(rows.map(row => row[0])).size, rows.length, "duplicate species names");
  assert.equal(new Set(rows.map(row => row[1])).size, rows.length, "duplicate National Pokédex IDs");
  const platinumTypes = new Set(["Normal", "Feu", "Eau", "Électrik", "Plante", "Glace", "Combat", "Poison", "Sol", "Vol", "Psy", "Insecte", "Roche", "Spectre", "Dragon", "Ténèbres", "Acier", "Inconnu"]);
  const projectPmTypes = new Set([...platinumTypes, "Fée"]);
  for (const row of rows) {
    assert.equal(row.length, 9, `invalid profile row: ${row[0]}`);
    assert.ok(row[0].trim(), "empty species name");
    assert.ok(Number.isInteger(row[1]) && row[1] >= 1 && row[1] <= 493, `invalid Pokédex ID: ${row[0]}`);
    assert.ok(Array.isArray(row[2]) && row[2].length === 2, `invalid type pair: ${row[0]}`);
    assert.ok(row[2].every(type => platinumTypes.has(type)), `unrecognized/non-Platinum base type: ${row[0]}`);
    assert.ok(row.slice(3).every(stat => Number.isInteger(stat) && stat >= 1 && stat <= 255), `invalid base stat: ${row[0]}`);
  }
  for (const [name, override] of Object.entries(romRosterProfiles.project_pm_overrides)) {
    assert.ok(rows.some(row => row[0] === name), `override species absent from roster: ${name}`);
    assert.ok(Array.isArray(override) && override.length === 2, `invalid override shape: ${name}`);
    assert.ok(Array.isArray(override[0]) && override[0].length === 2, `invalid override types: ${name}`);
    assert.ok(override[0].every(type => projectPmTypes.has(type)), `unrecognized override type: ${name}`);
    assert.ok(Array.isArray(override[1]) && override[1].length === 6, `invalid override stats: ${name}`);
    assert.ok(override[1].every(stat => Number.isInteger(stat) && stat >= 1 && stat <= 255), `invalid override stat: ${name}`);
  }
  assert.deepEqual(romRosterProfiles.project_pm_overrides.Gardevoir[0], ["Psy", "Fée"]);
  assert.deepEqual(romRosterProfiles.project_pm_overrides.Togekiss[0], ["Fée", "Vol"]);
});

for (const result of checks) {
  console.log(`[${result.status}] ${result.name}`);
  if (result.message) console.error(`  ${result.message}`);
}
const failed = checks.filter((x) => x.status === "FAIL");
console.log(`\nResult: ${checks.length - failed.length}/${checks.length} passed`);
if (failed.length) process.exitCode = 1;
