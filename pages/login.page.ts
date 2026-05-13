import { type Page, type Locator } from '@playwright/test';
import { USERS } from '../data/users';

/**
 * LoginPage — Page Object Model
 *
 * Encapsulates all selectors and interactions for the /index.html route.
 * Keeps tests free of raw selectors and makes refactoring painless.
 */
export class LoginPage {
  readonly page: Page;

  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton   = page.locator('[data-test="login-button"]');
    this.errorMessage  = page.locator('[data-test="error"]');
  }

  /** Navigate to the login page */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Fill credentials and submit the login form */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Convenience: log in with the standard (fully functional) user */
  async loginAsStandardUser(): Promise<void> {
    await this.login(USERS.standard.username, USERS.standard.password);
  }

  /** Convenience: attempt login with a locked-out account */
  async loginAsLockedUser(): Promise<void> {
    await this.login(USERS.locked.username, USERS.locked.password);
  }

  /** Convenience: log in with the error_user account */
  async loginAsErrorUser(): Promise<void> {
    await this.login(USERS.error.username, USERS.error.password);
  }

  /** Returns the visible error text (or empty string if no error shown) */
  async getErrorText(): Promise<string> {
    return this.errorMessage.textContent().then(t => t?.trim() ?? '');
  }
}
