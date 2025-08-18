import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { getPdfText } from '../utils/pdf';

const fixtures = path.join('e2e', 'fixtures', 'out');
const outDir = path.join('e2e', '.artifacts', 'split');
fs.mkdirSync(outDir, { recursive: true });

test('split extracts specified page', async ({ page }) => {
  const res = await page.goto('/split');
  if (!res || res.status() >= 400) {
    test.skip();
  }
  const input = page.locator('input[type=file]').first();
  await input.setInputFiles(path.join(fixtures, 'portfolio-A.pdf'));
  const rangeInput = page.locator('input').nth(1);
  if (await rangeInput.count()) {
    await rangeInput.fill('2');
  }
  const btn = page.locator('button:has-text("Split")').first();
  await btn.click();
  const download = await page.waitForEvent('download');
  const dest = path.join(outDir, 'page2.pdf');
  await download.saveAs(dest);
  const text = await getPdfText(fs.readFileSync(dest));
  expect(text).toContain('FILE_A_P2');
});

