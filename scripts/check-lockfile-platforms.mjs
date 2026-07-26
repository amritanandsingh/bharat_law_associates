#!/usr/bin/env node
// Guard against a macOS-pruned package-lock.json breaking the Amplify build.
//
// Native deps (@parcel/watcher via @aws-amplify/backend-cli, esbuild via the
// CDK function bundler) ship their binaries as per-platform optional packages.
// Regenerating the lockfile with node_modules still present makes npm drop
// every platform except the local one, and `npm ci` installs exactly what the
// lockfile lists — so Amplify's linux-x64 builder ends up with no binary and
// `ampx pipeline-deploy` dies on "No prebuild or local build of ... found".
//
// Fix when this fails:  rm -rf node_modules package-lock.json && npm install
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCK_FILE = join(ROOT, 'package-lock.json');

// Binaries the Amplify builder (Amazon Linux, x64, glibc) cannot start without,
// paired with the parent that pulls them in. Checked only when the parent is
// actually in the tree, so dropping a dependency never fails the build.
const REQUIRED = [
  { parent: 'node_modules/@parcel/watcher', binary: 'node_modules/@parcel/watcher-linux-x64-glibc' },
  { parent: 'node_modules/esbuild', binary: 'node_modules/@esbuild/linux-x64' },
];

// A linux-x64 optional dep of an installed package must be in the lockfile too.
// Catches future native deps (rollup, lightningcss, swc, ...) without edits here.
const isLinuxX64 = (name) =>
  name.includes('linux') && name.includes('x64') && !name.includes('musl');

const lock = JSON.parse(readFileSync(LOCK_FILE, 'utf8'));
const packages = lock.packages ?? {};
const missing = [];

for (const { parent, binary } of REQUIRED) {
  if (packages[parent] && !packages[binary]) missing.push({ binary, parent });
}

for (const [path, meta] of Object.entries(packages)) {
  for (const name of Object.keys(meta.optionalDependencies ?? {})) {
    const binary = `node_modules/${name}`;
    if (!isLinuxX64(name) || packages[binary]) continue;
    if (missing.some((m) => m.binary === binary)) continue;
    missing.push({ binary, parent: path || '(root)' });
  }
}

if (missing.length === 0) {
  console.log('[lockfile] linux-x64 binaries present — safe for `npm ci` on Amplify.');
  process.exit(0);
}

console.error(
  `[lockfile] package-lock.json is missing ${missing.length} linux-x64 package(s) that ` +
    '`npm ci` needs on the Amplify builder:',
);
missing.forEach(({ binary, parent }) =>
  console.error(`  - ${binary.replace('node_modules/', '')}  (optional dep of ${parent})`),
);
console.error(
  '\nThe lockfile was almost certainly regenerated on macOS with node_modules present,\n' +
    'which makes npm write out only the local platform. Regenerate from a clean tree:\n' +
    '  rm -rf node_modules package-lock.json && npm install --legacy-peer-deps\n' +
    'then re-run this script before committing.',
);
process.exit(1);
