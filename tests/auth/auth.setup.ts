import { test as setup, expect } from '@playwright/test';
import { USERS } from '../../data/users';
import path from 'path';

/**
 * Auth Setup — runs once before the main test projects.
 *
 * Logs in as standard_user and persists cookies + localStorage to
 * `.auth/standard_user.json`. The Chromium and Firefox projects load
 * this file via `storageState`, skipping the login UI in every test.
 *
 * Credentials are pulled from `data/users.ts` — the single source of truth.
 */

const AUTH_FILE = path.join(__dirname, '../../.auth/standard_user.json');

setup('authenticate as standard_user', async ({ page }) => {
  // 1. Navigate to the login page
  await page.goto('/');

  // 2. Log in using the centralised credential constants
  await page.locator('[data-test="username"]').fill(USERS.standard.username);
  await page.locator('[data-test="password"]').fill(USERS.standard.password);
  await page.locator('[data-test="login-button"]').click();

  // 3. Assert login succeeded before saving state
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.app_logo')).toBeVisible();

  // 4. Persist auth state for downstream projects
  await page.context().storageState({ path: AUTH_FILE });
});