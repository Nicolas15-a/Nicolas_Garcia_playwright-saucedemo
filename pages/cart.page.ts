import { type Page, type Locator } from '@playwright/test';

/**
 * CartPage — Page Object Model
 *
 * Covers /cart.html: item list, quantities, remove buttons, and navigation.
 */
export class CartPage {
  readonly page: Page;

  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems             = page.locator('.cart_item');
    this.cartItemNames         = page.locator('.inventory_item_name');
    this.checkoutButton        = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /** Navigate directly to the cart page */
  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  /** Returns the number of items currently in the cart list */
  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /** Returns all item name strings visible in the cart */
  async getItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  /** Remove an item from the cart by its display name */
  async removeItemByName(itemName: string): Promise<void> {
    const item = this.page.locator('.cart_item', {
      has: this.page.locator('.inventory_item_name', { hasText: itemName }),
    });
    await item.locator('button[data-test^="remove"]').click();
  }

  /** Proceed to checkout */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
