import { test, expect } from "@playwright/test";
import { makeSamplePdf } from "./helpers/makeSamplePdf";

test("Compress accepts a PDF and starts processing", async ({ page }) => {
  await page.goto("/cv/compress");
  const file = await makeSamplePdf("My ATS CV");
  // Our hidden input is triggered by the visible button; target the input:
  await page.setInputFiles('input[type="file"]', file);
  await expect(page.locator("progress")).toBeVisible();
});
