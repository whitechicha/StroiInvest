import { defineConfig } from '@playwright/test'
const external = process.env.PLAYWRIGHT_BASE_URL
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 2,
  reporter: 'list',
  use: {
    baseURL: external || 'http://127.0.0.1:4310',
    channel: process.platform === 'win32' ? 'msedge' : undefined,
    trace: 'retain-on-failure',
  },
  webServer: external
    ? undefined
    : {
        command: 'npm run dev -- --host 127.0.0.1 --port 4310',
        url: 'http://127.0.0.1:4310',
        timeout: 120000,
        reuseExistingServer: false,
      },
})
