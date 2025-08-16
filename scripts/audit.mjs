import fs from 'fs';
import { execSync } from 'child_process';

function runAudit() {
  try {
    const out = execSync('npm audit --json', { stdio: 'pipe' }).toString();
    return JSON.parse(out);
  } catch (e) {
    console.error('npm audit failed, writing empty report');
    if (e.stdout && e.stdout.length) {
      try { return JSON.parse(e.stdout.toString()); } catch {}
    }
    return { metadata: { vulnerabilities: {} } };
  }
}

function format(data) {
  const levels = ['critical', 'high', 'moderate', 'low', 'info'];
  const vuln = data.metadata?.vulnerabilities || {};
  let md = '# npm audit report\n\n';
  md += '## Summary\n';
  for (const level of levels) {
    const count = vuln[level] ?? 0;
    md += `- ${level}: ${count}\n`;
  }
  md += `\nGenerated on ${new Date().toISOString()}\n`;
  return md;
}

const data = runAudit();
fs.writeFileSync('AUDIT.md', format(data));
console.log('Audit written to AUDIT.md');
