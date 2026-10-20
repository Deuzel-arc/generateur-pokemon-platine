import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename } from "node:path";

const EXPECTED = {
  platinum: { gameCode: "CPUF", sha256: "1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8" },
  project_pm: { gameCode: "CPUE", sha256: "435b0288238f01f21eeeef7b5de6de3e3c9c3a9b70ea3b18d71b31ba282ae4e1" },
};
const NAME_BANK_INDEX = 412;
const NAME_BANK_KEY = 30764;
const NAME_BANK_COUNT = 496;

function parseNitroFs(rom) {
  const fntOffset = rom.readUInt32LE(0x40), fntSize = rom.readUInt32LE(0x44);
  const fatOffset = rom.readUInt32LE(0x48), fatSize = rom.readUInt32LE(0x4c);
  assert.ok(fntOffset + fntSize <= rom.length && fatOffset + fatSize <= rom.length, "FNT/FAT outside ROM");
  assert.equal(fatSize % 8, 0, "FAT size must be divisible by 8");
  const fnt = rom.subarray(fntOffset, fntOffset + fntSize), fat = [];
  for (let o = 0; o < fatSize; o += 8) {
    const start = rom.readUInt32LE(fatOffset + o), end = rom.readUInt32LE(fatOffset + o + 4);
    assert.ok(start <= end && end <= rom.length, `invalid FAT range ${o / 8}`); fat.push([start, end]);
  }
  const files = new Map(), visited = new Set();
  function walk(dirId, prefix = "") {
    const index = dirId & 0x0fff; assert.ok(!visited.has(index), `directory cycle ${dirId.toString(16)}`); visited.add(index);
    const off = index * 8; assert.ok(off + 8 <= fnt.length, "directory table outside FNT");
    const sub = fnt.readUInt32LE(off); let fileId = fnt.readUInt16LE(off + 4), p = sub;
    assert.ok(sub < fnt.length, "directory subtable outside FNT");
    while (true) {
      assert.ok(p < fnt.length, "unterminated NitroFS directory");
      const b = fnt[p++]; if (b === 0) break;
      const isDir = (b & 0x80) !== 0, n = b & 0x7f; assert.ok(n > 0 && p + n <= fnt.length, "invalid NitroFS name");
      const name = fnt.subarray(p, p + n).toString("ascii"); p += n;
      if (isDir) { assert.ok(p + 2 <= fnt.length, "truncated directory reference"); const child = fnt.readUInt16LE(p); p += 2; walk(child, `${prefix}${name}/`); }
      else { assert.ok(fileId < fat.length, `file ID ${fileId} outside FAT`); const [s, e] = fat[fileId++], path = `${prefix}${name}`; assert.ok(!files.has(path), `duplicate path ${path}`); files.set(path, rom.subarray(s, e)); }
    }
  }
  walk(0xf000); return files;
}

function narcEntries(data, label) {
  assert.equal(data.subarray(0, 4).toString("ascii"), "NARC", `${label}: bad magic`);
  assert.equal(data.readUInt32LE(8), data.length, `${label}: size mismatch`);
  const headerSize = data.readUInt16LE(12), blockCount = data.readUInt16LE(14); assert.equal(headerSize, 0x10);
  let p = headerSize; const blocks = new Map();
  for (let i = 0; i < blockCount; i++) {
    assert.ok(p + 8 <= data.length, `${label}: truncated block`);
    const tag = data.subarray(p, p + 4).toString("ascii"), size = data.readUInt32LE(p + 4);
    assert.ok(size >= 8 && p + size <= data.length, `${label}: invalid ${tag} block`);
    assert.ok(!blocks.has(tag), `${label}: duplicate ${tag}`); blocks.set(tag, data.subarray(p + 8, p + size)); p += size;
  }
  assert.equal(p, data.length, `${label}: trailing bytes`);
  const btaf = blocks.get("BTAF"), gmif = blocks.get("GMIF"); assert.ok(btaf && gmif, `${label}: missing blocks`);
  const n = btaf.readUInt16LE(0); assert.equal(btaf.length, 4 + n * 8);
  return Array.from({ length: n }, (_, i) => { const s = btaf.readUInt32LE(4 + i * 8), e = btaf.readUInt32LE(8 + i * 8); assert.ok(s <= e && e <= gmif.length); return gmif.subarray(s, e); });
}

const charMap = new Map([[0x0000, ""], [0x0001, " "], [0x01de, " "], [0x0120, "&"]]);
for (let i = 0; i < 10; i++) charMap.set(0x0121 + i, String(i));
for (let i = 0; i < 26; i++) charMap.set(0x012b + i, String.fromCharCode(65 + i));
for (let i = 0; i < 26; i++) charMap.set(0x0145 + i, String.fromCharCode(97 + i));
const accented = ["À","Á","Â","Ã","Ä","Å","Æ","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","×","Ø","Ù","Ú","Û","Ü","Ý","Þ","ß","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ð","ñ","ò","ó","ô","õ","ö","÷","ø","ù","ú","û","ü","ý","þ","ÿ","Œ","œ","Ş","ş","ª","º","¹","²","³"];
accented.forEach((value, i) => charMap.set(0x015f + i, value));
for (const [code, value] of [[0x01a8,"$"],[0x01a9,"¡"],[0x01aa,"¿"],[0x01ab,"!"],[0x01ac,"?"],[0x01ad,","],[0x01ae,"."],[0x01af,"…"],[0x01b0,"·"],[0x01b1,"/"],[0x01b2,"‘"],[0x01b3,"’"],[0x01b4,"“"],[0x01b5,"”"],[0x01b6,"„"],[0x01b7,"《"],[0x01b8,"》"],[0x01b9,"("],[0x01ba,")"],[0x01bb,"♂"],[0x01bc,"♀"],[0x01bd,"+"],[0x01be,"-"],[0x01bf,"*"],[0x01c0,"#"],[0x01c1,"="],[0x01c2,"&"]]) charMap.set(code, value);

