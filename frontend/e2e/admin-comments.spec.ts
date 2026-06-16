// e2e/admin-comments.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Comments Page', () => {
  test('should redirect to home when not authenticated', async ({ page }) => {
    await page.goto('/admin/comments');
    await expect(page).toHaveURL('/');
  });

  test('should display page title when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/comments');
    await expect(page.locator('text=评论管理')).toBeVisible();
  });

  test('should display filter controls when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/comments');
    const searchInput = page.getByPlaceholder('搜索昵称、邮箱或内容');
    await expect(searchInput).toBeVisible();
  });

  test('should display table structure when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/comments');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.ant-card')).toBeVisible();
  });
});