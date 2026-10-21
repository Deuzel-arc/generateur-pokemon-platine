import assert from "node:assert/strict";
import { calculateGen4Stats } from "../src/strategy/gen4-stats.mjs";

const baseStats = { hp: 100, attack: 100, defense: 100, specialAttack: 100, specialDefense: 100, speed: 100 };
const zeros = { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 };
const maxIvs = { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 };
const maxEvs = { hp: 252, attack: 252, defense: 0, specialAttack: 0, specialDefense: 4, speed: 0 };

assert.deepEqual(
  calculateGen4Stats({ baseStats, ivs: maxIvs, evs: zeros, level: 100 }),
  { hp: 341, attack: 236, defense: 236, specialAttack: 236, specialDefense: 236, speed: 236 },
);
assert.deepEqual(
  calculateGen4Stats({
    baseStats, ivs: maxIvs, evs: maxEvs, level: 100,
    nature: { attack: 1.1, specialAttack: 0.9 },
  }),
  { hp: 404, attack: 328, defense: 236, specialAttack: 212, specialDefense: 237, speed: 236 },
);
assert.deepEqual(
  calculateGen4Stats({ baseStats, ivs: zeros, evs: zeros, level: 1 }),
  { hp: 13, attack: 7, defense: 7, specialAttack: 7, specialDefense: 7, speed: 7 },
);
assert.throws(() => calculateGen4Stats({ baseStats, ivs: maxIvs, evs: zeros, level: 101 }), /level/);
assert.throws(() => calculateGen4Stats({ baseStats, ivs: { ...maxIvs, speed: 32 }, evs: zeros, level: 100 }), /ivs.speed/);
assert.throws(() => calculateGen4Stats({ baseStats, ivs: maxIvs, evs: { ...zeros, attack: 253 }, level: 100 }), /evs.attack/);
assert.throws(() => calculateGen4Stats({ baseStats, ivs: maxIvs, evs: { ...maxEvs, defense: 4 }, level: 100 }), /total EVs/);
assert.throws(() => calculateGen4Stats({ baseStats, ivs: maxIvs, evs: zeros, level: 100, nature: { attack: 1.2 } }), /nature.attack/);

console.log("[PASS] statistiques Gen IV : formule HP/stat, nature, IV/EV et validations");
