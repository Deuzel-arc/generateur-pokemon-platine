/**
 * Pokémon Generation IV stat calculation helpers.
 * Base stats, IVs and EVs are inputs; this module does not infer species data.
 */

const STAT_NAMES = Object.freeze([
  "hp",
  "attack",
  "defense",
  "specialAttack",
  "specialDefense",
  "speed",
]);

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function validateIntegerInRange(value, min, max, label) {
  assert(Number.isInteger(value) && value >= min && value <= max,
    `${label} must be an integer from ${min} to ${max}`);
}

function validateStatRecord(record, label, min, max) {
  assert(record && typeof record === "object" && !Array.isArray(record),
    `${label} must be an object`);
  for (const stat of STAT_NAMES) {
    validateIntegerInRange(record[stat], min, max, `${label}.${stat}`);
  }
}

function validateNature(nature) {
  assert(nature && typeof nature === "object" && !Array.isArray(nature),
    "nature must be a stat multiplier object");
  for (const stat of STAT_NAMES.filter(name => name !== "hp")) {
    const multiplier = nature[stat] ?? 1;
    assert(multiplier === 0.9 || multiplier === 1 || multiplier === 1.1,
      `nature.${stat} must be 0.9, 1, or 1.1`);
  }
}

/**
 * Calculate level-specific Generation IV stats.
 * nature is a multiplier map for non-HP stats (0.9, 1, 1.1); omitted stats
 * default to 1. This explicit representation avoids guessing nature names.
 */
export function calculateGen4Stats({ baseStats, ivs, evs, level, nature = {} }) {
  validateIntegerInRange(level, 1, 100, "level");
  validateStatRecord(baseStats, "baseStats", 1, 255);
  validateStatRecord(ivs, "ivs", 0, 31);
  validateStatRecord(evs, "evs", 0, 252);
  assert(STAT_NAMES.reduce((sum, stat) => sum + evs[stat], 0) <= 510,
    "total EVs must not exceed 510");
  validateNature(nature);

  const result = {};
  for (const stat of STAT_NAMES) {
    const effort = Math.floor(evs[stat] / 4);
    const scaled = Math.floor(((2 * baseStats[stat] + ivs[stat] + effort) * level) / 100);
    if (stat === "hp") {
      result.hp = scaled + level + 10;
    } else {
      result[stat] = Math.floor((scaled + 5) * (nature[stat] ?? 1));
    }
  }
  return Object.freeze(result);
}

export const GEN4_STAT_NAMES = STAT_NAMES;
