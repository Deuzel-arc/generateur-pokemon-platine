/**
 * Explicit CI strategy rules for the team generator.
 * "Stratégie de surprise" is the ONLY main strategy that permits a CI to
 * become the team's central win condition. Permission is not an obligation.
 * Other strategies may use verified CIs as supporting options only.
 */
export const SURPRISE_STRATEGY = "Stratégie de surprise";

export function resolveCiStrategyRole({
  strategies = [],
  ciEnabled = false,
  frequency = 0,
  competitiveness = 50,
} = {}) {
  if (!Array.isArray(strategies)) throw new TypeError("strategies must be an array");
  for (const [name, value] of [["frequency", frequency], ["competitiveness", competitiveness]]) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new RangeError(`${name} must be between 0 and 100`);
    }
  }

  const active = ciEnabled && competitiveness < 100 && frequency > 0;
  if (!active) {
    return Object.freeze({
      ciActive: false,
      centralCiAllowed: false,
      ciRole: "disabled",
      reason: competitiveness === 100 ? "competitiveness_100_disables_ci"
        : !ciEnabled ? "ci_not_enabled"
        : frequency === 0 ? "ci_frequency_zero"
        : "ci_disabled",
    });
  }

  const centralCiAllowed = strategies.includes(SURPRISE_STRATEGY);
  return Object.freeze({
    ciActive: true,
    centralCiAllowed,
    ciRole: centralCiAllowed ? "central_or_supporting" : "supporting_only",
    reason: centralCiAllowed
      ? "surprise_strategy_permits_but_does_not_require_central_ci"
      : "only_surprise_strategy_permits_central_ci",
  });
}
