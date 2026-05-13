import { type Page, type Locator } from '@playwright/test';

export type SortOption =
  | 'az'   // Name (A to Z)
  | 'za'   // Name (Z to A)
  | 'lohi' // Price (low to high)
  | 'hilo'; // Price (high to low)

/**
 * InventoryPage — Page Object Model
 *
 * Covers /inventory.html: product grid, sort control, and add-to-cart buttons.
 */
export class InventoryPage {
  readonly page: Page;

  readonly sortDropdown: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown  = page.locator('[data-test="product-sort-container"]');
    this.productItems  = page.locator('.inventory_item');
    this.productNames  = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  /** Navigate directly to the inventory page */
  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  /** Select a sort option from the dropdown */
  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /** Returns all visible product name strings */
  async getProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  /**
   * Returns all visible product prices as numbers.
   * SauceDemo renders prices as "$9.99" — we strip the leading "$".
   */
  async getProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  /** Add a product to the cart by its display name */
  async addToCartByName(productName: string): Promise<void> {
    const item = this.page.locator('.inventory_item', {
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    await item.locator('button[data-test^="add-to-cart"]').click();
  }

  /** Remove a product from the cart by its display name (when already added) */
  async removeFromCartByName(productName: string): Promise<void> {
    const item = this.page.locator('.inventory_item', {
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    await item.locator('button[data-test^="remove"]').click();
  }

  /** Open the product detail page for a given product name */
  async openProductDetail(productName: string): Promise<void> {
    await this.productNames.filter({ hasText: productName }).click();
  }
}
