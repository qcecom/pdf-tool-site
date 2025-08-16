import fs from 'fs'; import path from 'path';
const SRC='src';
const files=[];
(function walk(d){ for (const f of fs.readdirSync(d)) {
  const p=path.join(d,f); const s=fs.statSync(p);
  if (s.isDirectory()) { if(!['node_modules','.git','dist','coverage'].includes(f)) walk(p); }
  else if (/\.(ts|tsx|js)$/.test(f)) files.push(p);
}})(SRC);

let changed=0, hits=[];
for (const p of files){
  let t=fs.readFileSync(p,'utf8'); const before=t;
  // find getDocument({ data: ... }).promise
  t=t.replace(/getDocument\s*\(\s*\{\s*data\s*:\s*([^}]+)\}\s*\)\s*\.promise/g,
              (_m, g1)=>`getPdfFromData(${g1.trim()})`);
  t=t.replace(/getDocument\s*\(\s*\{\s*data\s*\}\s*\)\s*\.promise/g,
              'getPdfFromData(data)');
  if (t!==before){
    // add import if not present
    if (!/getPdfFromData\s*\(/.test(before) || !/from\s+['"]\.{0,2}\/[^'"]*safePdf['"]/.test(before)){
      const importLine = `import { getPdfFromData } from '@/pdf/utils/safePdf';\n`;
      if (!/^import .*getPdfFromData/m.test(t)) t = importLine + t;
    }
    fs.writeFileSync(p,t); changed++; hits.push(p);
  }
}
console.log(`codemod: replaced raw getDocument in ${changed} file(s)`);
hits.forEach(h=>console.log(' -',h));
