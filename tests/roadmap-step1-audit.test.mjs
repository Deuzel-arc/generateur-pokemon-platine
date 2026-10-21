import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const matrix = JSON.parse(readFileSync("data/roadmap_step1_section_matrix.json", "utf8"));
const roadmap = readFileSync("CERTIFICATION/ROADMAP-13-ETAPES.md", "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

assert.equal(matrix.status, "audit_contract_versioned_gaps_explicit_not_full_generator_certification");
assert.equal(matrix.sections.length, 9, "step 1 must map all nine interface sections");
assert.deepEqual(matrix.sections.map(row => row.section), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
assert.equal(new Set(matrix.sections.map(row => row.name)).size, 9, "section names must be unique");
assert.equal(matrix.baseline.canonicalSpecies, 493);
assert.equal(matrix.baseline.runtimeRosterProfiles, 71);
assert.equal(matrix.baseline.canonicalSpeciesMissingFromRuntime, 422);
assert.equal(matrix.baseline.candidateRosterIntegrated, false);
assert.equal(matrix.baseline.cpuFAndCpueSeparated, true);
assert.ok(matrix.globalGuards.length >= 5);

for (const section of matrix.sections) {
  assert.ok(section.inputs.length > 0, `section ${section.section}: inputs must be named`);
  assert.ok(section.expectedBehavior.length > 20, `section ${section.section}: expected behavior must be explicit`);
  assert.ok(section.currentEvidence.length > 0, `section ${section.section}: current evidence must be recorded`);
  assert.ok(section.gaps.length > 0, `section ${section.section}: remaining gaps must not be hidden`);
  assert.ok(section.acceptanceCases.length >= 3, `section ${section.section}: acceptance cases must be enumerated`);
  for (const path of section.currentEvidence) {
    if (path.startsWith("CERTIFICATION/") || path.startsWith("tests/")) {
      assert.ok(existsSync(path), `section ${section.section}: evidence path does not exist: ${path}`);
    }
  }
}
assert.match(roadmap, /Étape 1 — Spécification, audit de départ et définition des critères/);
assert.equal(packageJson.scripts["test:roadmap-step1"], "node tests/roadmap-step1-audit.test.mjs");
assert.ok(packageJson.scripts.test.includes("npm run test:roadmap-step1"), "full test command must include the roadmap step 1 audit");

console.log("[PASS] feuille de route étape 1 : 9 sections mappées, critères d'acceptation et lacunes explicites, couverture runtime non surévaluée");
