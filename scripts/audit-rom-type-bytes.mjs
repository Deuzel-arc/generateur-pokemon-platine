import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename } from "node:path";

const EXPECTED = {
  platinum: { gameCode: "CPUF", sha256: "1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8" },
  project_pm: { gameCode: "CPUE", sha256: "435b0288238f01f21eeeef7b5de6de3e3c9c3a9b70ea3b18d71b31ba282ae4e1" },
};

function parseNitroFs(rom) {
  const fntOffset = rom.readUInt32LE(0x40), fntSize = rom.readUInt32LE(0x44);
  const fatOffset = rom.readUInt32LE(0x48), fatSize = rom.readUInt32LE(0x4c);
  assert.ok(fntOffset + fntSize <= rom.length && fatOffset + fatSize <= rom.length, "FNT/FAT outside ROM");
  assert.equal(fatSize % 8, 0, "FAT size must be divisible by 8");
  const fnt = rom.subarray(fntOffset, fntOffset + fntSize), fat = [];
  for (let o = 0; o < fatSize; o += 8) {
    const start = rom.readUInt32LE(fatOffset + o), end = rom.readUInt32LE(fatOffset + o + 4);
    assert.ok(start <= end && end <= rom.length, `invalid FAT range ${o / 8}`);
    fat.push([start, end]);
  }
  const files = new Map(), visited = new Set();
  function walk(dirId, prefix = "") {
    const index = dirId & 0x0fff;
    assert.ok(!visited.has(index), `directory cycle at ${dirId.toString(16)}`); visited.add(index);
    const off = index * 8;
    assert.ok(off + 8 <= fnt.length, "directory table outside FNT");
    const sub = fnt.readUInt32LE(off); let fileId = fnt.readUInt16LE(off + 4); let p = sub;
    assert.ok(sub < fnt.length, "directory subtable outside FNT");
    while (true) {
      assert.ok(p < fnt.length, "unterminated directory");
      const b = fnt[p++]; if (b === 0) break;
      const isDir = (b & 0x80) !== 0, n = b & 0x7f;
      assert.ok(n > 0 && p + n <= fnt.length, "invalid NitroFS name");
      const name = fnt.subarray(p, p + n).toString("ascii"); p += n;
      if (isDir) {
        assert.ok(p + 2 <= fnt.length, "truncated directory ref");
        const child = fnt.readUInt16LE(p); p += 2; walk(child, `${prefix}${name}/`);
      } else {
        assert.ok(fileId < fat.length, `file ID ${fileId} outside FAT`);
        const [s, e] = fat[fileId++], path = `${prefix}${name}`;
        assert.ok(!files.has(path), `duplicate path ${path}`); files.set(path, rom.subarray(s, e));
      }
    }
  }
  walk(0xf000); return files;
}

function narcEntries(data, label) {
  assert.equal(data.subarray(0, 4).toString("ascii"), "NARC", `${label}: bad magic`);
  assert.equal(data.readUInt32LE(8), data.length, `${label}: declared size mismatch`);
  const headerSize = data.readUInt16LE(12), count = data.readUInt16LE(14); assert.equal(headerSize, 0x10);
  let p = headerSize; const blocks = new Map();
  for (let i = 0; i < count; i++) {
    assert.ok(p + 8 <= data.length, `${label}: truncated block`);
    const tag = data.subarray(p, p + 4).toString("ascii"), size = data.readUInt32LE(p + 4);
    assert.ok(size >= 8 && p + size <= data.length, `${label}: invalid ${tag} block`);
    assert.ok(!blocks.has(tag), `${label}: duplicate ${tag}`); blocks.set(tag, data.subarray(p + 8, p + size)); p += size;
  }
  assert.equal(p, data.length, `${label}: trailing bytes`);
  const btaf = blocks.get("BTAF"), gmif = blocks.get("GMIF"); assert.ok(btaf && gmif, `${label}: missing blocks`);
  const n = btaf.readUInt16LE(0); assert.equal(btaf.length, 4 + n * 8);
  return Array.from({ length: n }, (_, i) => {
    const s = btaf.readUInt32LE(4 + i * 8), e = btaf.readUInt32LE(8 + i * 8);
    assert.ok(s <= e && e <= gmif.length, `${label}: invalid entry ${i}`); return gmif.subarray(s, e);
  });
}

