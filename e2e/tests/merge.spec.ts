import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { getPdfText } from '../utils/pdf';

const fixtures = path.join('e2e', 'fixtures', 'out');
const outDir = path.join('e2e', '.artifacts', 'merge');
fs.mkdirSync(outDir, { recursive: true });

test('merge preserves file order', async ({ page }) => {
  await page.goto('/merge');
  const input = page.locator('input[type=file]').first();
  await input.setInputFiles([
    path.join(fixtures, 'portfolio-A.pdf'),
    path.join(fixtures, 'portfolio-B.pdf')
  ]);
  const mergeBtn = page.locator('button:has-text("Merge")').first();
  await mergeBtn.click();
  const download = await page.waitForEvent('download');
  const dest = path.join(outDir, 'merged.pdf');
  await download.saveAs(dest);

  const text = await getPdfText(fs.readFileSync(dest));
  const order = ['FILE_A_P1', 'FILE_A_P2', 'FILE_B_P1', 'FILE_B_P2'];
  for (const o of order) {
    expect(text).toContain(o);
  }
  expect(text.indexOf('FILE_A_P2')).toBeLessThan(text.indexOf('FILE_B_P1'));
});

