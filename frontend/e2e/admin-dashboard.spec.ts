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

  test('should display stat cards with titles when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // 验证仪表盘标题
    await expect(page.locator('text=仪表盘')).toBeVisible();

    // 验证统计卡片标题包含总阅读量和总点赞量
    await expect(page.locator('text=总阅读量')).toBeVisible();
    await expect(page.locator('text=总点赞量')).toBeVisible();
    await expect(page.locator('text=文章总数')).toBeVisible();
    await expect(page.locator('text=评论总数')).toBeVisible();
  });

  test('should display quick actions section when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=快捷操作')).toBeVisible();
    await expect(page.locator('text=写文章')).toBeVisible();
    await expect(page.locator('text=最近动态')).toBeVisible();
  });

  test('should redirect when token is cleared', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');

    await page.evaluate(() => {
      localStorage.removeItem('admin_token');
    });

    await page.goto('/admin');
    await expect(page).toHaveURL('/');
  });

  test('should redirect when token is empty', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', '');
    });
    await page.goto('/admin');
    await expect(page).toHaveURL('/');
  });

  test('should redirect when visiting nested admin routes unauthenticated', async ({ page }) => {
    await page.goto('/admin/posts');
    await expect(page).toHaveURL('/');

    await page.goto('/admin/comments');
    await expect(page).toHaveURL('/');

    await page.goto('/admin/categories');
    await expect(page).toHaveURL('/');

    await page.goto('/admin/tags');
    await expect(page).toHaveURL('/');
  });

  test('should navigate to settings page when clicking system settings quick action', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    await page.locator('text=系统设置').click();
    await expect(page).toHaveURL('/admin/settings');
  });
});