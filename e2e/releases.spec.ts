import { test, expect } from '@playwright/test';
import { setupAuthenticatedSession, E2E_USER } from './fixtures';

test.describe('Releases Manager E2E', () => {

  test.beforeEach(async ({ page, context }) => {
    await setupAuthenticatedSession(page, context);

    // Mock API Responses for Releases (actual endpoint: /api/v1/org/releases)
    await page.route('**/api/v1/org/releases*', async route => {
      // Only intercept GET requests for listing
      if (route.request().method() !== 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            data: [
              {
                id: 'rel-preview-123',
                product_id: 'prod-001',
                product_name: 'CELAEST Enterprise App',
                version: 'v2.0.1-preview',
                status: 'beta',
                released_at: new Date().toISOString(),
                file_size_bytes: 4096000,
                file_hash: 'abcdef123456',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 'rel-stable-123',
                product_id: 'prod-001',
                product_name: 'CELAEST Enterprise App',
                version: 'v2.0.0',
                status: 'stable',
                released_at: new Date().toISOString(),
                file_size_bytes: 4096000,
                file_hash: 'abcdef123456',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            ],
            total: 2,
            page: 1
          }
        }),
      });
    });

    await page.route('**/api/v1/org/products*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            { id: 'prod-001', name: 'CELAEST Enterprise App', slug: 'celaest-enterprise', product_type: 'software', status: 'active', base_price: 0, currency: 'USD', is_featured: false, is_public: true, download_count: 0, purchase_count: 0, rating_avg: 0, rating_count: 0, min_plan_tier: 0, organization_id: 'e2e-org-001', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          ],
          meta: { total: 1, page: 1, per_page: 20, total_pages: 1 }
        }),
      });
    });
  });

  test('Renders Release Manager with correct data', async ({ page }) => {
    // Note: Assuming we navigate directly or click the Nav item
    await page.goto('/?tab=releases');
    
    // Fallback if the route is /releases
    // await page.goto('/releases');
    
    // We should see "Release Management" heading from PageBanner
    await expect(page.locator('text=Release Management').first()).toBeVisible({ timeout: 10000 });
    
    // We should see our mocked pipeline statuses
    await expect(page.locator('text=v2.0.1-preview')).toBeVisible();
    await expect(page.locator('text=v2.0.0')).toBeVisible();
    
    // Check Status Badge exists
    await expect(page.locator('text=beta').first()).toBeVisible();
    await expect(page.locator('text=stable').first()).toBeVisible();
  });

  test('Opens New Release Form', async ({ page }) => {
    await page.goto('/?tab=releases');
    
    // Admin View has a 'New Release' button with 'Plus' icon
    const newReleaseBtn = page.locator('button:has-text("New Release")');
    await expect(newReleaseBtn).toBeVisible();
    await newReleaseBtn.click();
    
    // Form should pop open
    await expect(page.locator('h2:has-text("Publish New Release")')).toBeVisible();
    await expect(page.locator('text="Target Asset *"')).toBeVisible();
  });
});
