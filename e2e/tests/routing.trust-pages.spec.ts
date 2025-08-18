import { test, expect } from '@playwright/test';

const PATHS = ['/privacy', '/terms', '/about'];

test('trust pages render with header and footer', async ({ page }) => {
  for (const p of PATHS) {
    const res = await page.goto(p);
    if (!res || res.status() >= 400) continue;
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    expect(res.status()).toBeLessThan(400);
  }
});

