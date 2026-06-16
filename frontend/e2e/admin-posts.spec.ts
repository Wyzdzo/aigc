// e2e/admin-posts.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Posts Page', () => {
  test('should redirect to home when not authenticated', async ({ page }) => {
    await page.goto('/admin/posts');
    await expect(page).toHaveURL('/');
  });

  test('should display page title when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts');
    await expect(page.locator('text=文章管理')).toBeVisible();
  });

  test('should display search input when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts');
    const searchInput = page.getByPlaceholder('搜索标题');
    await expect(searchInput).toBeVisible();
  });

  test('should display page content when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.ant-card').first()).toBeVisible();
  });

  test('should perform search with keyword', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts');
    const searchInput = page.getByPlaceholder('搜索标题');
    await searchInput.fill('测试');
    await searchInput.press('Enter');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.ant-card').first()).toBeVisible();
  });

  test('should display status filter dropdown', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts');
    const statusFilter = page.locator('.ant-select');
    await expect(statusFilter.first()).toBeVisible();
  });
});
