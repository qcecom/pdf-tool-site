import { test, expect } from '@playwright/test';

test('non PDF upload displays error', async ({ page }) => {
  await page.goto('/compress');
  const input = page.locator('input[type=file]').first();
  await input.setInputFiles('e2e/fixtures/out/not-a-pdf.txt');
  const err = page.locator('text=PDF');
  await expect(err.first()).toBeVisible();
});

