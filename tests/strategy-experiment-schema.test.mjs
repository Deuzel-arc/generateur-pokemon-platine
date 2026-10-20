import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const schema = JSON.parse(readFileSync(new URL("../data/strategy_experiment.schema.json", import.meta.url), "utf8"));
assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
assert.equal(schema.schemaVersion, undefined, "schema version belongs to each record, not the schema document");
assert.equal(schema.properties.schemaVersion.const, "1.0.0");
assert.equal(schema.additionalProperties, false);

const required = new Set(schema.required);
for (const field of ["ruleset", "engine", "dataSnapshot", "seed", "team", "opponent", "result", "metrics", "evidence", "conclusions"]) {
  assert.ok(required.has(field), `missing required experiment field: ${field}`);
}
assert.equal(schema.properties.team.minItems, 6);
assert.equal(schema.properties.team.maxItems, 6);
assert.equal(schema.properties.ruleset.properties.battleFormat.const, "double_2v2");
assert.equal(schema.properties.ruleset.properties.level.const, 100);
assert.deepEqual(schema.properties.result.properties.outcome.enum, ["win", "loss", "draw", "incomplete", "error"]);
assert.ok(schema.properties.result.properties.unsupportedMechanics, "unsupported mechanics must be recorded");
assert.ok(schema.properties.evidence.items.properties.status.enum.includes("unknown"));
assert.ok(schema.properties.conclusions.items.properties.status.enum.includes("refuted"));
assert.ok(schema.properties.weightChanges.items.required.includes("validationSetId"));
assert.ok(schema.properties.weightChanges.items.required.includes("accepted"));
assert.match(schema.description, /ne certifie ni la simulation ni les faits ROM/i);

console.log("[PASS] schéma d'expérience : reproductibilité, résultats négatifs/incomplets, provenance et garde-fous d'optimisation");
