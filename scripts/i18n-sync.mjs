#!/usr/bin/env node
// i18n locale sync tool.
//   node scripts/i18n-sync.mjs check   -> fail if any locale's key set differs from en/
//   node scripts/i18n-sync.mjs fill    -> copy English text into missing keys, drop orphans,
//                                         emit missing-translations.json worklist
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES_DIR = join(ROOT, 'src', 'locales');
const SOURCE = 'en';
const NAMESPACES = ['common', 'services'];

const mode = process.argv[2];
if (!['check', 'fill'].includes(mode)) {
  console.error('Usage: node scripts/i18n-sync.mjs <check|fill>');
  process.exit(2);
}

const flatten = (obj, prefix = '') =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(acc, flatten(value, path));
    } else {
      acc[path] = value;
    }
    return acc;
  }, {});

const setPath = (obj, path, value) => {
  const parts = path.split('.');
  let node = obj;
  parts.slice(0, -1).forEach((p) => {
    if (!node[p] || typeof node[p] !== 'object' || Array.isArray(node[p])) node[p] = {};
    node = node[p];
  });
  node[parts[parts.length - 1]] = value;
};

const placeholdersOf = (value) => {
  if (typeof value !== 'string') return [];
  return [...value.matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)].map((m) => m[1]).sort();
};

const locales = readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== SOURCE)
  .map((d) => d.name);

let failed = false;
const worklist = {};

for (const ns of NAMESPACES) {
  const enRaw = JSON.parse(readFileSync(join(LOCALES_DIR, SOURCE, `${ns}.json`), 'utf8'));
  const enFlat = flatten(enRaw);
  const enKeys = Object.keys(enFlat);

  for (const locale of locales) {
    const file = join(LOCALES_DIR, locale, `${ns}.json`);
    let raw = {};
    if (existsSync(file)) {
      try {
        raw = JSON.parse(readFileSync(file, 'utf8'));
      } catch (e) {
        console.error(`INVALID JSON  ${locale}/${ns}.json — ${e.message}`);
        failed = true;
        continue;
      }
    } else if (mode === 'check') {
      console.error(`MISSING FILE  ${locale}/${ns}.json`);
      failed = true;
      continue;
    }

    const flat = flatten(raw);
    const missing = enKeys.filter((k) => !(k in flat));
    const orphans = Object.keys(flat).filter((k) => !(k in enFlat));
    const badPlaceholders = enKeys.filter(
      (k) =>
        k in flat &&
        typeof enFlat[k] === 'string' &&
        placeholdersOf(enFlat[k]).join(',') !== placeholdersOf(flat[k]).join(',')
    );
    const badArrays = enKeys.filter(
      (k) =>
        k in flat &&
        Array.isArray(enFlat[k]) &&
        (!Array.isArray(flat[k]) || flat[k].length !== enFlat[k].length)
    );

    if (mode === 'check') {
      if (missing.length || orphans.length || badPlaceholders.length || badArrays.length) {
        failed = true;
        if (missing.length) console.error(`MISSING KEYS  ${locale}/${ns}: ${missing.join(', ')}`);
        if (orphans.length) console.error(`ORPHAN KEYS   ${locale}/${ns}: ${orphans.join(', ')}`);
        if (badPlaceholders.length)
          console.error(`PLACEHOLDERS  ${locale}/${ns}: ${badPlaceholders.join(', ')}`);
        if (badArrays.length)
          console.error(`ARRAY LENGTH  ${locale}/${ns}: ${badArrays.join(', ')}`);
      }
    } else {
      const next = {};
      for (const key of enKeys) {
        setPath(next, key, key in flat ? flat[key] : enFlat[key]);
      }
      mkdirSync(join(LOCALES_DIR, locale), { recursive: true });
      writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
      if (missing.length) {
        worklist[locale] = worklist[locale] || {};
        worklist[locale][ns] = missing;
      }
    }
  }
}

if (mode === 'fill') {
  const outFile = join(ROOT, 'missing-translations.json');
  writeFileSync(outFile, `${JSON.stringify(worklist, null, 2)}\n`, 'utf8');
  const total = Object.values(worklist).reduce(
    (n, ns) => n + Object.values(ns).reduce((m, keys) => m + keys.length, 0),
    0
  );
  console.log(`fill complete — ${total} keys English-filled; worklist at missing-translations.json`);
}

if (mode === 'check') {
  if (failed) {
    console.error('\ni18n check FAILED');
    process.exit(1);
  }
  console.log(`i18n check OK — ${locales.length} locales × ${NAMESPACES.length} namespaces in sync with en/`);
}
