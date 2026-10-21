/**
 * Gen IV battle-simulation foundation.
 *
 * This module deliberately implements only the deterministic pre-modifier
 * base-damage term. It is NOT a full battle simulator and must never decide
 * a battle outcome. STAB, type effectiveness, weather, critical hits, items,
 * abilities, spread-move modifiers, random damage roll and move effects are
 * reported as unsupported until implemented and reference-tested.
 */
const GEN4_SUPPORTED_PRIMITIVES = Object.freeze({
  baseDamageCore: true,
  stab: false,
  typeEffectiveness: false,
  weather: false,
  criticalHits: false,
  heldItems: false,
  abilities: false,
  spreadMoves: false,
  randomDamageRoll: false,
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
