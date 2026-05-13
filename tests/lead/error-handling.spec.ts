import { test, expect } from '../../fixtures/base.fixture';
import { USERS } from '../../data/users';

/**
 * Lead / Senior — error_user spec
 *
 * Uses a fresh browser state (no pre-authenticated storageState) so that
 * the login and full checkout flow are exercised from scratch.
 *
 * ─── What does error_user break? ───────────────────────────────────────
 *
 * SauceDemo's error_user deliberately injects runtime JavaScript errors
 * into specific user interactions. The observed behaviour is:
 *
 *   1. The checkout Last Name field does NOT retain its value.
 *      Playwright's `fill()` sets the value, but the app's error-injection
 *      clears it before the form is submitted.
 *
 *   2. Despite the empty Last Name, the form advances to Step 2
 *      (checkout-step-two.html) — bypassing standard validation.
 *
 *   3. The Finish button on Step 2 is non-functional — clicking it
 *      does not navigate to the confirmation page.
 *
 * These tests assert the known broken behaviour so that:
 *   - We have documented evidence of the defects.
 *   - If SauceDemo ever fixes error_user, these tests will fail,
 *     signalling that the scenarios need updating — not that our
 *     suite is broken.
 * ──────────────────────────────────────────────────────────────────────
 */

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Lead — error_user checkout error handling', () => {
  /**
   * Capture a screenshot when a test fails.
   * Useful in CI to diagnose whether the failure was caused by a changed
   * error_user behaviour or an infrastructure issue.
   */
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot();

      await testInfo.attach('failure-screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
    }
  });

  test('error_user can log in and reach the inventory page', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.loginAsErrorUser();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();

    test.info().annotations.push({
      type: 'info',
      description: 'error_user login succeeds — errors are limited to checkout interactions',
    });
  });

  test('Last Name field does not retain its value during checkout', async ({
    loginPage,
    inventoryPage,
    headerPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // ── Setup: log in and seed the cart ─────────────────────────────────
    await loginPage.goto();
    await loginPage.loginAsErrorUser();
    await inventoryPage.addToCartByName('Sauce Labs Backpack');

    // ── Navigate to checkout step 1 ────────────────────────────────────
    await headerPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // ── Fill all three fields ──────────────────────────────────────────
    await checkoutPage.firstNameInput.fill('Jane');
    await checkoutPage.lastNameInput.fill('Doe');
    await checkoutPage.zipCodeInput.fill('10001');

    // ── Assert the defect: Last Name value is cleared by error_user ───
    // The field's DOM value attribute is reset by the injected error.
    const lastNameValue = await checkoutPage.lastNameInput.inputValue();

    test.info().annotations.push({
      type: 'error-user-defect',
      description: `Last Name input value after fill(): "${lastNameValue}" (expected empty due to error_user)`,
    });

    expect(
      lastNameValue,
      'error_user should clear the Last Name field value',
    ).toBe('');
  });

  test('checkout advances to step 2 despite missing Last Name (validation bypass)', async ({
    loginPage,
    inventoryPage,
    headerPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // ── Setup ──────────────────────────────────────────────────────────
    await loginPage.goto();
    await loginPage.loginAsErrorUser();
    await inventoryPage.addToCartByName('Sauce Labs Backpack');

    // ── Navigate to checkout step 1 and submit ─────────────────────────
    await headerPage.goToCart();
    await cartPage.proceedToCheckout();

    // fillCustomerInfo fills all fields and clicks Continue.
    // For error_user the Last Name will be blank, but the form still
    // advances — this IS the defect we are documenting.
    await checkoutPage.fillCustomerInfo('Jane', 'Doe', '10001');

    // ── Assert: form advanced to step 2 despite broken field ───────────
    // A correctly-functioning app would stay on step 1 and show a
    // "Last Name is required" validation error.
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    test.info().annotations.push({
      type: 'error-user-defect',
      description: 'Form advanced to step 2 with an empty Last Name — validation bypassed',
    });
  });

  test('Finish button is non-functional on step 2 (order cannot be completed)', async ({
    loginPage,
    inventoryPage,
    headerPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // ── Setup: reach step 2 ────────────────────────────────────────────
    await loginPage.goto();
    await loginPage.loginAsErrorUser();
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await headerPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo('Jane', 'Doe', '10001');
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // ── Click Finish and assert the page does NOT advance ──────────────
    await checkoutPage.finishButton.click();

    // Allow a short window for navigation (if it were to happen):
    await page.waitForTimeout(2_000);

    // The page should STILL be on step 2 — the Finish button is broken.
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Double-check we are NOT on the confirmation page:
    await expect(page.locator('.complete-header')).not.toBeVisible();

    test.info().annotations.push({
      type: 'error-user-defect',
      description: 'Finish button click did not navigate to checkout-complete — order blocked by runtime error',
    });
  });
});
