import { test, expect } from '../../fixtures/base.fixture';

/**
 * Inventory / Product Catalogue Tests
 *
 * storageState is loaded at the project level, so all tests here
 * begin already authenticated as standard_user.
 */
test.describe('Inventory — Product Catalogue', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('inventory page displays 6 products', async ({ inventoryPage }) => {
    await expect(inventoryPage.productItems).toHaveCount(6);
  });

  test('products can be sorted by name A→Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('products can be sorted by name Z→A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('products can be sorted by price low→high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('products can be sorted by price high→low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('adding a product updates the cart badge', async ({ inventoryPage, headerPage }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    expect(await headerPage.getCartCount()).toBe(1);
  });

  test('removing a product clears the cart badge', async ({ inventoryPage, headerPage }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack');
    expect(await headerPage.getCartCount()).toBe(0);
  });

  test('product detail page opens from inventory', async ({ inventoryPage, page }) => {
    await inventoryPage.openProductDetail('Sauce Labs Backpack');
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toContainText('Sauce Labs Backpack');
  });
});
