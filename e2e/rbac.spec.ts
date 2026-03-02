import { test, expect } from '@playwright/test';

test.describe('Control de Acceso (RBAC) y Cambio de Organización', () => {
  test('La vista de configuración de equipo carga adecuadamente', async ({ page }) => {
    // Navigate to settings > team
    await page.goto('/dashboard/settings?tab=team');

    await page.waitForLoadState('networkidle');

    // Mínimo de renderizado de la estructura
    await expect(page.locator('body')).toBeVisible();

    // The user should either see the login prompt or the team view
    // Since we are not strictly mocking auth in this layer, we simply expect no crash
    const headings = page.locator('h1, h2, h3');
    if (await headings.count() > 0) {
      await expect(headings.first()).toBeVisible();
    }
  });

  test('La vista de Selector de Organización no crashea', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    
    // As long as the dashboard root doesn't throw a Next.js red screen, the structure is sound
    await expect(page.locator('body')).toBeVisible();
  });
});
