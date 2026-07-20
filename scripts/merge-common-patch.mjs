#!/usr/bin/env node
// Merge translated common-key patches into each locale's common.json.
// Reads <CP>/<code>.json (flat map of dotted key -> translated value) and
// setPath-merges each key into src/locales/<code>/common.json. Deterministic;
// never rewrites the whole file, so existing translations are preserved.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = join(ROOT, 'src', 'locales');
const CP =
  '/private/tmp/claude-501/-Users-amritsingh-Desktop-Production-bharat-law-associates/b8652724-9fe3-49d3-b441-d8ca28118ca7/scratchpad/common-patch';

const setPath = (obj, path, value) => {
  const parts = path.split('.');
  let node = obj;
  parts.slice(0, -1).forEach((p) => {
    if (!node[p] || typeof node[p] !== 'object' || Array.isArray(node[p])) node[p] = {};
    node = node[p];
  });
  node[parts[parts.length - 1]] = value;
};

const patches = readdirSync(CP).filter((f) => f.endsWith('.json'));
let merged = 0;
const skipped = [];

for (const file of patches) {
  const code = file.replace('.json', '');
  const target = join(LOCALES, code, 'common.json');
  if (!existsSync(target)) {
    skipped.push(`${code} (no common.json)`);
    continue;
  }
  let patch;
  try {
    patch = JSON.parse(readFileSync(join(CP, file), 'utf8'));
  } catch (e) {
    skipped.push(`${code} (bad patch JSON: ${e.message})`);
    continue;
  }
  const common = JSON.parse(readFileSync(target, 'utf8'));
  for (const [key, value] of Object.entries(patch)) {
    setPath(common, key, value);
  }
  writeFileSync(target, `${JSON.stringify(common, null, 2)}\n`, 'utf8');
  merged += 1;
}

console.log(`merged ${merged} locale common.json files`);
if (skipped.length) console.log(`skipped: ${skipped.join(', ')}`);
