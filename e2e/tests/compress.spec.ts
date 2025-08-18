import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { getFileSize, percentDelta } from '../utils/pdf';

const fixtures = path.join('e2e', 'fixtures', 'out');
const outDir = path.join('e2e', '.artifacts', 'compress');
fs.mkdirSync(outDir, { recursive: true });

const profiles = ['max', 'balanced', 'lossless'];

for (const profile of profiles) {
  test(`compress img-heavy with profile ${profile}`, async ({ page }) => {
    await page.goto('/compress');
    const input = page.locator('input[type=file]').first();
    const src = path.join(fixtures, 'img-heavy.pdf');
    await input.setInputFiles(src);
    const btn = page.locator(`button:has-text("${profile}")`);
    if (await btn.count()) {
      await btn.click();
    }
    const download = await page.waitForEvent('download');
    const dest = path.join(outDir, `${profile}-img-heavy.pdf`);
    await download.saveAs(dest);
    const delta = percentDelta(getFileSize(src), getFileSize(dest));
    if (profile === 'max') expect(delta).toBeLessThanOrEqual(-40);
    else if (profile === 'balanced') expect(delta).toBeLessThanOrEqual(-20);
    else expect(delta).toBeLessThan(10);
  });

  test(`vector-only does not inflate for ${profile}`, async ({ page }) => {
    await page.goto('/compress');
    const input = page.locator('input[type=file]').first();
    const src = path.join(fixtures, 'vector-only.pdf');
    await input.setInputFiles(src);
    const btn = page.locator(`button:has-text("${profile}")`);
    if (await btn.count()) {
      await btn.click();
    }
    const download = await page.waitForEvent('download');
    const dest = path.join(outDir, `${profile}-vector-only.pdf`);
    await download.saveAs(dest);
    const delta = percentDelta(getFileSize(src), getFileSize(dest));
    expect(delta).toBeLessThan(10);
  });
}

