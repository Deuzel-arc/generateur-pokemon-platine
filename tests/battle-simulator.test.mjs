import assert from "node:assert/strict";
import {
  calculateGen4BaseDamage,
  inspectSimulationReadiness,
  simulateBattle,
} from "../src/strategy/battle-simulator.mjs";

assert.equal(calculateGen4BaseDamage({ level: 50, power: 80, attack: 100, defense: 100 }), 37);
assert.equal(calculateGen4BaseDamage({ level: 100, power: 100, attack: 200, defense: 100 }), 170);
assert.equal(calculateGen4BaseDamage({ level: 1, power: 40, attack: 10, defense: 100 }), 2);
assert.throws(() => calculateGen4BaseDamage({ level: 101, power: 80, attack: 100, defense: 100 }), /level/);
assert.throws(() => calculateGen4BaseDamage({ level: 50, power: 0, attack: 100, defense: 100 }), /power/);

const coreOnly = inspectSimulationReadiness({ requiredMechanics: ["baseDamageCore", "battleStats"] });
assert.equal(coreOnly.ready, true);
const fullBattle = inspectSimulationReadiness({ requiredMechanics: ["baseDamageCore", "typeEffectiveness", "turnOrder"] });
assert.equal(fullBattle.ready, false);
assert.deepEqual(fullBattle.unsupportedMechanics, ["typeEffectiveness", "turnOrder"]);
assert.deepEqual(fullBattle.unknownMechanics, []);

const result = simulateBattle();
assert.equal(result.status, "incomplete");
assert.equal(result.result, null);
assert.equal(result.winner, null);
assert.ok(result.unsupportedMechanics.includes("doublesTargeting"));

console.log("[PASS] fondation simulateur Gen IV : formule de dégâts de base, limites explicites et refus de simuler sans mécaniques complètes");
