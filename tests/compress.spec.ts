import { test, expect } from "@playwright/test";
import { makeSamplePdf } from "./helpers/makeSamplePdf";

test("Compress shows Download button and file details", async ({ page }) => {
  await page.goto("/cv/compress");
  const file = await makeSamplePdf("My ATS CV");
  await page.setInputFiles('input[type="file"]', file);
  await expect(page.locator("progress")).toBeVisible();
  await expect(page.locator("progress")).toBeHidden({ timeout: 20000 });
  await expect(page.getByRole("heading", { name: "Result" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download" })).toBeVisible();
});
