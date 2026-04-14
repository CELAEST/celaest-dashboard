/**
 * Shared E2E test fixtures for CELAEST Dashboard.
 *
 * Strategy: Inject auth state directly via cookies + localStorage + sessionStorage.
 * This uses the app's built-in E2E bypass mechanisms:
 *   1. middleware.ts: `playwright-bypass` cookie skips server-side auth
 *   2. useAuthSession.ts: `playwright-token` in sessionStorage prevents Supabase
 *      from overwriting Zustand state
 *
 * This approach is:
 *   - Fast (~200ms vs ~15s for UI login)
 *   - Deterministic (no Supabase network dependency)
 *   - Parallelizable (no shared auth session contention)
 */

import { Page, BrowserContext } from '@playwright/test';

/** Synthetic E2E user matching the superadmin seed. */
export const E2E_USER = {
  id: 'e2e-superadmin-001',
  email: 'superadmin@celaest.test',
  name: 'superadmin',
  role: 'super_admin',
  permissions: [
    'users:read', 'users:write', 'users:delete',
    'billing:read', 'billing:write',
    'products:read', 'products:write', 'products:delete',
    'orders:read', 'orders:write',
    'settings:read', 'settings:write',
    'analytics:read',
    'licensing:read', 'licensing:write',
  ],
  emailVerified: true,
  createdAt: '2026-01-01T00:00:00Z',
  lastSignInAt: new Date().toISOString(),
};

/** Synthetic E2E organization. */
export const E2E_ORG = {
  id: 'e2e-org-001',
  slug: 'celaest-e2e',
  name: 'CELAEST E2E',
  role: 'owner',
  is_default: true,
  is_system_default: true,
};

/** Fake access token for E2E (never hits a real API). */
const E2E_TOKEN = 'e2e-playwright-token-superadmin';

/**
 * Injects a fully authenticated session into the browser context.
 * No UI interaction needed — instant and deterministic.
 */
export async function setupAuthenticatedSession(page: Page, _context: BrowserContext) {
  // 1. Install hydration error detector (still useful for catching React issues)
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().includes('Hydration failed')) {
      console.error(`🚨 HYDRATION ERROR DETECTED: ${msg.text()}`);
      throw new Error(`Critical hydration error in production: ${msg.text()}`);
    }
  });

  // 2. Inject auth state BEFORE navigating (addInitScript runs before any page JS)
  await page.addInitScript(({ user, token, org }) => {
    // 2a. Set the playwright-token so useAuthSession skips Supabase initialization
    window.sessionStorage.setItem('playwright-token', token);

    // 2b. Hydrate the Zustand persisted auth store in localStorage
    const authState = {
      state: {
        user: user,
        isAuthenticated: true,
      },
      version: 0,
    };
    window.localStorage.setItem('celaest-auth-storage', JSON.stringify(authState));

    // 2c. Hydrate the Zustand org store to prevent fetchOrgs blocking
    const orgState = {
      state: {
        currentOrg: org,
      },
      version: 0,
    };
    window.localStorage.setItem('celaest-org-storage', JSON.stringify(orgState));
  }, { user: E2E_USER, token: E2E_TOKEN, org: E2E_ORG });

  // 3. Set the middleware bypass cookie so server-side auth doesn't redirect
  await page.context().addCookies([{
    name: 'playwright-bypass',
    value: 'true',
    domain: '127.0.0.1',
    path: '/',
  }]);

  // 4. CATCH-ALL: Intercept ALL celaest-back API calls to prevent unmocked requests
  //    from hitting the real backend with a fake E2E token. Without this, any
  //    unmocked endpoint returns 401 → celaest:unauthorized → signOut → login redirect.
  //    Playwright routes use LIFO ordering, so specific mocks registered AFTER this
  //    one (both here and in individual spec files) will take priority.
  await page.route('**/api/v1/**', async route => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { data: [], total: 0, page: 1, total_pages: 0 } }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    }
  });

  // 5. Mock specific common endpoints with proper shaped responses.
  //    These override the catch-all above (LIFO ordering).
  await page.route('**/api/v1/user/organizations', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ organizations: [E2E_ORG] }),
    });
  });

  await page.route('**/api/v1/auth/verify', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ valid: true }),
    });
  });

  await page.route('**/api/v1/user/preferences', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ preferences: { theme: 'dark', language: 'en', timezone: 'UTC', notifications: true, raw: null } }),
    });
  });

  await page.route('**/api/v1/user/notifications', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ notifications: '{}' }),
    });
  });

  // 6. Navigate to root and verify the dashboard shell loaded
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 7. Wait for the app shell to be visible (sidebar navigation confirms auth passed)
  await page.waitForSelector('nav', { timeout: 15000 });
}
