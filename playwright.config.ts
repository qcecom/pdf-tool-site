import { defineConfig } from '@playwright/test';

const lite = process.env.SMOKE_MODE === 'lite';

export default defineConfig({
  testDir: 'tests',
  testMatch: /.*\.spec\.ts/,
  reporter: [['list']],
  forbidOnly: true,
  timeout: 30_000,
  ...(lite
    ? {
        // Lite mode: no real browsers required; unit-style tests only
        projects: [{ name: 'lite' }],
        workers: 1,
        retries: 0
      }
    : {
        // Full mode: real browsers (installed via postinstall)
        use: { headless: true }
      })
});
