/**
 * SauceDemo User Credentials — Single Source of Truth
 *
 * All test-user data lives here so that:
 *  - No credentials are hardcoded in specs or page objects.
 *  - Adding a new user is a one-line change.
 *  - CI/CD pipelines can override via environment variables if needed.
 *
 * SauceDemo documents its users at https://www.saucedemo.com — the
 * password is the same for every account.
 */

/** Shared password for all SauceDemo accounts */
export const SAUCE_PASSWORD = 'secret_sauce';

/** Typed representation of a SauceDemo user */
export interface SauceUser {
  /** The username string entered in the login form */
  username: string;
  /** The password string entered in the login form */
  password: string;
  /** Human-readable description used in test titles / logging */
  description: string;
}

/**
 * Pre-built user objects keyed by their role.
 *
 * Usage in tests:
 * ```ts
 * import { USERS } from '../../data/users';
 * await loginPage.login(USERS.standard.username, USERS.standard.password);
 * ```
 */
export const USERS = {
  standard: {
    username: 'standard_user',
    password: SAUCE_PASSWORD,
    description: 'Fully functional account — happy-path baseline',
  },
  locked: {
    username: 'locked_out_user',
    password: SAUCE_PASSWORD,
    description: 'Always returns a "locked out" error on login',
  },
  problem: {
    username: 'problem_user',
    password: SAUCE_PASSWORD,
    description: 'Broken product images and UI glitches',
  },
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: SAUCE_PASSWORD,
    description: 'Artificial ~5 s delay on login and page loads',
  },
  error: {
    username: 'error_user',
    password: SAUCE_PASSWORD,
    description: 'Triggers runtime errors on certain actions',
  },
  visual: {
    username: 'visual_user',
    password: SAUCE_PASSWORD,
    description: 'Visual discrepancies across pages',
  },
} as const satisfies Record<string, SauceUser>;

/** Convenience type for user keys */
export type UserRole = keyof typeof USERS;
