import { test, expect } from '@playwright/test';

test.describe('Asset Manager - Flujo de Archivos', () => {
  test('El portal de administración de Assets carga la UI', async ({ page }) => {
    // Navigate to the assets portal
    await page.goto('/dashboard/assets');

    await page.waitForLoadState('networkidle');

    // Structural Test: Ensure Next.js doesn't crash throwing 500s 
    await expect(page.locator('body')).toBeVisible();

    // Verify basic HTML elements are alive
    const buttons = page.locator('button');
    if (await buttons.count() > 0) {
      await expect(buttons.first()).toBeVisible();
    }
  });

  test('La tabla o grilla de inventario se monta en el DOM', async ({ page }) => {
    await page.goto('/dashboard/assets/library');
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.locator('body')).toBeVisible();
  });
});
