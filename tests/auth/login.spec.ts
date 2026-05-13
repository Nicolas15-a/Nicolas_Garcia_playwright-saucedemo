import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

/**
 * Auth / Login Tests
 *
 * These tests exercise the login form directly, so they intentionally do NOT
 * use the saved storageState. We use the base Playwright `test` (not our
 * custom fixture) and navigate to '/' manually so the browser starts unauthenticated.
 *
 * Test isolation: each test gets a fresh browser context from Playwright.
 * No shared state between specs.
 */

// We override storageState to an empty object so these tests always start
// on the login page, regardless of the project-level storageState config.
const test = base.extend({});

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login — Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard_user can log in and reach inventory page', async ({ page }) => {
    await loginPage.loginAsStandardUser();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('locked_out_user sees an error message', async () => {
    await loginPage.loginAsLockedUser();
    const error = await loginPage.getErrorText();
    expect(error).toContain('locked out');
  });

  test('wrong password shows an error message', async () => {
    await loginPage.login('standard_user', 'wrong_password');
    const error = await loginPage.getErrorText();
    expect(error).toMatch(/username and password do not match/i);
  });

  test('empty credentials shows a validation error', async () => {
    await loginPage.login('', '');
    const error = await loginPage.getErrorText();
    expect(error).toMatch(/username is required/i);
  });
});
