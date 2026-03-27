import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './Tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',

  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      slowMo: 300,
    },
    navigationTimeout: 60000,
    actionTimeout: 60000,
    trace: 'on-first-retry',
  },

  timeout: 300000, // 2 min per test to handle 5 concurrent URLs per batch

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});