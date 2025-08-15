// TODO: ensure Playwright is installed with browsers in CI before enabling.
import { test, expect } from '@playwright/test';
import { makeSamplePdf } from './helpers/makeSamplePdf';

test('compress tool works', async ({ page }) => {
  const file = await makeSamplePdf();
  await page.goto('/');
  await page.goto('/cv/compress');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.setInputFiles('input[type="file"]', file),
    page.waitForSelector('progress')
  ]);
  await download.delete();
});

test('merge tool works', async ({ page }) => {
  const fileA = await makeSamplePdf();
  const fileB = await makeSamplePdf();
  await page.goto('/cv/merge');
  await page.setInputFiles('input[type="file"]', fileA);
  await page.setInputFiles('input[type="file"]', fileB);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Merge')
  ]);
  await download.delete();
});

test('ATS export shows text', async ({ page }) => {
  const file = await makeSamplePdf();
  await page.goto('/cv/ats-export');
  await page.setInputFiles('input[type="file"]', file);
  await page.waitForSelector('textarea');
});
