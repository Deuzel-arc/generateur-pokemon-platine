#!/usr/bin/env node
/**
 * Reproducible structural comparator for extracted Platinum item archive exports.
 * Checks archive index/ID mapping and byte-for-byte export consistency.
 * It does NOT reconstruct ItemData from canonical per-item JSON files; that
 * independent semantic/binary comparison remains uncertified.
 *
 * Usage:
 * node scripts/audit-item-archive-mapping.mjs --archive-json PATH --items-json PATH
 *   --reference-json data/gen4_item_id_reference.json [--output PATH]
 */
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, value, i, all) => {
  if (value.startsWith("--")) acc.push([value.slice(2), all[i + 1]]);
  return acc;
}, []));
for (const key of ["archive-json", "items-json", "reference-json"]) {
  if (!args[key]) {
    console.error(`Missing --${key}`);
    process.exit(2);
  }
}
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const archive = readJson(args["archive-json"]);
const decoded = readJson(args["items-json"]);
const reference = readJson(args["reference-json"]);
const archiveEntries = archive.entries;
const decodedEntries = decoded.entries;
assert.ok(Array.isArray(archiveEntries), "archive export must have an entries array");
assert.ok(Array.isArray(decodedEntries), "decoded item table must have an entries array");
assert.equal(archive.count, archiveEntries.length, "archive declared count differs from entries length");
assert.equal(decoded.count, decodedEntries.length, "decoded declared count differs from entries length");
assert.equal(archiveEntries.length, 446, "CPUF item archive must contain 446 records");
assert.equal(decodedEntries.length, archiveEntries.length, "archive and decoded item table counts differ");

const canonicalIds = reference.itemIds;
assert.ok(Array.isArray(canonicalIds), "reference must expose itemIds");
const reserved = canonicalIds.filter((item) => item.symbol.startsWith("ITEM_UNUSED_")).map((item) => item.id);
const reservedSet = new Set(reserved);
const realIds = canonicalIds.filter((item) => !reservedSet.has(item.id) && item.id < 468);
assert.equal(reserved.length, 22, "expected 22 canonical reserved IDs");
assert.equal(realIds.length, 446, "expected 446 canonical non-reserved IDs");

const errors = [];
const mapping = [];
for (let i = 0; i < archiveEntries.length; i++) {
  const rawArchive = archiveEntries[i];
  const row = decodedEntries[i];
  if (!/^(?:[0-9a-fA-F]{2}){34}$/.test(rawArchive)) errors.push({ index: i, kind: "archive_record_not_34_bytes" });
  if (row.id !== i) errors.push({ index: i, kind: "decoded_id_not_archive_index", actual: row.id });
  if (row.raw !== rawArchive) errors.push({ index: i, kind: "raw_export_mismatch" });
  if (row.raw?.length !== 68) errors.push({ index: i, kind: "decoded_raw_length_not_68_hex_chars" });
  const canonical = realIds[i];
  if (!canonical) errors.push({ index: i, kind: "missing_canonical_id" });
  else {
    const expectedArchiveIndex = canonical.id - reserved.filter((id) => id < canonical.id).length;
    if (expectedArchiveIndex !== i) errors.push({ index: i, kind: "canonical_archive_index_formula_mismatch", canonicalId: canonical.id, expectedArchiveIndex });
    if (canonical.archiveIndex !== i) errors.push({ index: i, kind: "reference_archive_index_mismatch", canonicalId: canonical.id, referenceArchiveIndex: canonical.archiveIndex });
    mapping.push({ archiveIndex: i, logicalItemId: canonical.id, symbol: canonical.symbol });
  }
}
const report = {
  schemaVersion: "1.0.0",
  title: "Audit structurel du mapping des objets CPUF",
  status: errors.length === 0 ? "structural_mapping_pass_semantic_binary_comparison_pending" : "failed",
  scope: "CPUF only; verifies exported raw-byte consistency and logical-ID-to-archive-index mapping, not reconstructed ItemData bytes from canonical per-item JSON.",
  counts: { archiveEntries: archiveEntries.length, decodedEntries: decodedEntries.length, canonicalLogicalIds: realIds.length, reservedLogicalIds: reserved.length, errors: errors.length },
  checks: {
    recordSizeBytes: 34,
    rawArchiveEqualsDecodedTable: errors.every((e) => e.kind !== "raw_export_mismatch"),
    canonicalMappingFormula: errors.every((e) => !e.kind.includes("mapping") && !e.kind.includes("index_formula") && !e.kind.includes("reference_archive_index")),
    fullSourceJsonReconstruction: "not_performed"
  },
  errors,
  mappingSamples: [mapping[0], mapping[1], mapping[112], mapping[113], mapping[445]].filter(Boolean),
  nextRequiredStep: "Reconstruct all 34 bytes from the 446 canonical per-item JSON files using proc_item/proc_params enum mappings and C bitfield layout, then compare reconstructed bytes against archive entries."
};
if (args.output) writeFileSync(args.output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
