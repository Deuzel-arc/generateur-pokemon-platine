import assert from "node:assert/strict";
import {
  calculateGen4BaseDamage,
  applyGen4RandomFactor,
  applyGen4Stab,
  calculateGen4TypeEffectiveness,
  inspectSimulationReadiness,
  simulateBattle,
} from "../src/strategy/battle-simulator.mjs";

assert.equal(calculateGen4BaseDamage({ level: 50, power: 80, attack: 100, defense: 100 }), 37);
assert.equal(calculateGen4BaseDamage({ level: 100, power: 100, attack: 200, defense: 100 }), 170);
assert.equal(calculateGen4BaseDamage({ level: 1, power: 40, attack: 10, defense: 100 }), 2);
assert.equal(applyGen4Stab({ damage: 100, hasStab: true }), 150);
assert.equal(applyGen4Stab({ damage: 101, hasStab: true }), 151);
assert.equal(applyGen4Stab({ damage: 100, hasStab: false }), 100);
assert.throws(() => applyGen4Stab({ damage: 100, hasStab: "yes" }), /hasStab/);

assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 10, defenderTypes: [12] }), { supported: true, multiplier: 2 });
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 10, defenderTypes: [12, 8] }), { supported: true, multiplier: 4 });
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 10, defenderTypes: [11] }), { supported: true, multiplier: 0.5 });
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 13, defenderTypes: [4] }), { supported: true, multiplier: 0 });
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 9, defenderTypes: [12] }), {
  supported: false, multiplier: null, reason: "TYPE_MYSTERY requires ROM-specific semantics",
});
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 10, defenderTypes: [9] }), {
  supported: false, multiplier: null, reason: "TYPE_MYSTERY requires ROM-specific semantics",
});
assert.throws(() => calculateGen4TypeEffectiveness({ attackType: 18, defenderTypes: [12] }), /attackType/);
assert.throws(() => calculateGen4TypeEffectiveness({ attackType: 10, defenderTypes: [] }), /defenderTypes/);
assert.equal(applyGen4RandomFactor({ damage: 100, roll: 85 }), 85);
assert.equal(applyGen4RandomFactor({ damage: 100, roll: 100 }), 100);
assert.equal(applyGen4RandomFactor({ damage: 37, roll: 85 }), 31);
assert.throws(() => applyGen4RandomFactor({ damage: 100, roll: 84 }), /roll/);
assert.throws(() => applyGen4RandomFactor({ damage: 100, roll: 101 }), /roll/);
assert.throws(() => calculateGen4BaseDamage({ level: 101, power: 80, attack: 100, defense: 100 }), /level/);
assert.throws(() => calculateGen4BaseDamage({ level: 50, power: 0, attack: 100, defense: 100 }), /power/);

const coreOnly = inspectSimulationReadiness({ requiredMechanics: ["baseDamageCore", "battleStats"] });
assert.equal(coreOnly.ready, true);
const fullBattle = inspectSimulationReadiness({ requiredMechanics: ["baseDamageCore", "typeEffectiveness", "turnOrder"] });
assert.equal(fullBattle.ready, false);
assert.deepEqual(fullBattle.unsupportedMechanics, ["turnOrder"]);
assert.deepEqual(fullBattle.unknownMechanics, []);

const result = simulateBattle();
assert.equal(result.status, "incomplete");
assert.equal(result.result, null);
assert.equal(result.winner, null);
assert.ok(result.unsupportedMechanics.includes("doublesTargeting"));

console.log("[PASS] fondation simulateur Gen IV : formule de dégâts de base, limites explicites et refus de simuler sans mécaniques complètes");

// Exhaustive domain sweep: every canonical Gen IV attack/defense type pair,
// plus all dual-type combinations, must return a finite supported multiplier.
// This checks coverage and API stability; matchup correctness still requires
// independent comparison against a canonical Gen IV chart.
const validMultipliers = new Set([0, 0.25, 0.5, 1, 2, 4]);
for (let attackType = 0; attackType <= 17; attackType++) {
  if (attackType === 9) continue; // Mystery is intentionally unsupported.
  for (let defenderType = 0; defenderType <= 17; defenderType++) {
    if (defenderType === 9) continue;
    const single = calculateGen4TypeEffectiveness({ attackType, defenderTypes: [defenderType] });
    assert.equal(single.supported, true, `canonical matchup ${attackType} vs ${defenderType} must be supported`);
    assert.ok(validMultipliers.has(single.multiplier), `invalid single-type multiplier for ${attackType} vs ${defenderType}`);
    for (let secondDefenderType = 0; secondDefenderType <= 17; secondDefenderType++) {
      if (secondDefenderType === 9) continue;
      const dual = calculateGen4TypeEffectiveness({
        attackType,
        defenderTypes: [defenderType, secondDefenderType],
      });
      assert.equal(dual.supported, true, `canonical dual matchup ${attackType} vs ${defenderType}/${secondDefenderType} must be supported`);
      assert.ok(validMultipliers.has(dual.multiplier), `invalid dual-type multiplier for ${attackType} vs ${defenderType}/${secondDefenderType}`);
    }
  }
}
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 0, defenderTypes: [5] }), { supported: true, multiplier: 0.5 });
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 0, defenderTypes: [8] }), { supported: true, multiplier: 0.5 });
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 0, defenderTypes: [5, 8] }), { supported: true, multiplier: 0.25 });
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 0, defenderTypes: [7] }), { supported: true, multiplier: 0 });
// Normal attacks must never be super effective against any canonical Gen IV type.
for (let defenderType = 0; defenderType <= 17; defenderType++) {
  if (defenderType === 9) continue;
  const result = calculateGen4TypeEffectiveness({ attackType: 0, defenderTypes: [defenderType] });
  assert.ok(result.multiplier <= 1, `Normal must not be super effective against type ID ${defenderType}`);
}
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 0, defenderTypes: [7] }), { supported: true, multiplier: 0 });
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 1, defenderTypes: [7] }), { supported: true, multiplier: 0 });
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 4, defenderTypes: [2] }), { supported: true, multiplier: 0 });
assert.deepEqual(calculateGen4TypeEffectiveness({ attackType: 13, defenderTypes: [4, 11] }), { supported: true, multiplier: 0 });

