/**
 * Shared E2E test fixtures for CELAEST Dashboard.
 *
 * Provides:
 *   - Common auth/org/profile mocks (avoids duplication across specs)
 *   - Auth session injection via localStorage + cookies
 *   - Catch-all API route mock to prevent 401 cascades
 *
 * Usage:
 *   import { setupAuthenticatedSession } from './fixtures';
 *   test.beforeEach(async ({ page, context }) => {
 *     await setupAuthenticatedSession(page, context);
 *   });
 */

import { Page, BrowserContext } from '@playwright/test';

/** Standard mock user. */
export const MOCK_USER = {
  id: "user-e2e-001",
  email: "e2e@celaest.dev",
  role: "owner",
};

/** Standard mock organization. */
export const MOCK_ORG = {
  id: "org-e2e-001",
  slug: "celaest-e2e",
  name: "CELAEST E2E",
  role: "owner",
  is_default: true,
  is_system_default: true,
};

/**
 * Sets up a fully authenticated session with API mocks.
 * Call this in `test.beforeEach` to bypass auth and prevent 401 cascades.
 */
export async function setupAuthenticatedSession(page: Page, context: BrowserContext) {
  // 0. Catch-all: prevent ANY unmatched API call from returning 401
  await page.route('**/api/v1/**', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ status: "success", data: [] }),
  }));

  // 1. Bypass SSR middleware
  await context.addCookies([
    { name: 'playwright-bypass', value: 'true', domain: '127.0.0.1', path: '/' },
  ]);

  // 2. Mock auth verification
  await page.route('**/api/v1/auth/me', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ status: "success", data: MOCK_USER }),
  }));

  // 3. Mock organizations
  await page.route('**/api/v1/org/organizations*', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      status: "success",
      data: { organizations: [MOCK_ORG] },
    }),
  }));

  // 4. Mock user profile
  await page.route('**/api/v1/user/profile*', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ status: "success", data: MOCK_USER }),
  }));

  // 5. Inject auth state into localStorage (Zustand hydration)
  await page.addInitScript(() => {
    localStorage.setItem('celaest-auth-storage', JSON.stringify({
      state: {
        isAuthenticated: true,
        user: { id: 'user-e2e-001', email: 'e2e@celaest.dev', role: 'owner' },
      },
    }));
    localStorage.setItem('celaest-org-storage', JSON.stringify({
      state: {
        currentOrg: {
          id: 'org-e2e-001',
          slug: 'celaest-e2e',
          name: 'CELAEST E2E',
          role: 'owner',
          is_default: true,
        },
      },
    }));
  });
}
