import { type Page, type Locator } from '@playwright/test';

/**
 * HeaderPage — Page Object Model
 *
 * Shared header present on every authenticated page.
 * Provides access to the cart badge, burger menu, and logout.
 */
export class HeaderPage {
  readonly page: Page;

  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge  = page.locator('.shopping_cart_badge');
    this.cartIcon   = page.locator('.shopping_cart_link');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  /** Returns the number shown on the cart badge, or 0 if the badge is hidden */
  async getCartCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  /** Navigate to the cart page */
  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  /** Open the side navigation menu */
  async openMenu(): Promise<void> {
    await this.burgerMenu.click();
    // Wait for the menu animation to complete before interacting
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  /** Log out via the burger menu */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }
}
