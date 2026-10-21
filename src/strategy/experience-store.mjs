/**
 * Persistence-agnostic experience registry.
 * A caller supplies a storage adapter with getItem/setItem; browser storage can
 * be used by the UI, while tests use an in-memory adapter.
 * Exact duplicate runs are deduplicated; different outcomes remain distinct.
 */
const KEY = "pokemon-strategy-experiences-v1";

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function fingerprint(experiment) {
  // Include outcome and engine/data versions so contradictory outcomes and
  // different versions are never silently collapsed into one another.
  const fields = {
    ruleset: experiment.ruleset,
    engine: experiment.engine,
    dataSnapshot: experiment.dataSnapshot,
    seed: experiment.seed,
    team: experiment.team,
    opponent: experiment.opponent,
    result: experiment.result,
  };
  return stable(fields);
}

function validateExperiment(experiment) {
  if (!experiment || typeof experiment !== "object") throw new TypeError("experiment must be an object");
  for (const key of ["experimentId", "createdAt", "status", "ruleset", "engine", "dataSnapshot", "seed", "team", "opponent", "result", "metrics", "evidence", "conclusions"]) {
    if (!(key in experiment)) throw new TypeError(`experiment is missing required field: ${key}`);
  }
  if (!["win", "loss", "draw", "incomplete", "error"].includes(experiment.result.outcome)) {
    throw new TypeError("experiment result must preserve win/loss/draw/incomplete/error");
  }
  if (!Array.isArray(experiment.team) || experiment.team.length !== 6) throw new TypeError("experiment team must contain exactly six members");
  if (!Array.isArray(experiment.evidence) || !Array.isArray(experiment.conclusions)) throw new TypeError("evidence and conclusions must be arrays");
}

export function createExperienceStore(storage, options = {}) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    throw new TypeError("storage adapter must implement getItem and setItem");
  }
  const key = options.key ?? KEY;

  function readAll() {
    const raw = storage.getItem(key);
    if (raw == null || raw === "") return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new TypeError("experience storage is corrupt: expected an array");
    return parsed;
  }

  function writeAll(rows) {
    storage.setItem(key, JSON.stringify(rows));
  }

  return Object.freeze({
    list() {
      return readAll();
    },
    add(experiment) {
      validateExperiment(experiment);
      const rows = readAll();
      if (rows.some(row => row.experimentId === experiment.experimentId)) {
        return { stored: false, reason: "experiment_id_already_exists", count: rows.length };
      }
      const fp = fingerprint(experiment);
      const duplicate = rows.find(row => row.fingerprint === fp);
      if (duplicate) {
        return { stored: false, reason: "exact_duplicate_experiment", duplicateOf: duplicate.experimentId, count: rows.length };
      }
      const record = { ...experiment, fingerprint: fp };
      writeAll([...rows, record]);
      return { stored: true, reason: "stored", experimentId: experiment.experimentId, count: rows.length + 1 };
    },
    summary() {
      const rows = readAll();
      const outcomes = { win: 0, loss: 0, draw: 0, incomplete: 0, error: 0 };
      for (const row of rows) outcomes[row.result.outcome] = (outcomes[row.result.outcome] ?? 0) + 1;
      return {
        count: rows.length,
        outcomes,
        statuses: rows.reduce((counts, row) => {
          counts[row.status] = (counts[row.status] ?? 0) + 1;
          return counts;
        }, {}),
        distinctEngineVersions: [...new Set(rows.map(row => stable(row.engine)))].length,
      };
    },
  });
}

export { fingerprint as experienceFingerprint };
