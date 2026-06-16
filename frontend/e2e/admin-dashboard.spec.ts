// e2e/admin-dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Page', () => {
  test('should redirect to home when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/');
  });

  test('should not redirect when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');
  });

  test('should display page content when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });
});