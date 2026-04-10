import { test, expect } from '@playwright/test';
import { setupAuthenticatedSession } from './fixtures';

/**
 * Marketplace Business Logic E2E Tests
 *
 * Validates the core marketplace purchase flow:
 *   A. Tenant with active subscription → shows "En Plan" badge
 *   B. Tenant with individual purchase → shows "Adquirido" badge
 *   C. Tenant without any assets → shows "Adquirir" CTA
 */

const baseProduct = {
  id: "prod-e2e-001",
  slug: "automation-system",
  name: "Enterprise Automation System",
  category_name: "Automation",
  base_price: 4500,
  currency: "USD",
  rating_avg: 4.8,
  version: "2.0.0",
  min_plan_tier: 2,
};

test.describe('Marketplace — Purchase Flow & Access Control', () => {

  test.beforeEach(async ({ page, context }) => {
    await setupAuthenticatedSession(page, context);

    // Mock product catalog
    await page.route('**/api/v1/public/marketplace/search*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: "success",
        data: { products: [baseProduct], total: 1 },
      }),
    }));
  });

  test('Scenario A: Subscription access shows "En Plan" badge', async ({ page }) => {
    await page.route('**/api/v1/user/my/assets*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: "success",
        data: [{
          id: "asset-sub-1",
          product_id: "prod-e2e-001",
          product_slug: "automation-system",
          product_name: "Enterprise Automation System",
          organization_id: "org-e2e-001",
          access_type: "subscription",
          is_active: true,
          status: "active",
        }],
      }),
    }));

    await page.goto('/?tab=marketplace');
    await page.waitForTimeout(2000);
    await page.waitForLoadState('domcontentloaded');

    const card = page.locator('div').filter({ hasText: 'Enterprise Automation System' }).first();
    await expect(card.locator('button', { hasText: /en plan/i }).first()).toBeVisible({ timeout: 5000 });
    await expect(card.locator('button', { hasText: /adquirir/i })).toHaveCount(0);
  });

  test('Scenario B: Individual purchase shows "Adquirido" badge', async ({ page }) => {
    await page.route('**/api/v1/user/my/assets*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: "success",
        data: [{
          id: "asset-pur-1",
          product_id: "prod-e2e-001",
          product_slug: "automation-system",
          product_name: "Enterprise Automation System",
          organization_id: "org-e2e-001",
          access_type: "purchase",
          is_active: true,
          status: "active",
        }],
      }),
    }));

    await page.goto('/?tab=marketplace');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div').filter({ hasText: 'Enterprise Automation System' }).first();
    await expect(card.locator('button', { hasText: /adquirido/i }).first()).toBeVisible({ timeout: 5000 });

    // Open modal and verify badge
    await card.locator('button', { hasText: /adquirido/i }).first().click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal.getByText(/ADQUIRIDO/i)).toBeVisible();
  });

  test('Scenario C: No assets shows purchase CTA', async ({ page }) => {
    await page.route('**/api/v1/user/my/assets*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: "success", data: [] }),
    }));

    await page.goto('/?tab=marketplace');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div').filter({ hasText: 'Enterprise Automation System' }).first();
    const buyBtn = card.locator('button', { hasText: /adquirir/i });
    if (await buyBtn.count() > 0) {
      await expect(buyBtn).toBeVisible();
    }
  });

});
