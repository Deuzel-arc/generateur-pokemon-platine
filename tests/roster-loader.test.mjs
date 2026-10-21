import assert from "node:assert/strict";
import { loadRosterProfiles, ROSTER_MODES } from "../src/strategy/roster-loader.mjs";

const verified = loadRosterProfiles();
assert.equal(verified.length, 71, "default mode must preserve the current verified roster");
assert.ok(verified.every(row => row.status === "verified_roster"));

const experimentalPlatinum = loadRosterProfiles({ mode: ROSTER_MODES.EXPERIMENTAL, dataSource: "platinum" });
assert.equal(experimentalPlatinum.length, 493);
assert.equal(new Set(experimentalPlatinum.map(row => row.id)).size, 493);
assert.ok(experimentalPlatinum.every(row => row.status === "experimental_candidate"));
assert.ok(experimentalPlatinum.every(row => row.legendaryStatus === "unknown"));
assert.ok(experimentalPlatinum.every(row => row.strategicMetadataStatus === "not_certified"));
assert.ok(experimentalPlatinum.every(row => row.tags.length === 0));

const experimentalPm = loadRosterProfiles({ mode: ROSTER_MODES.EXPERIMENTAL, dataSource: "multiplayer" });
assert.equal(experimentalPm.length, 493);
assert.ok(experimentalPm.every(row => row.sourceProfile === "multiplayer"));
assert.ok(experimentalPm.every(row => row.evidence.typeStatsSemanticsCertified === false));

assert.throws(() => loadRosterProfiles({ mode: "automatic" }), /mode must be/);
assert.throws(() => loadRosterProfiles({ dataSource: "unknown" }), /dataSource must be/);

console.log("[PASS] roster-loader: 71 vérifiés par défaut, 493 candidats en mode expérimental, métadonnées incertaines préservées");
