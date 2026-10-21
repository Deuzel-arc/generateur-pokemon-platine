/**
 * Gen IV battle-simulation foundation.
 *
 * This module deliberately implements only the deterministic pre-modifier
 * base-damage term. It is NOT a full battle simulator and must never decide
 * a battle outcome. STAB, type effectiveness, weather, critical hits, items,
 * abilities, spread-move modifiers and move effects are
 * reported as unsupported until implemented and reference-tested. STAB, type effectiveness and the random factor exist as isolated primitives, not as a combined damage pipeline.
 */
const GEN4_SUPPORTED_PRIMITIVES = Object.freeze({
  baseDamageCore: true,
  battleStats: true,
  stab: true,
  typeEffectiveness: true,
  weather: false,
  criticalHits: false,
  heldItems: false,
  abilities: false,
  spreadMoves: false,
  randomDamageRoll: true,
  moveEffects: false,
  statusAndStatStages: false,
  switching: false,
  turnOrder: false,
  doublesTargeting: false,
});

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function positiveInteger(value, name) {
  assert(Number.isInteger(value) && value > 0, `${name} must be a positive integer`);
  return value;
}

/**
 * Core Generation IV damage expression, before STAB, effectiveness and all
 * other modifiers:
 * floor(floor((floor(2*level/5)+2) * power * attack / defense) / 50) + 2
 *
 * Attack and defense must already be the in-battle stats for the selected
 * physical/special category. This helper intentionally does not choose them.
 */
/**
 * Apply one explicit Generation IV random damage roll (85..100 percent).
 * This is a single modifier only; it does not calculate final move damage.
 */
// Canonical Generation IV type chart, expressed as defender IDs by multiplier.
 // IDs follow data/gen4_id_reference.json: 0 Normal, 1 Fighting, ... 17 Dark.
const GEN4_TYPE_CHART = Object.freeze({
  0: { weak: [], resist: [5, 8], immune: [7] },
  1: { weak: [0, 5, 8, 15, 17], resist: [2, 3, 6, 14], immune: [7] },
  2: { weak: [1, 6, 12], resist: [5, 8, 13], immune: [] },
  3: { weak: [12], resist: [3, 4, 5, 7], immune: [8] },
  4: { weak: [3, 5, 8, 10, 13], resist: [6, 12], immune: [2] },
  5: { weak: [2, 6, 10, 15], resist: [1, 4, 8], immune: [] },
  6: { weak: [12, 14, 17], resist: [1, 2, 3, 7, 8, 10], immune: [] },
  7: { weak: [7, 14], resist: [17], immune: [0] },
  8: { weak: [5, 15], resist: [8, 10, 11, 13], immune: [] },
  10: { weak: [6, 8, 12, 15], resist: [5, 10, 11, 16], immune: [] },
  11: { weak: [4, 5, 10], resist: [11, 12, 16], immune: [] },
  12: { weak: [4, 5, 11], resist: [2, 3, 6, 8, 10, 12, 16], immune: [] },
  13: { weak: [2, 11], resist: [12, 13, 16], immune: [4] },
  14: { weak: [1, 3], resist: [8, 14], immune: [17] },
  15: { weak: [2, 4, 12, 16], resist: [8, 10, 11, 15], immune: [] },
  16: { weak: [16], resist: [8], immune: [] },
  17: { weak: [7, 14], resist: [1, 6, 17], immune: [] },
});

/**
 * Generation IV type effectiveness for a move against one or two defending
 * types. Type ID 9 (Mystery) and the later Fairy type are deliberately not
 * interpreted as ordinary Gen IV types.
 */
export function calculateGen4TypeEffectiveness({ attackType, defenderTypes }) {
  assert(Number.isInteger(attackType) && (attackType === 9 || (attackType >= 0 && attackType <= 17)),
    "attackType must be a Gen IV type ID from 0 to 17");
  assert(Array.isArray(defenderTypes) && defenderTypes.length >= 1 && defenderTypes.length <= 2,
    "defenderTypes must contain one or two type IDs");
  for (const type of defenderTypes) {
    assert(Number.isInteger(type) && type >= 0 && type <= 17,
      "defender type IDs must be from 0 to 17");
  }
  if (attackType === 9 || defenderTypes.includes(9)) {
    return Object.freeze({ supported: false, multiplier: null, reason: "TYPE_MYSTERY requires ROM-specific semantics" });
  }
  const relation = GEN4_TYPE_CHART[attackType] ?? { weak: [], resist: [], immune: [] };
  let multiplier = 1;
  for (const defender of defenderTypes) {
    if (relation.immune.includes(defender)) multiplier *= 0;
    else if (relation.weak.includes(defender)) multiplier *= 2;
    else if (relation.resist.includes(defender)) multiplier *= 0.5;
  }
  return Object.freeze({ supported: true, multiplier });
}

/**
 * Apply the Generation IV same-type attack bonus to an already-calculated
 * damage value. This is a modifier primitive, not a full damage calculation.
 */
export function applyGen4Stab({ damage, hasStab }) {
  positiveInteger(damage, "damage");
  assert(typeof hasStab === "boolean", "hasStab must be a boolean");
  return hasStab ? Math.floor((damage * 3) / 2) : damage;
}

export function applyGen4RandomFactor({ damage, roll }) {
  positiveInteger(damage, "damage");
  assert(Number.isInteger(roll) && roll >= 85 && roll <= 100,
    "roll must be an integer from 85 to 100");
  return Math.floor((damage * roll) / 100);
}

export function calculateGen4BaseDamage({ level, power, attack, defense }) {
  positiveInteger(level, "level");
  positiveInteger(power, "power");
  positiveInteger(attack, "attack");
  positiveInteger(defense, "defense");
  assert(level <= 100, "level must be between 1 and 100");
  const levelTerm = Math.floor((2 * level) / 5) + 2;
  const scaled = Math.floor((levelTerm * power * attack) / defense);
  return Math.floor(scaled / 50) + 2;
}

/**
 * A simulation request is fail-closed. Until every mechanic required by the
 * scenario has a verified implementation, the engine returns "incomplete"
 * and lists unsupported mechanics rather than fabricating a winner.
 */
export function inspectSimulationReadiness({ requiredMechanics = [] } = {}) {
  assert(Array.isArray(requiredMechanics), "requiredMechanics must be an array");
  const unknown = requiredMechanics.filter(name => !(name in GEN4_SUPPORTED_PRIMITIVES));
  const unsupported = requiredMechanics.filter(name => GEN4_SUPPORTED_PRIMITIVES[name] !== true);
  return Object.freeze({
    ready: unknown.length === 0 && unsupported.length === 0,
    implementedPrimitives: Object.keys(GEN4_SUPPORTED_PRIMITIVES).filter(name => GEN4_SUPPORTED_PRIMITIVES[name]),
    unsupportedMechanics: [...new Set(unsupported)],
    unknownMechanics: [...new Set(unknown)],
  });
}

export function simulateBattle() {
  return {
    status: "incomplete",
    result: null,
    winner: null,
    turns: 0,
    events: [],
    unsupportedMechanics: Object.keys(GEN4_SUPPORTED_PRIMITIVES).filter(name => !GEN4_SUPPORTED_PRIMITIVES[name]),
    reason: "Le simulateur complet n'est pas encore implémenté ; aucun résultat de combat n'est inféré.",
  };
}

export const GEN4_SIMULATOR_CAPABILITIES = GEN4_SUPPORTED_PRIMITIVES;
