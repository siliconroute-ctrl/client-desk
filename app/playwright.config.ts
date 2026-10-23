import { defineConfig, devices } from '@playwright/test';

// Set PW_CHROMIUM_PATH to use a preinstalled Chromium instead of Playwright's download.
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: { executablePath },
  },
  projects: [
    { name: 'phone-light', use: { ...devices['Pixel 7'], viewport: { width: 400, height: 860 }, colorScheme: 'light', browserName: 'chromium' } },
    { name: 'phone-dark', use: { ...devices['Pixel 7'], viewport: { width: 400, height: 860 }, colorScheme: 'dark', browserName: 'chromium' } },
    { name: 'desktop-light', use: { viewport: { width: 1280, height: 900 }, colorScheme: 'light', browserName: 'chromium' } },
    { name: 'desktop-dark', use: { viewport: { width: 1280, height: 900 }, colorScheme: 'dark', browserName: 'chromium' } },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
