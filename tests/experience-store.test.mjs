import assert from "node:assert/strict";
import { createExperienceStore } from "../src/strategy/experience-store.mjs";

const map = new Map();
const storage = {
  getItem(key) { return map.has(key) ? map.get(key) : null; },
  setItem(key, value) { map.set(key, value); },
};
const store = createExperienceStore(storage);

function experiment(experimentId, outcome = "win", seed = 42) {
  return {
    schemaVersion: "1.0.0",
    experimentId,
    createdAt: "2026-10-21T10:00:00.000Z",
    status: "exploratory",
    ruleset: { gameProfile: "CPUF_PLATINUM", battleFormat: "double_2v2", level: 100 },
    engine: { searchVersion: "0.1", simulatorVersion: "not_implemented", scoringVersion: "0.1", buildCommit: null },
    dataSnapshot: { snapshotId: "fixture-v1", certifiedOnly: true, sources: [] },
    seed,
    team: Array.from({ length: 6 }, (_, i) => ({ speciesId: i + 1, moves: [] })),
    opponent: { kind: "fixed_reference", referenceId: "fixture-opponent", teamFingerprint: "opp-1" },
    result: { outcome, termination: outcome === "incomplete" ? "unsupported_mechanic" : "knockout", turns: 12, unsupportedMechanics: [] },
    metrics: { scoreBefore: 0.5, scoreAfter: 0.6, scoreBreakdown: {}, damageDealt: null, damageReceived: null, survivors: null, hardConstraintViolations: [] },
    evidence: [],
    conclusions: [{ statement: "fixture", status: "inconclusive" }],
  };
}

assert.equal(store.add(experiment("run-1")).stored, true);
assert.equal(store.add(experiment("run-2")).stored, false, "same exact run is deduplicated");
assert.equal(store.add(experiment("run-3", "loss")).stored, true, "different outcome is preserved");
assert.equal(store.add(experiment("run-4", "incomplete")).stored, true, "incomplete run is preserved");
assert.equal(store.add(experiment("run-1", "loss")).reason, "experiment_id_already_exists");

const summary = store.summary();
assert.equal(summary.count, 3);
assert.equal(summary.outcomes.win, 1);
assert.equal(summary.outcomes.loss, 1);
assert.equal(summary.outcomes.incomplete, 1);
assert.equal(store.list().length, 3);

assert.throws(() => store.add({ experimentId: "bad" }), /missing required field/);
console.log("[PASS] mémoire d'expériences : persistance via adaptateur, déduplication exacte, conservation des défaites et résultats incomplets");
