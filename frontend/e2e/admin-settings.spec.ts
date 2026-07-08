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

  test('should show announcement field in site settings tab', async ({ page }) => {
    await page.addInitScript(setupAdminAuth());
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');

    // 确保在网站设置标签页
    await expect(page.locator('text=公告内容')).toBeVisible();
  });
});
