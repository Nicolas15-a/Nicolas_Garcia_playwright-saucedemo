import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { HeaderPage } from '../pages/header.page';

/**
 * Custom fixture type — each property is a pre-constructed Page Object.
 *
 * Why a fixture instead of constructing POMs inline in each test?
 * 1. DRY — no boilerplate `new LoginPage(page)` repeated in every file.
 * 2. Scope — `{ scope: 'test' }` guarantees each test gets a fresh POM
 *    instance tied to its own page, preventing state bleed between tests.
 * 3. Composable — additional fixtures (e.g. seeded cart state) can extend
 *    this base set without touching existing tests.
 */
export type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  headerPage: HeaderPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  headerPage: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },
});

export { expect } from '@playwright/test';
