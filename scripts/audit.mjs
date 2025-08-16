import { execFile } from 'child_process';
import fs from 'fs';

const REGISTRY = process.env.NPM_REGISTRY || 'https://registry.npmjs.org/';
const TIMEOUT_MS = parseInt(process.env.AUDIT_TIMEOUT_MS || '30000', 10);
const RETRIES = parseInt(process.env.AUDIT_RETRIES || '2', 10);
const STRICT = process.env.AUDIT_STRICT === '1'; // if 1 -> exit 1 when unreachable

function run(cmd, args, opts={}) {
  return new Promise((resolve) => {
    const child = execFile(cmd, args, { timeout: TIMEOUT_MS, ...opts }, (err, stdout, stderr) => {
      resolve({ err, stdout: stdout?.toString() || '', stderr: stderr?.toString() || '' });
    });
  });
}

async function npmAuditJson() {
  let lastErr;
  for (let i = 0; i <= RETRIES; i++) {
    const { err, stdout, stderr } = await run('npm', ['audit', '--json', `--registry=${REGISTRY}`]);
    if (!err && stdout.trim()) {
      try { return { ok: true, json: JSON.parse(stdout) }; }
      catch (e) { lastErr = e; }
    } else {
      lastErr = err || new Error(stderr || 'audit error');
    }
  }
  return { ok: false, error: lastErr };
}

async function npmLsDepth0() {
  const { stdout } = await run('npm', ['ls', '--depth=0', '--json', '--long', '--silent']);
  try { return JSON.parse(stdout || '{}'); } catch { return {}; }
}

function summarizeAdvisories(auditJson) {
  const out = { total: 0, critical: 0, high: 0, moderate: 0, low: 0, info: 0 };
  if (!auditJson?.vulnerabilities) return out;
  for (const v of Object.values(auditJson.vulnerabilities)) {
    out.total += v?.via?.length ? 1 : 0;
    const sev = (v.severity || '').toLowerCase();
    if (out[sev] !== undefined) out[sev] += 1;
  }
  return out;
}

function writeFiles({ markdown, json }) {
  fs.writeFileSync('AUDIT.md', markdown);
  fs.writeFileSync('audit-report.json', JSON.stringify(json, null, 2));
  console.log('Wrote AUDIT.md and audit-report.json');
}

function now() { return new Date().toISOString(); }

(async () => {
  console.log(`[audit] registry=${REGISTRY} timeout=${TIMEOUT_MS}ms retries=${RETRIES} strict=${STRICT}`);
  const res = await npmAuditJson();

  if (res.ok) {
    const summary = summarizeAdvisories(res.json);
    const md = [
      '# Dependency Audit',
      '',
      `- Timestamp: ${now()}`,
      `- Registry: ${REGISTRY}`,
      '',
      '## Summary',
      `- total: ${summary.total}`,
      `- critical: ${summary.critical}`,
      `- high: ${summary.high}`,
      `- moderate: ${summary.moderate}`,
      `- low: ${summary.low}`,
      `- info: ${summary.info}`,
      '',
      '## Notes',
      '- This report was generated from `npm audit --json`.',
      ''
    ].join('\n');

    writeFiles({ markdown: md, json: res.json });
    process.exit(0);
  }

  // Fallback path (API unreachable or parse failure)
  console.warn('[audit] audit API unreachable or parse failed. Writing fallback report…');
  const ls = await npmLsDepth0();

  const md = [
    '# Dependency Audit',
    '',
    `- Timestamp: ${now()}`,
    `- Registry: ${REGISTRY}`,
    '',
    '## Status',
    '- ❗ Audit API unreachable – audit incomplete.',
    '',
    '## Installed top-level packages',
    ...(Object.keys(ls.dependencies || {}).length
      ? Object.entries(ls.dependencies).slice(0, 50).map(
          ([name, info]) => `- ${name}@${info?.version || 'unknown'}`
        )
      : ['(none detected)']),
    '',
    '## Action',
    '- Re-run with a working network or different registry.',
    '- Example: `NPM_REGISTRY=https://registry.npmjs.org/ npm run audit`',
    ''
  ].join('\n');

  writeFiles({ markdown: md, json: { error: String(res.error || 'unreachable'), ls } });
  process.exit(STRICT ? 1 : 0);
})().catch((e) => {
  console.error('[audit] fatal error', e);
  process.exit(STRICT ? 1 : 0);
});
