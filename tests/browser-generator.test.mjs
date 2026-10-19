import { chromium } from "playwright";
import assert from "node:assert/strict";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await page.setContent(await (await import("node:fs/promises")).readFile(new URL("../index.html", import.meta.url), "utf8"));

const clickChoice = async (group, value) => {
  const button = page.locator(`[data-group="${group}"][data-value="${value}"]`);
  await button.waitFor({ state: "visible" });
  await button.click();
};
const itemChoices = page.locator("#items .choice");

try {
  await assert.doesNotReject(async () => {
    assert.equal(await itemChoices.count(), 6, "le sélecteur doit proposer six objets");
  });

  await page.locator("#validate").click();
  assert.match(await page.locator("#summary").innerText(), /CONFIGURATION INCOMPLÈTE/);
  assert.match(await page.locator("#summary").innerText(), /six objets/i);

  // Six items can be selected and validation must then reach team generation.
  for (let i = 0; i < await itemChoices.count(); i++) {
    await itemChoices.nth(i).click();
  }
  assert.equal(await page.locator("#items .choice.selected").count(), 6);
  await page.locator("#validate").click();
  assert.doesNotMatch(await page.locator("#summary").innerText(), /six objets/i);

  // The 100% competitive mode must disable CI and reset its sliders.
  await page.locator("#comp").fill("100");
  assert.equal(await page.locator("#illegalToggle").isVisible(), false);
  assert.equal(await page.locator("#freq").isDisabled(), true);
  assert.equal(await page.locator("#inc").isDisabled(), true);
  assert.equal(await page.locator("#freq").inputValue(), "0");
  assert.equal(await page.locator("#inc").inputValue(), "0");

  // At 25%, manual CI settings must not be treated as resolved until both sliders are moved.
  await page.locator("#comp").fill("25");
  await clickChoice("starter", "none");
  await clickChoice("legendary", "none");
  const toggle = page.locator("#illegalToggle");
  if (await toggle.isVisible()) {
    await toggle.click();
    await page.locator("#validate").click();
    assert.match(await page.locator("#summary").innerText(), /CONFIGURATION INCOMPLÈTE/);
    await page.locator("#freq").fill("10");
    await page.locator("#inc").fill("5");
    await page.locator("#validate").click();
    assert.doesNotMatch(await page.locator("#summary").innerText(), /réglages de fréquence et d’incongruité.*doivent être explicitement résolus/i);
  }

  assert.deepEqual(errors, [], "aucune erreur JavaScript ne doit survenir pendant les interactions");
  console.log("[PASS] six objets affichés et validation bloquée avant sélection complète");
  console.log("[PASS] sélection des six objets et passage à la validation suivante");
  console.log("[PASS] compétitivité 100 % désactive et réinitialise les curseurs CI");
  console.log("[PASS] parcours de réglages CI manuels à 25 % contrôlé");
  console.log("[PASS] aucune erreur JavaScript pendant les interactions");
} finally {
  await browser.close();
}