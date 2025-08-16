import { createGzip } from 'zlib';
import { promises as fs } from 'fs';
import { globby } from 'globby';
import path from 'path';

const MAIN_LIMIT = 40 * 1024; // 40 KB gz
const ROUTE_LIMIT = 1024;     // 1 KB gz

async function gzSize(buf){
  return await new Promise((res, rej)=>{
    const gz = createGzip(); let out = 0;
    gz.on('data', c => out += c.length);
    gz.on('end', () => res(out));
    gz.on('error', rej);
    gz.end(buf);
  });
}

const files = await globby('dist/assets/*.js');
if (!files.length) { console.error('No built assets. Run `npm run build` first.'); process.exit(2); }

let mainGz = 0, largestRoute = 0, bad = [];

for (const f of files){
  const base = path.basename(f);
  const buf = await fs.readFile(f);
  const gz = await gzSize(buf);
  const isMain = /index-|main-|entry-/.test(base);
  if (isMain) {
    mainGz += gz;
  } else {
    largestRoute = Math.max(largestRoute, gz);
    if (gz > ROUTE_LIMIT) bad.push(`${base} route gz ${gz}B > ${ROUTE_LIMIT}B`);
  }
}

if (mainGz > MAIN_LIMIT) bad.push(`main gz ${mainGz}B > ${MAIN_LIMIT}B`);

console.log(`main gz: ${mainGz}B; largest route gz: ${largestRoute}B`);
if (bad.length){ console.error('Size guard failed:\n' + bad.join('\n')); process.exit(1); }
console.log('Size guard OK');
