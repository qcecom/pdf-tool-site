import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load env for E2E base URL if provided via preview:start script
if (fs.existsSync('.env.e2e.local')) {
  dotenv.config({ path: '.env.e2e.local' });
}

const E2E_BASE = process.env.E2E_BASE || 'http://localhost:4173';
const reportDir = process.env.E2E_REPORT_DIR || path.join('e2e', '.reports', 'local');

export default defineConfig({
  testDir: path.join(__dirname, 'e2e/tests'),
  retries: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: reportDir }]
  ],
  use: {
    baseURL: E2E_BASE,
    acceptDownloads: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    downloadsPath: path.join(__dirname, 'e2e/.artifacts')
  },
  timeout: 60_000,
  workers: 1,
  expect: {
    timeout: 10_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});

