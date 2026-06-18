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

  test('should perform search with keyword', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/comments');
    const searchInput = page.getByPlaceholder('搜索昵称、邮箱或内容');
    await searchInput.fill('测试');
    await searchInput.press('Enter');
    await page.waitForLoadState('networkidle');
    // 验证搜索输入框的值
    await expect(searchInput).toHaveValue('测试');
  });

  test('should toggle status filter', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/comments');
    const statusFilter = page.locator('.ant-select').first();
    await statusFilter.click();
    await page.waitForLoadState('networkidle');
    // 验证下拉菜单已打开
    await expect(page.locator('.ant-select-dropdown')).toBeVisible();
    await statusFilter.click();
    // 验证下拉菜单已关闭
    await expect(page.locator('.ant-select-dropdown')).not.toBeVisible();
  });

  test('should handle refresh action', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/comments');
    const refreshButton = page.locator('text=刷新');
    await refreshButton.click();
    await page.waitForLoadState('networkidle');
    // 验证页面仍然显示
    await expect(page.locator('text=评论管理')).toBeVisible();
  });
});