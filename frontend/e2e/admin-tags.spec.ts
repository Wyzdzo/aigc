// e2e/admin-tags.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Tags Page', () => {
  test('should redirect to home when not authenticated', async ({ page }) => {
    await page.goto('/admin/tags');
    await expect(page).toHaveURL('/');
  });

  test('should display tags page when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/tags');
    await expect(page.locator('text=标签管理')).toBeVisible();
  });

  test('should render add and refresh buttons', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/tags');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=新增标签')).toBeVisible();
    await expect(page.locator('text=刷新')).toBeVisible();
  });

  test('should render empty state when no tags', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/tags');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=暂无标签')).toBeVisible();
  });
});
