import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const pkg = JSON.parse(read("../package.json"));
const quality = read("../.github/workflows/quality.yml");
const pages = read("../.github/workflows/pages.yml");
const dependabot = read("../.github/dependabot.yml");
const required = [
  "../tests/check-generator.mjs",
  "../tests/browser-generator.test.mjs",
  "../scripts/validate-rom-audits.mjs",
  "../data/rom_catalog.json",
  "../data/rom_mapping_audit.json",
  "../data/project_pm_type_mapping.json",
  "../data/project_pm_fairy_type_audit.json",
  "../docs/ACCELERATION_TOOLING.md",
  "../.github/dependabot.yml"
];

for (const path of required) {
  assert.ok(existsSync(new URL(path, import.meta.url)), `required tooling input missing: ${path}`);
}

assert.equal(pkg.scripts["test:static"], "node tests/check-generator.mjs");
assert.equal(pkg.scripts["test:rom-audits"], "node scripts/validate-rom-audits.mjs");
assert.equal(pkg.scripts["test:browser"], "node tests/browser-generator.test.mjs");
assert.equal(pkg.scripts["test:tooling"], "node scripts/check-tooling.mjs");
for (const name of ["test:static", "test:rom-audits", "test:browser", "test:tooling"]) {
  assert.ok(pkg.scripts.test.includes(`npm run ${name}`), `full test suite must include ${name}`);
}
assert.ok(!existsSync(new URL("../.github/workflows/generator-checks.yml", import.meta.url)), "duplicate generator-checks workflow must remain removed");
assert.match(quality, /pull_request:/, "quality workflow must validate pull requests");
assert.ok(!quality.includes("cache: npm") || existsSync(new URL("../package-lock.json", import.meta.url)), "npm cache requires a committed package-lock.json");
assert.match(quality, /npm test/, "quality workflow must run the full test suite");
assert.match(quality, /playwright install --with-deps chromium/, "quality workflow must install browser dependencies");
assert.match(quality, /actions\/cache@v\\d+[\s\S]*?path: ~\/\.cache\/ms-playwright/, "quality workflow must cache the Playwright browser");
assert.match(pages, /actions\/cache@v\\d+[\s\S]*?path: ~\/\.cache\/ms-playwright/, "Pages workflow must cache the Playwright browser");
assert.match(pages, /needs: test/, "Pages deployment must depend on the passing test job");
assert.match(pages, /npm test/, "Pages workflow must run the full test suite before deploy");
assert.match(pages, /permissions:\n  contents: read\n/, "Pages workflow must use read-only top-level permissions");
assert.match(pages, /deploy:\n    needs: test\n    permissions:\n      contents: read\n      pages: write\n      id-token: write/, "only the deploy job may receive Pages write and OIDC permissions");
assert.equal((dependabot.match(/package-ecosystem:/g) ?? []).length, 2, "Dependabot must monitor npm and GitHub Actions");
assert.equal((dependabot.match(/interval: "weekly"/g) ?? []).length, 2, "dependency update checks must run weekly");
console.log(`[PASS] tooling contract: ${required.length} required files, four test groups, CI and Pages quality gates`);
