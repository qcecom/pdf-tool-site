import { createGzip } from 'zlib';
import fs from 'fs';
import path from 'path';

const DIST_DIR   = 'dist';
const ASSETS_DIR = path.join(DIST_DIR, 'assets');
const MANIFEST   = path.join(DIST_DIR, 'manifest.json');

const MAIN_LIMIT  = 40 * 1024;  // 40 KB gzipped
const ROUTE_LIMIT = 1  * 1024;  // 1 KB gzipped

function gzSize(buf) {
  return new Promise((res, rej) => {
    const gz = createGzip(); let out = 0;
    gz.on('data', c => (out += c.length));
    gz.on('end', () => res(out));
    gz.on('error', rej);
    gz.end(buf);
  });
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST)) throw new Error('manifest.json not found. Run `npm run build` first.');
  return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
}

const isVendorFile = (f) => /(^|\/)(vendor|pdf-ocr-vendor|dnd-vendor)-/.test(f);
const isWorkerMeta = (m) => /\.worker\./.test((m.src||'') + (m.file||''));        // any worker entry
const isRouteMeta  = (m) => (m.src||'').includes('/src/app/routes/');             // only our route files

(async () => {
  const manifest = loadManifest();
  const entries = Object.values(manifest)
    .filter((m) => m && m.file && m.file.endsWith('.js'))
    .map((m) => ({ meta: m, file: path.join(ASSETS_DIR, m.file.replace(/^assets\//,'')) }));

  let main = 0, largestRoute = 0, offenders = [];

  for (const { meta, file } of entries) {
    const base = path.basename(file);
    if (isVendorFile(base) || isWorkerMeta(meta)) continue;

    const buf = fs.readFileSync(file);
    const gz  = await gzSize(buf);

    if (meta.isEntry) {
      main += gz;                   // sum main entries
    } else if (meta.isDynamicEntry && isRouteMeta(meta)) {
      largestRoute = Math.max(largestRoute, gz);
      if (gz > ROUTE_LIMIT) offenders.push(`${base} route gz ${gz}B > ${ROUTE_LIMIT}B`);
    }
  }

  console.log(`main gz: ${main}B; largest route gz: ${largestRoute}B`);
  if (main > MAIN_LIMIT) offenders.push(`main gz ${main}B > ${MAIN_LIMIT}B`);
  if (offenders.length) { console.error('Size guard failed:\n' + offenders.join('\n')); process.exit(1); }
  console.log('Size guard OK');
})().catch((e) => { console.error(e); process.exit(1); });
