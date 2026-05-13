import { test, expect } from '../../fixtures/base.fixture';
import { USERS } from '../../data/users';

/**
 * Lead / Senior — performance_glitch_user spec
 *
 * Uses a fresh browser state (no pre-authenticated storageState) so that the
 * full login + page-load cycle is measured exactly as a real user would
 * experience it.
 *
 * ─── Why 10 000 ms as the inventory-load threshold? ───────────────────────
 *
 * SauceDemo's performance_glitch_user introduces intentional delays during
 * login and inventory loading as part of its training/testing behavior.
 *
 * In production we would normally derive this threshold from historical
 * p95 metrics plus an additional safety margin. Since no historical
 * baseline exists for this exercise, the threshold is estimated from
 * first principles:
 *
 *   Expected artificial delay                  ~5 000 ms
 *   Network + browser rendering variability    ~2 000 ms
 *   Additional CI safety margin                ~3 000 ms
 *   ─────────────────────────────────────────────────────
 *   Total acceptable threshold                 10 000 ms
 *
 * A page that does not become interactive within 10 seconds is treated as
 * a genuine performance regression rather than an accepted characteristic.
 * ──────────────────────────────────────────────────────────────────────────
 */

/** Maximum acceptable time (ms) from login submit → inventory visible. */
const INVENTORY_LOAD_THRESHOLD_MS = 10_000;

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Lead — performance_glitch_user', () => {
  // automatically capture a screenshot when the test fails.
  // Useful in CI environments to diagnose whether the timeout was caused by
  // network instability, rendering delays, or a more severe application glitch.
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot();

      await testInfo.attach('failure-screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
    }
  });

  test(
    'inventory page loads and is usable within acceptable threshold after login',
    async ({ loginPage, inventoryPage, page }) => {
      await loginPage.goto();

      await loginPage.login(
        USERS.performanceGlitch.username,
        USERS.performanceGlitch.password,
      );

      // ✅ 1: measure ONLY the post-login wait time, excluding goto().
      // performance.now() provides sub-millisecond precision, whereas Date.now()
      // has 1 ms granularity and may include unrelated pre-login execution time.
      const loginSubmitTime = performance.now();

      await page.locator('.inventory_list').waitFor({
        state: 'visible',
        timeout: INVENTORY_LOAD_THRESHOLD_MS,
      });

      const loadTimeMs = Math.round(performance.now() - loginSubmitTime);

      // ✅ 2: attach the measured load time as a test annotation.
      // This appears in Playwright HTML reports and CI outputs without relying
      // solely on console logs.
      test.info().annotations.push({
        type: 'perf',
        description: `Inventory load time: ${loadTimeMs} ms (threshold: ${INVENTORY_LOAD_THRESHOLD_MS} ms)`,
      });

      // Store the metric as a CI artifact as well:
      await test.info().attach('load-time', {
        body: Buffer.from(`${loadTimeMs}`),
        contentType: 'text/plain',
      });

      // ── Assertions ────────────────────────────────────────────────────────

      // URL guard: confirms that the post-login redirect completed successfully.
      await expect(page).toHaveURL(/inventory\.html/);

      // Performance assertion: measured load time must remain below the threshold.
      // If it fails, the assertion message includes the actual measured value
      // for immediate troubleshooting.
      expect(
        loadTimeMs,
        `Inventory load time ${loadTimeMs} ms exceeded threshold of ${INVENTORY_LOAD_THRESHOLD_MS} ms`,
      ).toBeLessThan(INVENTORY_LOAD_THRESHOLD_MS);

      // ✅ 3: post-load usability assertion.
      // Confirms that not only the container rendered, but also that
      // the products are present and the user can interact with them.
      const inventoryItems = page.locator('.inventory_item');

      // SauceDemo consistently displays 6 products
      await expect(inventoryItems).toHaveCount(6);

      // Verify that the first item is actually clickable
      // (not frozen, detached, or visually hidden):
      await inventoryItems.first().locator('.inventory_item_name').click();

      await expect(page).toHaveURL(/inventory-item\.html/);
    },
  );
});