import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename } from "node:path";

const EXPECTED = {
  platinum: {
    gameCode: "CPUF",
    sha256: "1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8",
  },
  project_pm: {
    gameCode: "CPUE",
    sha256: "435b0288238f01f21eeeef7b5de6de3e3c9c3a9b70ea3b18d71b31ba282ae4e1",
  },
};
const CANONICAL_METHOD_IDS = new Set(Array.from({ length: 27 }, (_, id) => id));

function parseNitroFs(rom) {
  const fntOffset = rom.readUInt32LE(0x40);
  const fntSize = rom.readUInt32LE(0x44);
  const fatOffset = rom.readUInt32LE(0x48);
  const fatSize = rom.readUInt32LE(0x4c);
  assert.ok(fntOffset + fntSize <= rom.length, "FNT outside ROM");
  assert.ok(fatOffset + fatSize <= rom.length, "FAT outside ROM");
  assert.equal(fatSize % 8, 0, "FAT size must be divisible by 8");
  const fnt = rom.subarray(fntOffset, fntOffset + fntSize);
  const fat = [];
  for (let offset = 0; offset < fatSize; offset += 8) {
    const start = rom.readUInt32LE(fatOffset + offset);
    const end = rom.readUInt32LE(fatOffset + offset + 4);
    assert.ok(start <= end && end <= rom.length, `invalid FAT range ${offset / 8}`);
    fat.push([start, end]);
  }
  const files = new Map();
  const visited = new Set();
  function walk(directoryId, prefix = "") {
    const index = directoryId & 0x0fff;
    assert.ok(!visited.has(index), `directory cycle at ${directoryId.toString(16)}`);
    visited.add(index);
    const entryOffset = index * 8;
    assert.ok(entryOffset + 8 <= fnt.length, "directory table entry outside FNT");
    const subtableOffset = fnt.readUInt32LE(entryOffset);
    let fileId = fnt.readUInt16LE(entryOffset + 4);
    assert.ok(subtableOffset < fnt.length, "directory subtable outside FNT");
    let cursor = subtableOffset;
    while (true) {
      assert.ok(cursor < fnt.length, "unterminated NitroFS directory");
      const nameByte = fnt[cursor++];
      if (nameByte === 0) break;
      const isDirectory = (nameByte & 0x80) !== 0;
      const nameLength = nameByte & 0x7f;
      assert.ok(nameLength > 0 && cursor + nameLength <= fnt.length, "invalid NitroFS name");
      const name = fnt.subarray(cursor, cursor + nameLength).toString("ascii");
      cursor += nameLength;
      if (isDirectory) {
        assert.ok(cursor + 2 <= fnt.length, "truncated directory reference");
        const childId = fnt.readUInt16LE(cursor);
        cursor += 2;
        walk(childId, `${prefix}${name}/`);
      } else {
        assert.ok(fileId < fat.length, `file ID ${fileId} outside FAT`);
        const [start, end] = fat[fileId++];
        const path = `${prefix}${name}`;
        assert.ok(!files.has(path), `duplicate NitroFS path ${path}`);
        files.set(path, rom.subarray(start, end));
      }
    }
  }
  walk(0xf000);
  return files;
}

function parseNarcEntries(data, label) {
  assert.equal(data.subarray(0, 4).toString("ascii"), "NARC", `${label}: invalid NARC magic`);
  assert.ok(data.length >= 0x10, `${label}: truncated header`);
  assert.equal(data.readUInt32LE(8), data.length, `${label}: declared size mismatch`);
  const headerSize = data.readUInt16LE(12);
  const blockCount = data.readUInt16LE(14);
  assert.equal(headerSize, 0x10, `${label}: unexpected header size`);
  let cursor = headerSize;
  const blocks = new Map();
  for (let i = 0; i < blockCount; i++) {
    assert.ok(cursor + 8 <= data.length, `${label}: truncated block header`);
    const tag = data.subarray(cursor, cursor + 4).toString("ascii");
    const size = data.readUInt32LE(cursor + 4);
    assert.ok(size >= 8 && cursor + size <= data.length, `${label}: invalid ${tag} size`);
    assert.ok(!blocks.has(tag), `${label}: duplicate ${tag} block`);
    blocks.set(tag, data.subarray(cursor + 8, cursor + size));
    cursor += size;
  }
  assert.equal(cursor, data.length, `${label}: trailing bytes`);
  const btaf = blocks.get("BTAF");
  const gmif = blocks.get("GMIF");
  assert.ok(btaf && gmif, `${label}: missing BTAF/GMIF`);
  const count = btaf.readUInt16LE(0);
  assert.equal(btaf.length, 4 + count * 8, `${label}: BTAF length mismatch`);
  const entries = [];
  for (let i = 0; i < count; i++) {
    const start = btaf.readUInt32LE(4 + i * 8);
    const end = btaf.readUInt32LE(8 + i * 8);
    assert.ok(start <= end && end <= gmif.length, `${label}: invalid entry ${i}`);
    entries.push(gmif.subarray(start, end));
  }
  return entries;
}

