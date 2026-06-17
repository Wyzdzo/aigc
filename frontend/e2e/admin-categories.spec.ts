// e2e/admin-categories.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Categories Page', () => {
  test('should redirect to home when not authenticated', async ({ page }) => {
    await page.goto('/admin/categories');
    await expect(page).toHaveURL('/');
  });

  test('should display categories page when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/categories');
    await expect(page.locator('text=分类管理')).toBeVisible();
  });

  test('should render add and refresh buttons', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=新增分类')).toBeVisible();
    await expect(page.locator('text=刷新')).toBeVisible();
  });

  test('should render empty state when no categories', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=暂无分类')).toBeVisible();
  });
});
