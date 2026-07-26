#!/usr/bin/env node
// Create React App forbids importing files from outside `src/` (ModuleScopePlugin).
// `npx ampx sandbox` / the Amplify Hosting pipeline write `amplify_outputs.json`
// to the repo root, so this script copies it into `src/` (git-ignored) before
// `start` / `build`. If the root file is absent (backend not provisioned yet),
// it ensures a placeholder exists so the app still builds.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_FILE = join(ROOT, 'src', 'amplify_outputs.json');
const ROOT_FILE = join(ROOT, 'amplify_outputs.json');

if (existsSync(ROOT_FILE)) {
  writeFileSync(SRC_FILE, readFileSync(ROOT_FILE, 'utf8'));
  console.log('[amplify] Synced amplify_outputs.json into src/.');
} else if (!existsSync(SRC_FILE)) {
  writeFileSync(SRC_FILE, '{}\n');
  console.log('[amplify] No amplify_outputs.json yet — wrote placeholder to src/.');
} else {
  console.log('[amplify] Using existing src/amplify_outputs.json.');
}
