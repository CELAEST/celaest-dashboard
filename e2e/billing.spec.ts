import { test, expect } from '@playwright/test';
import { setupAuthenticatedSession } from './fixtures';

/**
 * Billing & Subscription E2E Tests
 *
 * Validates:
 *   1. Root page loads (auth redirect or dashboard)
 *   2. Billing tab renders structural elements
 */

test.describe('Billing — UI Smoke Tests', () => {

  test.beforeEach(async ({ page, context }) => {
    await setupAuthenticatedSession(page, context);
  });

  test('Root page loads and shows either auth form or dashboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();

    // Check for login form OR dashboard content
    const emailInput = page.getByPlaceholder(/email/i)
      .or(page.getByRole('textbox', { name: /email/i }));
    const dashboardContent = page.locator('button').first();

    // At least ONE of these should be visible (either auth or dashboard)
    const hasEmailInput = await emailInput.count() > 0;
    const hasDashboard = await dashboardContent.count() > 0;
    expect(hasEmailInput || hasDashboard).toBe(true);
  });

  test('Billing tab renders without crashing', async ({ page }) => {
    // Mock billing endpoints
    await page.route('**/api/v1/billing/subscriptions*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: "success", data: { subscriptions: [] } }),
    }));

    await page.route('**/api/v1/billing/invoices*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: "success", data: { invoices: [] } }),
    }));

    await page.route('**/api/v1/billing/plans*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: "success", data: { plans: [] } }),
    }));

    await page.goto('/?tab=billing');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('body')).toBeVisible();

    // No Next.js error overlay should be present
    const errorOverlay = page.locator('nextjs-portal');
    await expect(errorOverlay).toHaveCount(0);
  });
});
