import { test, expect } from '@playwright/test';

const TOOL_PATHS = ['compress', 'merge', 'ocr', 'ats', 'split'];

test('app renders without console errors and tools mount', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('/');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();

  for (const tool of TOOL_PATHS) {
    const link = page.locator(`a[href*="${tool}"]`).first();
    if (await link.count()) {
      await link.click();
      const dz = page.locator('[data-testid="dropzone"], [data-testid="main-cta"], input[type=file]');
      await expect(dz.first()).toBeVisible();
      await page.goBack();
    }
  }

  expect(errors).toEqual([]);
});

