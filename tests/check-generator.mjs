import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const berries = JSON.parse(readFileSync(new URL("../data/berries_gen4.json", import.meta.url), "utf8"));
const checks = [];
function check(name, fn) {
  try { fn(); checks.push({ name, status: "PASS" }); }
  catch (error) { checks.push({ name, status: "FAIL", message: error.message }); }
}

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

for (const result of checks) {
  console.log(`[${result.status}] ${result.name}`);
  if (result.message) console.error(`  ${result.message}`);
}
const failed = checks.filter((x) => x.status === "FAIL");
console.log(`\nResult: ${checks.length - failed.length}/${checks.length} passed`);
if (failed.length) process.exitCode = 1;