function auditProfile(profile, filePath) {
  const rom = readFileSync(filePath);
  const digest = createHash("sha256").update(rom).digest("hex");
  const gameCode = rom.subarray(0x0c, 0x10).toString("ascii");
  assert.equal(gameCode, EXPECTED[profile].gameCode, `${profile}: wrong game code`);
  assert.equal(digest, EXPECTED[profile].sha256, `${profile}: ROM hash does not match audited version`);
  const files = parseNitroFs(rom);
  const archivePath = "poketool/personal/evo.narc";
  assert.ok(files.has(archivePath), `${profile}: evolution archive missing`);
  const entries = parseNarcEntries(files.get(archivePath), `${profile}:${archivePath}`);
  const methodCounts = {};
  const evolutionRecords = [];
  const nonCanonicalMethodEntries = [];
  for (let speciesId = 0; speciesId < entries.length; speciesId++) {
    const record = entries[speciesId];
    assert.equal(record.length, 44, `${profile}: species ${speciesId} record must be 44 bytes`);
    for (let slot = 0; slot < 7; slot++) {
      const offset = slot * 6;
      const methodId = record.readUInt16LE(offset);
      if (methodId === 0) continue;
      const row = {
        sourceSpeciesId: speciesId,
        slot,
        methodId,
        parameter: record.readUInt16LE(offset + 2),
        targetSpeciesId: record.readUInt16LE(offset + 4),
      };
      methodCounts[methodId] = (methodCounts[methodId] ?? 0) + 1;
      evolutionRecords.push(row);
      if (!CANONICAL_METHOD_IDS.has(methodId)) nonCanonicalMethodEntries.push(row);
    }
  }
  return {
    filename: basename(filePath),
    gameCode,
    sha256: digest,
    romSize: rom.length,
    nitroFsFileCount: files.size,
    evolutionArchive: archivePath,
    evolutionArchiveEntryCount: entries.length,
    evolutionRecordSizeBytes: entries[0].length,
    evolutionEntryCount: evolutionRecords.length,
    methodCounts: Object.fromEntries(Object.entries(methodCounts).sort((a, b) => Number(a[0]) - Number(b[0]))),
    nonCanonicalMethodEntries,
    selectedRecords: evolutionRecords.filter((row) => [223, 458].includes(row.sourceSpeciesId)),
  };
}

const [platinumPath, projectPmPath] = process.argv.slice(2);
if (!platinumPath || !projectPmPath || process.argv.length !== 4) {
  console.error("Usage: node scripts/audit-evolution-roms.mjs <CPUF.nds> <CPUE.nds>");
  process.exit(2);
}
const report = {
  schemaVersion: "1.0.0",
  status: "direct_rom_nitrofs_narc_byte_audit",
  canonicalEvolutionMethodIds: Array.from(CANONICAL_METHOD_IDS),
  profiles: {
    platinum: auditProfile("platinum", platinumPath),
    project_pm: auditProfile("project_pm", projectPmPath),
  },
};
assert.equal(report.profiles.platinum.evolutionArchiveEntryCount, 508, "unexpected CPUF evolution entry count");
assert.equal(report.profiles.project_pm.evolutionArchiveEntryCount, 509, "unexpected CPUE evolution entry count");
assert.deepEqual(report.profiles.platinum.nonCanonicalMethodEntries, [], "CPUF has noncanonical method IDs");
assert.deepEqual(report.profiles.project_pm.nonCanonicalMethodEntries, [
  { sourceSpeciesId: 223, slot: 1, methodId: 27, parameter: 458, targetSpeciesId: 224 },
  { sourceSpeciesId: 458, slot: 0, methodId: 27, parameter: 223, targetSpeciesId: 226 },
], "CPUE method 27 records differ from the audited version");
console.log(JSON.stringify(report, null, 2));
