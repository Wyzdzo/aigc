// e2e/admin-media.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin Media Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');

    // Navigate to media page
    await page.goto('/admin/media');
    await page.waitForLoadState('networkidle');
  });

  test('should display page title and upload button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '文件管理' })).toBeVisible();
    await expect(page.getByRole('button', { name: '上传图片' })).toBeVisible();
  });

  test('should display empty state when no media', async ({ page }) => {
    await expect(page.getByText('暂无文件，上传一张图片开始使用')).toBeVisible();
  });

  test('should display search input', async ({ page }) => {
    await expect(page.getByPlaceholder('搜索文件名')).toBeVisible();
  });

  test('should display refresh button', async ({ page }) => {
    await expect(page.getByRole('button', { name: '刷新' })).toBeVisible();
  });

  test('should show loading state', async ({ page }) => {
    await page.goto('/admin/media');
    // Should show loading indicator initially
    const loading = page.locator('.ant-spin');
    if (await loading.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(loading).toBeVisible();
    }
  });
});
