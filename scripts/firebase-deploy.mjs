import { spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function firebaseExecutable() {
  const win = process.platform === 'win32';
  const bin = join(root, 'node_modules', '.bin', win ? 'firebase.cmd' : 'firebase');
  if (existsSync(bin)) return bin;
  return 'firebase';
}

function readFirebasercDefault() {
  const p = join(root, '.firebaserc');
  if (!existsSync(p)) return null;
  try {
    const { projects } = JSON.parse(readFileSync(p, 'utf8'));
    const id = projects?.default;
    return typeof id === 'string' && id.length > 0 ? id : null;
  } catch {
    return null;
  }
}

function readEnvProjectId() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) return null;
  const text = readFileSync(envPath, 'utf8');
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (key !== 'VITE_FIREBASE_PROJECT_ID') continue;
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    return val || null;
  }
  return null;
}

const fromRc = readFirebasercDefault();
const fromEnv = readEnvProjectId();
const placeholder = new Set(['your-project-id', 'demo-project']);

const args = ['deploy', '--only', 'hosting'];
if (!fromRc) {
  const id = fromEnv && !placeholder.has(fromEnv) ? fromEnv : null;
  if (!id) {
    console.error(`Firebase: no default project.

Fix one of these:
  1) Run: npx firebase use --add   (creates .firebaserc)
  2) Set VITE_FIREBASE_PROJECT_ID in .env to your real Firebase project ID

Then: npm run deploy
`);
    process.exit(1);
  }
  args.push('--project', id);
}

const cmd = firebaseExecutable();
const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });
if (r.error) {
  console.error(r.error.message);
  process.exit(1);
}
process.exit(r.status === 0 ? 0 : r.status ?? 1);
