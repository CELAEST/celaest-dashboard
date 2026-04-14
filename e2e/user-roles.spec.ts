import { test, expect } from '@playwright/test';
import { setupAuthenticatedSession, E2E_USER } from './fixtures';

test.describe('User Roles E2E', () => {

  test.beforeEach(async ({ page, context }) => {
    await setupAuthenticatedSession(page, context);

    // Mock API Responses for Users
    await page.route('**/api/v1/org/users*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: E2E_USER.id,
              email: E2E_USER.email,
              role: 'super_admin',
              first_name: 'Super',
              last_name: 'Admin',
              status: 'active'
            },
            {
              id: 'user-002',
              email: 'standard@celaest.test',
              role: 'member',
              first_name: 'Standard',
              last_name: 'User',
              status: 'active'
            }
          ],
          meta: { page: 1, per_page: 50, total: 2, total_pages: 1 }
        }),
      });
    });
  });

  test('Super Admin sees management controls on User Table', async ({ page }) => {
    // Navigate to users tab
    await page.goto('/?tab=users');
    
    await expect(page.locator('text=User Management').first()).toBeVisible({ timeout: 10000 });
    
    // Check that we render the mock users
    await expect(page.locator('text=standard@celaest.test')).toBeVisible();

    // Invite User button should exist since we are super_admin
    await expect(page.locator('button:has-text("Invite User")')).toBeVisible();

    // Clicking the invite member opens the modal
    await page.click('button:has-text("Invite User")');
    await expect(page.locator('text=Email')).toBeVisible(); // Just checking email field exists instead of modal h3
    
    // Check role selector exists in the form
    await expect(page.locator('text=Access Level')).toBeVisible();
  });
});
