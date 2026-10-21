import assert from "node:assert/strict";
import { resolveCiStrategyRole, SURPRISE_STRATEGY } from "../src/strategy/ci-strategy-rules.mjs";

const active = { ciEnabled: true, frequency: 50, competitiveness: 50 };
assert.deepEqual(resolveCiStrategyRole({ ...active, strategies: [SURPRISE_STRATEGY] }), {
  ciActive: true,
  centralCiAllowed: true,
  ciRole: "central_or_supporting",
  reason: "surprise_strategy_permits_but_does_not_require_central_ci",
}, "surprise strategy permits but does not require a central CI");

for (const strategy of [
  "Combo atypique / inhabituel",
  "Stratégie météorologique",
  "Contrôle de la vitesse",
  "Contrôle du terrain",
  "Usure et perturbation",
]) {
  const result = resolveCiStrategyRole({ ...active, strategies: [strategy] });
  assert.equal(result.ciActive, true, "CI may be used as supporting options");
  assert.equal(result.centralCiAllowed, false, `${strategy} must not authorize a central CI`);
  assert.equal(result.ciRole, "supporting_only");
}

assert.equal(resolveCiStrategyRole({ ...active, strategies: [] }).centralCiAllowed, false);
assert.equal(resolveCiStrategyRole({ ...active, strategies: [SURPRISE_STRATEGY], ciEnabled: false }).ciActive, false);
assert.equal(resolveCiStrategyRole({ ...active, strategies: [SURPRISE_STRATEGY], frequency: 0 }).centralCiAllowed, false);
assert.equal(resolveCiStrategyRole({ ...active, strategies: [SURPRISE_STRATEGY], competitiveness: 100 }).centralCiAllowed, false);
assert.throws(() => resolveCiStrategyRole({ ...active, frequency: 101 }), RangeError);
assert.throws(() => resolveCiStrategyRole({ ...active, strategies: "Stratégie de surprise" }), TypeError);

console.log("CI strategy rules: all tests passed.");
