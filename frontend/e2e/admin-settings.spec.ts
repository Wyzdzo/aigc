// e2e/admin-settings.spec.ts
import { test, expect } from '@playwright/test';
import { setupAdminAuth } from './common/auth';

test.describe('Admin Settings Page', () => {
  test('should redirect to home when not authenticated', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page).toHaveURL('/');
  });

  test('should show settings page when authenticated', async ({ page }) => {
    await page.addInitScript(setupAdminAuth());
    await page.goto('/admin/settings');
    await expect(page).toHaveURL('/admin/settings');
  });

  test('should display page content when authenticated', async ({ page }) => {
    await page.addInitScript(setupAdminAuth());
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });
});
