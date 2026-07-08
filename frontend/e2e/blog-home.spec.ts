// e2e/blog-home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog Home Page', () => {
  test('should display page content', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/blog');
    const aboutLink = page.locator('a[href="/blog/about"]');
    await aboutLink.click();
    await expect(page).toHaveURL('/blog/about');
  });

  test('should not show announcement when not set', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    // 公告未设置时不应显示公告卡片
    const announcement = page.locator('text=公告').first();
    await expect(announcement).not.toBeVisible();
  });
});