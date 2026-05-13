import { type Page, type Locator } from '@playwright/test';

/**
 * CheckoutPage — Page Object Model
 *
 * Covers the 3-step checkout flow:
 *   Step 1  /checkout-step-one.html  → customer info form
 *   Step 2  /checkout-step-two.html  → order summary
 *   Complete /checkout-complete.html → confirmation
 */
export class CheckoutPage {
  readonly page: Page;

  // Step 1 — customer info
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step 2 — order summary
  readonly summaryItems: Locator;
  readonly summaryTotal: Locator;
  readonly finishButton: Locator;

  // Complete
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1
    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.zipCodeInput    = page.locator('[data-test="postalCode"]');
    this.continueButton  = page.locator('[data-test="continue"]');
    this.errorMessage    = page.locator('[data-test="error"]');

    // Step 2
    this.summaryItems    = page.locator('.cart_item');
    this.summaryTotal    = page.locator('.summary_total_label');
    this.finishButton    = page.locator('[data-test="finish"]');

    // Complete
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText   = page.locator('.complete-text');
  }

  /** Fill in the customer info form and advance to step 2 */
  async fillCustomerInfo(
    firstName: string,
    lastName: string,
    zip: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zip);
    await this.continueButton.click();
  }

  /** Complete the order from step 2 */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Full happy-path helper: fill info → finish order.
   * Use when a test only cares about the confirmation page, not the steps.
   */
  async completeCheckout(
    firstName = 'Test',
    lastName = 'User',
    zip = '12345',
  ): Promise<void> {
    await this.fillCustomerInfo(firstName, lastName, zip);
    await this.finishOrder();
  }

  /** Returns the total label text from the order summary, e.g. "Total: $32.39" */
  async getTotalText(): Promise<string> {
    return this.summaryTotal.textContent().then(t => t?.trim() ?? '');
  }

  /** Returns the confirmation header text */
  async getConfirmationHeader(): Promise<string> {
    return this.confirmationHeader.textContent().then(t => t?.trim() ?? '');
  }
}
