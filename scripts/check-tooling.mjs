import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const pkg = JSON.parse(read("../package.json"));
const quality = read("../.github/workflows/quality.yml");
const pages = read("../.github/workflows/pages.yml");
const dependabot = read("../.github/dependabot.yml");
const lock = JSON.parse(read("../package-lock.json"));
const required = [
  "../tests/check-generator.mjs",
  "../tests/browser-generator.test.mjs",
  "../scripts/validate-rom-audits.mjs",
  "../scripts/audit-evolution-roms.mjs",
  "../scripts/audit-rom-type-bytes.mjs",
  "../scripts/audit-rom-species-name-bank.mjs",
  "../data/rom_species_name_bank_audit.json",
  "../data/project_pm_evolution_method_audit.json",
  "../data/project_pm_added_move_data_audit.json",
  "../data/project_pm_type_byte_audit.json",
  "../data/rom_catalog.json",
  "../data/rom_mapping_audit.json",
  "../data/project_pm_type_mapping.json",
  "../data/project_pm_fairy_type_audit.json",
  "../data/project_pm_fairy_move_identity_guard.json",
  "../data/project_pm_fairy_move_semantics_audit.json",
  "../data/project_pm_levelup_move_usage_audit.json",
  "../data/rom_roster_coverage_audit.json",
  "../data/rom_roster_profiles_candidate_493.json",
  "../data/gen4_french_species_name_reference.json",
  "../docs/ACCELERATION_TOOLING.md",
  "../.github/dependabot.yml",
  "../package-lock.json"
];

for (const path of required) {
  assert.ok(existsSync(new URL(path, import.meta.url)), `required tooling input missing: ${path}`);
}

assert.equal(pkg.scripts["test:static"], "node tests/check-generator.mjs");
assert.equal(pkg.scripts["test:rom-audits"], "node scripts/validate-rom-audits.mjs");
assert.equal(pkg.scripts["test:browser"], "node tests/browser-generator.test.mjs");
assert.equal(pkg.scripts["test:tooling"], "node scripts/check-tooling.mjs");
assert.equal(pkg.scripts["audit:rom:types"], "node scripts/audit-rom-type-bytes.mjs");
assert.equal(pkg.scripts["audit:rom:evolutions"], "node scripts/audit-evolution-roms.mjs");
assert.equal(pkg.scripts["audit:rom:names"], "node scripts/audit-rom-species-name-bank.mjs");
for (const [name, script] of [
  ["audit:rom:types", "../scripts/audit-rom-type-bytes.mjs"],
  ["audit:rom:evolutions", "../scripts/audit-evolution-roms.mjs"],
  ["audit:rom:names", "../scripts/audit-rom-species-name-bank.mjs"],
]) {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL(script, import.meta.url))], {
    encoding: "utf8",
    timeout: 5000,
  });
  assert.equal(result.status, 2, `${name}: missing ROM arguments must exit with usage status 2`);
  assert.match(result.stderr, /Usage: node scripts\/(?:audit-rom-.*|audit-evolution-.*)\.mjs <CPUF\.nds> <CPUE\.nds>/, `${name}: missing ROM arguments must print usage`);
}


const invalidRomDir = mkdtempSync(new URL(`file://${tmpdir()}/tooling-invalid-rom-`).pathname);
const invalidRomPath = new URL(`file://${invalidRomDir}/invalid.nds`).pathname;
try {
  writeFileSync(invalidRomPath, Buffer.alloc(128, 0));
  for (const [name, script] of [
    ["audit:rom:types", "../scripts/audit-rom-type-bytes.mjs"],
    ["audit:rom:evolutions", "../scripts/audit-evolution-roms.mjs"],
    ["audit:rom:names", "../scripts/audit-rom-species-name-bank.mjs"],
  ]) {
    const result = spawnSync(process.execPath, [
      fileURLToPath(new URL(script, import.meta.url)),
      invalidRomPath,
      invalidRomPath,
    ], { encoding: "utf8", timeout: 5000 });
    assert.notEqual(result.status, 0, `${name}: invalid ROM input must fail`);
    assert.doesNotMatch(result.stdout, /"status":\s*"direct_rom_/, `${name}: invalid ROM must not produce a successful audit report`);
  }
} finally {
  rmSync(invalidRomDir, { recursive: true, force: true });
}

for (const name of ["test:static", "test:rom-audits", "test:browser", "test:tooling"]) {
  assert.ok(pkg.scripts.test.includes(`npm run ${name}`), `full test suite must include ${name}`);
}
assert.ok(!existsSync(new URL("../.github/workflows/generator-checks.yml", import.meta.url)), "duplicate generator-checks workflow must remain removed");
assert.match(quality, /pull_request:/, "quality workflow must validate pull requests");
assert.equal(lock.lockfileVersion, 3, "npm lockfile must use a supported v3 format");
assert.equal(lock.packages[""].devDependencies.playwright, pkg.devDependencies.playwright, "lockfile must pin the declared Playwright version");
assert.match(quality, /cache: npm/, "quality workflow must use the lockfile-aware npm cache");
assert.match(pages, /cache: npm/, "Pages workflow must use the lockfile-aware npm cache");
assert.match(quality, /npm ci --no-audit --no-fund/, "quality workflow must install from the lockfile");
assert.match(pages, /npm ci --no-audit --no-fund/, "Pages workflow must install from the lockfile");
assert.match(quality, /npm test/, "quality workflow must run the full test suite");
assert.match(quality, /playwright install --with-deps chromium/, "quality workflow must install browser dependencies");
assert.match(quality, /actions\/cache@v\d+[\s\S]*?path: ~\/\.cache\/ms-playwright/, "quality workflow must cache the Playwright browser");
assert.match(pages, /actions\/cache@v\d+[\s\S]*?path: ~\/\.cache\/ms-playwright/, "Pages workflow must cache the Playwright browser");
assert.match(pages, /needs: test/, "Pages deployment must depend on the passing test job");
assert.match(pages, /npm test/, "Pages workflow must run the full test suite before deploy");
assert.match(pages, /permissions:\n  contents: read\n/, "Pages workflow must use read-only top-level permissions");
assert.match(pages, /deploy:\n    needs: test\n    permissions:\n      contents: read\n      pages: write\n      id-token: write/, "only the deploy job may receive Pages write and OIDC permissions");
assert.equal((dependabot.match(/package-ecosystem:/g) ?? []).length, 2, "Dependabot must monitor npm and GitHub Actions");
assert.equal((dependabot.match(/interval: "weekly"/g) ?? []).length, 2, "dependency update checks must run weekly");
console.log(`[PASS] tooling contract: ${required.length} required files, four test groups, CI and Pages quality gates`);
