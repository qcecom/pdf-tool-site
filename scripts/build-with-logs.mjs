import { spawn } from 'child_process';
import fs from 'fs';
const log = fs.createWriteStream('build.log');
const proc = spawn('npx', ['vite', 'build', '--debug', '--logLevel', 'info', '--emptyOutDir'], { stdio: ['ignore', 'pipe', 'pipe'] });
let done=false; const T = setTimeout(()=>{ if(done) return; console.error('[build] timeout after 180s — see build.log'); try{proc.kill('SIGTERM')}catch{}; process.exit(2); }, 180000);
proc.stdout.on('data', d => log.write(d));
proc.stderr.on('data', d => log.write(d));
proc.on('exit', (code)=>{ done=true; clearTimeout(T); log.end(); if(code!==0){ console.error(`[build] exited ${code}. See build.log`); process.exit(code||1);} else { console.log('[build] ok'); }});
