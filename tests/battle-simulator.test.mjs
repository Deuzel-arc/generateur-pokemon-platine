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
