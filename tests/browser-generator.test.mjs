import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await page.setContent(await readFile(new URL("../index.html", import.meta.url), "utf8"));

try {
  const choices = page.locator("#items .choice");
  assert.equal(await choices.count(), 6, "six objets proposés");
  assert.equal(await page.locator("#itemCount").innerText(), "0/2 objets imposés sélectionnés");

  // The reference selector must change the actual composition data, not only the UI.
  await page.locator('#dataSources [data-value="platinum"]').click();
  await page.locator('#starters [data-value="kanto"]').click();
  await page.locator("#validate").click();
  let sourceSummary = await page.locator("#summary").innerText();
  assert.match(sourceSummary, /"referentielStrategique": "platinum"/);
  assert.match(sourceSummary, /Dracaufeu — Feu \/ Vol/);

  await page.locator('#dataSources [data-value="multiplayer"]').click();
  await page.locator("#validate").click();
  sourceSummary = await page.locator("#summary").innerText();
  assert.match(sourceSummary, /"referentielStrategique": "multiplayer"/);
  assert.match(sourceSummary, /Dracaufeu — Feu \/ Vol/);
  console.log("[PASS] le référentiel sélectionné applique uniquement les types Project PM confirmés et figure dans le récapitulatif");

  // Zero imposed items is valid; the algorithm still assigns six distinct items.
  await page.locator("#validate").click();
  let summary = await page.locator("#summary").innerText();
  assert.match(summary, /Objets imposés : aucun/);
  const assigned0 = (summary.split("Objets attribués à l’équipe : ")[1]?.split("\n")[0] ?? "").split(", ").filter(Boolean);
  assert.equal(assigned0.length, 6, "six objets attribués sans contrainte");
  assert.equal(new Set(assigned0).size, 6, "objets attribués tous distincts");

  // One imposed item must be included in the resulting six-item set.
  await choices.nth(0).click();
  assert.equal(await page.locator("#items .choice.selected").count(), 1);
  assert.equal(await page.locator("#itemCount").innerText(), "1/2 objets imposés sélectionnés");
  const one = await page.locator("#items .choice.selected").first().getAttribute("data-value");
  await page.locator("#validate").click();
  summary = await page.locator("#summary").innerText();
  assert.match(summary, new RegExp("Objets imposés : " + one.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")));
  const assigned1 = (summary.split("Objets attribués à l’équipe : ")[1]?.split("\n")[0] ?? "").split(", ").filter(Boolean);
  assert.equal(assigned1.length, 6);
  assert.ok(assigned1.includes(one), "l’objet imposé doit être attribué");

  // Two imposed items must both be included, and a third cannot be selected.
  await choices.nth(1).click();
  await choices.nth(2).click();
  assert.equal(await page.locator("#items .choice.selected").count(), 2, "maximum deux objets imposés");
  assert.equal(await page.locator("#itemCount").innerText(), "2/2 objets imposés sélectionnés");
  const imposed = await page.locator("#items .choice.selected").evaluateAll(nodes => nodes.map(n => n.dataset.value));
  await page.locator("#validate").click();
  summary = await page.locator("#summary").innerText();
  assert.ok(imposed.every(item => summary.includes(item)), "les deux objets imposés figurent dans le résultat");
  const assigned2 = (summary.split("Objets attribués à l’équipe : ")[1]?.split("\n")[0] ?? "").split(", ").filter(Boolean);
  assert.equal(assigned2.length, 6);
  assert.equal(new Set(assigned2).size, 6);
  assert.ok(imposed.every(item => assigned2.includes(item)));

  // Competitiveness at 100% disables and resets CI controls.
  await page.locator("#comp").fill("100");
  assert.equal(await page.locator("#illegalToggle").isVisible(), false);
  assert.equal(await page.locator("#freq").isDisabled(), true);
  assert.equal(await page.locator("#inc").isDisabled(), true);
  assert.equal(await page.locator("#freq").inputValue(), "0");
  assert.equal(await page.locator("#inc").inputValue(), "0");

  // At 25%, manual CI settings require explicit adjustment of both sliders.
  await page.locator("#comp").fill("25");
  await page.locator("#illegalToggle").click();
  await page.locator("#validate").click();
  assert.match(await page.locator("#summary").innerText(), /CONFIGURATION INCOMPLÈTE/);
  await page.locator("#freq").fill("10");
  await page.locator("#inc").fill("5");
  await page.locator("#validate").click();
  assert.doesNotMatch(await page.locator("#summary").innerText(), /réglages de fréquence et d’incongruité.*doivent être explicitement résolus/i);

  assert.deepEqual(errors, [], "aucune erreur JavaScript pendant les interactions");
  console.log("[PASS] zéro objet imposé accepté et six objets attribués automatiquement");
  console.log("[PASS] un objet imposé est conservé dans l'équipe");
  console.log("[PASS] deux objets imposés sont conservés et un troisième est bloqué");
  console.log("[PASS] compétitivité 100 % désactive et réinitialise les curseurs CI");
  console.log("[PASS] réglages CI manuels à 25 % contrôlés");
  console.log("[PASS] aucune erreur JavaScript pendant les interactions");
} finally {
  await browser.close();
}
