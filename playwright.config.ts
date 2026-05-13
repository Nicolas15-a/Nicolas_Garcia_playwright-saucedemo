import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration — SauceDemo E2E Suite
 *
 * Timeout decisions:
 * - actionTimeout 10 000 ms : SauceDemo is a lightweight app; most actions
 *   (clicks, fills) resolve well under 5 s. We allow 10 s to cover the
 *   occasional CDN hiccup without masking genuine slowness.
 * - navigationTimeout 30 000 ms : default. Kept at 30 s because the
 *   performance_glitch_user introduces artificial delays of ~5–10 s on
 *   login; 30 s gives comfortable headroom without hiding infinite hangs.
 * - expect timeout 5 000 ms : assertion windows kept tight so flaky
 *   element waits surface quickly in CI output.
 *
 * retries: 1 in CI — one automatic retry catches transient network errors
 * in shared pipelines without masking systematic failures.
 */
export default defineConfig({
  testDir: './tests',

  /* Run all tests in parallel across workers */
  fullyParallel: true,

  /* Fail the build on CI if test.only is left in source */
  forbidOnly: !!process.env.CI,

  /* Retry once on CI to absorb transient flakiness */
  retries: process.env.CI ? 1 : 0,

  /* Use available CPU cores on CI; 2 locally to avoid hogging the machine */
  workers: process.env.CI ? undefined : 2,

  /* HTML reporter — open with: npx playwright show-report */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    /* Base URL — no trailing slash so page.goto('/inventory.html') works */
    baseURL: 'https://www.saucedemo.com',

    /* Capture screenshot only when a test fails */
    screenshot: 'only-on-failure',

    /* Short video clip on failure for deeper debugging */
    video: 'retain-on-failure',

    /* Trace on retry so CI runs always have a trace to inspect */
    trace: 'on-first-retry',

    /* Global action timeout (clicks, fills, etc.) */
    actionTimeout: 10_000,

    /* Navigation timeout */
    navigationTimeout: 30_000,
  },

  /* Output directory for test artifacts (screenshots, videos, traces) */
  outputDir: 'test-results/',

  /* Expect (assertion) timeout */
  expect: {
    timeout: 5_000,
  },

  projects: [
    /* ─── Setup project: runs once to save auth state ─────────────────── */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    /* ─── Chromium ────────────────────────────────────────────────────── */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        /* Restore the saved auth state so tests skip the login UI */
        storageState: '.auth/standard_user.json',
      },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
    },

    /* ─── Firefox ─────────────────────────────────────────────────────── */
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.auth/standard_user.json',
      },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
    },
  ],
});
