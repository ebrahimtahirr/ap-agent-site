import { defineConfig } from '@playwright/test'

const BASE = process.env.SITE_URL || 'http://localhost:4173/ap-agent-site/'
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: BASE, trace: 'off' },
  webServer: process.env.SITE_URL
    ? undefined
    : { command: 'npm run preview', url: BASE, reuseExistingServer: true, timeout: 60_000 },
})