function displayNameCandidate(raw) {
  return raw.toLocaleLowerCase("fr-FR").replace(/(^|[\s.-])(\p{L})/gu, (_, prefix, letter) => prefix + letter.toLocaleUpperCase("fr-FR"));
}
function decodeNameBank(bank, label) {
  const count = bank.readUInt16LE(0), key = bank.readUInt16LE(2);
  assert.equal(count, NAME_BANK_COUNT, `${label}: species-name bank count changed`);
  assert.equal(key, NAME_BANK_KEY, `${label}: species-name bank key changed`);
  let cursor = 4 + count * 8; assert.ok(cursor <= bank.length, `${label}: allocation table outside bank`);
  const entries = [];
  for (let i = 0; i < count; i++) {
    let offset = bank.readUInt32LE(4 + i * 8), length = bank.readUInt32LE(8 + i * 8);
    let allocKey = (765 * (i + 1) * key) & 0xffff; allocKey = (allocKey | (allocKey << 16)) >>> 0;
    offset = (offset ^ allocKey) >>> 0; length = (length ^ allocKey) >>> 0;
    assert.ok(length > 0 && cursor + length * 2 <= bank.length, `${label}: invalid allocation ${i}`);
    let seed = ((i + 1) * 596947) & 0xffff, romText = "";
    for (let j = 0; j < length; j++) {
      const encrypted = bank.readUInt16LE(cursor + j * 2), code = encrypted ^ seed;
      seed = (seed + 18749) & 0xffff; if (code === 0xffff) break;
      assert.ok(charMap.has(code), `${label}: unknown species-name charcode 0x${code.toString(16)} in entry ${i}`);
      romText += charMap.get(code);
    }
    entries.push({ id: i, romText, displayNameCandidate: displayNameCandidate(romText), encryptedOffset: offset, decodedLength: length });
    cursor += length * 2;
  }
  return { count, key, entries, bytes: bank.length };
}

function audit(profile, filePath) {
  const rom = readFileSync(filePath), gameCode = rom.subarray(0x0c, 0x10).toString("ascii");
  const digest = createHash("sha256").update(rom).digest("hex");
  assert.equal(gameCode, EXPECTED[profile].gameCode, `${profile}: wrong game code`);
  assert.equal(digest, EXPECTED[profile].sha256, `${profile}: ROM hash mismatch`);
  const files = parseNitroFs(rom), archivePath = "msgdata/pl_msg.narc";
  assert.ok(files.has(archivePath), `${profile}: localized message archive missing`);
  const narc = narcEntries(files.get(archivePath), `${profile}:${archivePath}`);
  assert.ok(narc.length > NAME_BANK_INDEX, `${profile}: name bank index outside NARC`);
  const bank = decodeNameBank(narc[NAME_BANK_INDEX], `${profile}:species-name-bank`);
  assert.equal(bank.entries[6].romText, "DRACAUFEU", `${profile}: ID 6 name anchor mismatch`);
  assert.equal(bank.entries[223].romText, "REMORAID", `${profile}: ID 223 name anchor mismatch`);
  assert.equal(bank.entries[458].romText, "BABIMANTA", `${profile}: ID 458 name anchor mismatch`);
  assert.equal(bank.entries[468].romText, "TOGEKISS", `${profile}: ID 468 name anchor mismatch`);
  return { filename: basename(filePath), gameCode, sha256: digest, romSize: rom.length, nitroFsFileCount: files.size, archivePath, archiveEntryCount: narc.length, nameBankIndex: NAME_BANK_INDEX, nameBankKey: bank.key, nameBankBytes: bank.bytes, entries: bank.entries };
}

const [platinumPath, projectPmPath] = process.argv.slice(2);
if (!platinumPath || !projectPmPath || process.argv.length !== 4) { console.error("Usage: node scripts/audit-rom-species-name-bank.mjs <CPUF.nds> <CPUE.nds>"); process.exit(2); }
const platinum = audit("platinum", platinumPath), projectPm = audit("project_pm", projectPmPath);
assert.deepEqual(platinum.entries.map((row) => row.romText), projectPm.entries.map((row) => row.romText), "species-name banks differ between ROM revisions");
assert.equal(platinum.entries.length, 496);
assert.deepEqual(platinum.entries.slice(1, 494).map((row) => row.id), Array.from({ length: 493 }, (_, i) => i + 1));
assert.equal(platinum.entries[494].displayNameCandidate, "Oeuf");
assert.equal(platinum.entries[495].displayNameCandidate, "Mauv. Oeuf");
console.log(JSON.stringify({ schemaVersion: "1.0.0", status: "direct_rom_species_name_bank_decoded", canonicalReference: { repository: "pret/pokeplatinum", commit: "06c6e9a0348da283be8d9225d0bec03c349ff5c2", textBankSymbol: "TEXT_BANK_SPECIES_NAME", textBankIndex: NAME_BANK_INDEX, expectedMessageKey: NAME_BANK_KEY }, identicalBetweenProfiles: true, platinum, project_pm: projectPm, unmappedPersonalArchiveIds: { sharedFormsWithoutDedicatedNameBankEntries: [496,497,498,499,500,501,502,503,504,505,506,507], projectPmExtraSpeciesId: 508 } }, null, 2));
