import { test, expect } from '../../fixtures/base.fixture';

/**
 * Checkout Tests
 *
 * Covers the 3-step flow: cart → customer info → order summary → confirmation.
 * Each test seeds its own cart to remain independent.
 */
test.describe('Checkout — 3-step flow', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    // Seed one item in the cart before each checkout test
    await inventoryPage.goto();
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
  });

  test('happy path: completes checkout and shows confirmation', async ({
    headerPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await headerPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.completeCheckout('Jane', 'Doe', '10001');

    await expect(page).toHaveURL(/checkout-complete\.html/);
    const header = await checkoutPage.getConfirmationHeader();
    expect(header).toMatch(/thank you/i);
  });

  test('step 1 shows error when first name is missing', async ({
    headerPage,
    cartPage,
    checkoutPage,
  }) => {
    await headerPage.goToCart();
    await cartPage.proceedToCheckout();

    // Submit with empty first name
    await checkoutPage.fillCustomerInfo('', 'Doe', '10001');

    const error = await checkoutPage.errorMessage.textContent();
    expect(error).toMatch(/first name is required/i);
  });

  test('step 1 shows error when last name is missing', async ({
    headerPage,
    cartPage,
    checkoutPage,
  }) => {
    await headerPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInfo('Jane', '', '10001');

    const error = await checkoutPage.errorMessage.textContent();
    expect(error).toMatch(/last name is required/i);
  });

  test('step 1 shows error when zip code is missing', async ({
    headerPage,
    cartPage,
    checkoutPage,
  }) => {
    await headerPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInfo('Jane', 'Doe', '');

    const error = await checkoutPage.errorMessage.textContent();
    expect(error).toMatch(/postal code is required/i);
  });

  test('order summary lists the item added to cart', async ({
    headerPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await headerPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo('Jane', 'Doe', '10001');

    // We are now on step 2 — verify item is listed
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    const itemNames = await page.locator('.inventory_item_name').allTextContents();
    expect(itemNames).toContain('Sauce Labs Backpack');
  });
});
