import { test, expect } from '../../fixtures/base.fixture';

/**
 * Cart Tests
 *
 * All tests start authenticated (storageState) and navigate to
 * the inventory page to seed items into the cart before asserting
 * cart behaviour.
 *
 * Test isolation: each test adds only what it needs and operates on
 * a fresh browser context, so there is no shared cart state between tests.
 */
test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('item added from inventory appears in cart', async ({
    inventoryPage,
    cartPage,
    headerPage,
  }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await headerPage.goToCart();

    const names = await cartPage.getItemNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  test('cart badge count matches number of items added', async ({
    inventoryPage,
    headerPage,
  }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    expect(await headerPage.getCartCount()).toBe(2);
  });

  test('removing an item from the cart decrements the count', async ({
    inventoryPage,
    cartPage,
    headerPage,
  }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    await headerPage.goToCart();

    await cartPage.removeItemByName('Sauce Labs Backpack');

    expect(await cartPage.getItemCount()).toBe(1);
    expect(await headerPage.getCartCount()).toBe(1);
  });

  test('cart is empty after removing all items', async ({
    inventoryPage,
    cartPage,
    headerPage,
  }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await headerPage.goToCart();
    await cartPage.removeItemByName('Sauce Labs Backpack');

    expect(await cartPage.getItemCount()).toBe(0);
    expect(await headerPage.getCartCount()).toBe(0);
  });
});
