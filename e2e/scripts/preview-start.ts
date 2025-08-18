import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const pidFile = path.join(__dirname, '../.preview.pid');
const envFile = path.join(__dirname, '../../.env.e2e.local');

const proc = spawn('npx', ['vite', 'preview'], {
  env: process.env,
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true
});

proc.stdout.on('data', (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  const match = text.match(/http:\/\/localhost:(\d+)/);
  if (match) {
    const base = `http://localhost:${match[1]}`;
    fs.writeFileSync(envFile, `E2E_BASE=${base}\n`);
    fs.writeFileSync(pidFile, String(proc.pid));
  }
});

proc.stderr.on('data', (d) => process.stderr.write(d.toString()));

proc.unref();

