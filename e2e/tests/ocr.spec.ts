import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { getPdfText } from '../utils/pdf';

const fixtures = path.join('e2e', 'fixtures', 'out');
const outDir = path.join('e2e', '.artifacts', 'ocr');
fs.mkdirSync(outDir, { recursive: true });

test('ocr extracts text', async ({ page }) => {
  await page.goto('/ocr');
  const input = page.locator('input[type=file]').first();
  await input.setInputFiles(path.join(fixtures, 'scanned-like.pdf'));
  const btn = page.locator('button:has-text("OCR")').first();
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
  expect(text).toContain('THE QUICK BROWN FOX 12345');
});

