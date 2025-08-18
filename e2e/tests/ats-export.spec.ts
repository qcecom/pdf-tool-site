import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { getPdfText } from '../utils/pdf';

const fixtures = path.join('e2e', 'fixtures', 'out');
const outDir = path.join('e2e', '.artifacts', 'ats');
fs.mkdirSync(outDir, { recursive: true });

test('ATS export cleans text', async ({ page }) => {
  await page.goto('/ats');
  const input = page.locator('input[type=file]').first();
  await input.setInputFiles(path.join(fixtures, 'ats-test.pdf'));
  const btn = page.locator('button:has-text("Export")').first();
  await btn.click();
  const download = await page.waitForEvent('download');
  const dest = path.join(outDir, download.suggestedFilename());
  await download.saveAs(dest);
  let text: string;
  if (dest.endsWith('.txt')) {
    text = fs.readFileSync(dest, 'utf8');
  } else {
    text = await getPdfText(fs.readFileSync(dest));
  }
  expect(text).not.toContain('© 2025');
  const headerCount = (text.match(/SeniorFitGuide — Page/g) || []).length;
  expect(headerCount).toBeLessThanOrEqual(1);
  expect(text).toMatch(/marketing/);
  expect(text).toMatch(/CRM/);
  expect(text).toMatch(/Google Ads/);
  expect(text).not.toMatch(/\s{3,}/);
});

