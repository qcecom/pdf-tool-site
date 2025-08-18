import { test, expect } from '@playwright/test';
import { hasNonAscii } from '../utils/pdf';

const PATHS = ['/', '/compress', '/merge', '/ocr', '/ats', '/split'];

test('UI displays only ASCII characters', async ({ page }) => {
  const violations: string[] = [];

  for (const p of PATHS) {
    await page.goto(p);
    const texts = await page.locator('body').allTextContents();
    for (const t of texts) {
      if (hasNonAscii(t)) violations.push(t.trim());
    }
  }

  expect(violations.slice(0, 10)).toEqual([]);
});