function audit(profile, filePath) {
  const rom = readFileSync(filePath), gameCode = rom.subarray(0x0c, 0x10).toString("ascii");
  const digest = createHash("sha256").update(rom).digest("hex");
  assert.equal(gameCode, EXPECTED[profile].gameCode, `${profile}: wrong game code`);
  assert.equal(digest, EXPECTED[profile].sha256, `${profile}: ROM hash mismatch`);
  const files = parseNitroFs(rom);
  const personalPath = "poketool/personal/pl_personal.narc", movesPath = "poketool/waza/pl_waza_tbl.narc";
  assert.ok(files.has(personalPath) && files.has(movesPath), `${profile}: required NARC missing`);
  const species = narcEntries(files.get(personalPath), `${profile}:${personalPath}`);
  const moves = narcEntries(files.get(movesPath), `${profile}:${movesPath}`);
  const speciesCounts = {}, moveCounts = {}, speciesId9 = [], moveId9 = [];
  let speciesId9Slots = 0;
  species.forEach((r, id) => {
    assert.equal(r.length, 44, `${profile}: personal entry ${id} must be 44 bytes`);
    const types = [r[6], r[7]];
    types.forEach((t) => { speciesCounts[t] = (speciesCounts[t] ?? 0) + 1; });
    const count = types.filter((t) => t === 9).length; speciesId9Slots += count;
    if (count) speciesId9.push({ id, rawTypeIds: types });
  });
  moves.forEach((r, id) => {
    assert.equal(r.length, 16, `${profile}: move entry ${id} must be 16 bytes`);
    const t = r[4]; moveCounts[t] = (moveCounts[t] ?? 0) + 1; if (t === 9) moveId9.push(id);
  });
  return {
    filename: basename(filePath), gameCode, sha256: digest, romSize: rom.length, nitroFsFileCount: files.size,
    personalArchive: { path: personalPath, entries: species.length, recordSizeBytes: species[0].length, typeOffsets: [6, 7], typeIdCounts: Object.fromEntries(Object.entries(speciesCounts).sort((a,b)=>Number(a[0])-Number(b[0]))), typeId9SlotCount: speciesId9Slots, entriesContainingTypeId9: speciesId9, internalSpeciesId6RawTypeIds: [species[6][6], species[6][7]], internalSpeciesId6RawPrefixHex: species[6].subarray(0, 10).toString("hex") },
    movesArchive: { path: movesPath, entries: moves.length, recordSizeBytes: moves[0].length, typeOffset: 4, typeIdCounts: Object.fromEntries(Object.entries(moveCounts).sort((a,b)=>Number(a[0])-Number(b[0]))), entriesContainingTypeId9: moveId9 },
  };
}

const [platinumPath, projectPmPath] = process.argv.slice(2);
if (!platinumPath || !projectPmPath || process.argv.length !== 4) {
  console.error("Usage: node scripts/audit-rom-type-bytes.mjs <CPUF.nds> <CPUE.nds>"); process.exit(2);
}
const report = { schemaVersion: "1.0.0", status: "direct_rom_type_byte_audit", profiles: { platinum: audit("platinum", platinumPath), project_pm: audit("project_pm", projectPmPath) } };
assert.equal(report.profiles.platinum.personalArchive.entries, 508);
assert.equal(report.profiles.project_pm.personalArchive.entries, 509);
assert.equal(report.profiles.platinum.personalArchive.typeId9SlotCount, 0);
assert.deepEqual(report.profiles.platinum.movesArchive.entriesContainingTypeId9, [174]);
assert.equal(report.profiles.project_pm.personalArchive.entriesContainingTypeId9.length, 31);
assert.equal(report.profiles.project_pm.personalArchive.typeId9SlotCount, 37);
assert.deepEqual(report.profiles.project_pm.movesArchive.entriesContainingTypeId9, [66, 140, 186, 204, 236, 295, 296, 461]);
assert.deepEqual(report.profiles.project_pm.personalArchive.internalSpeciesId6RawTypeIds, [10, 16]);
console.log(JSON.stringify(report, null, 2));
