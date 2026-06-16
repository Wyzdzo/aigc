// e2e/blog-about.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog About Page', () => {
  test('should display page title', async ({ page }) => {
    await page.goto('/blog/about');
    await expect(page.getByRole('heading', { name: '关于我' })).toBeVisible();
  });

  test('should display author information', async ({ page }) => {
    await page.goto('/blog/about');
    await expect(page.getByRole('heading', { name: 'AIGC Blog', level: 3 })).toBeVisible();
  });

  test('should display social links', async ({ page }) => {
    await page.goto('/blog/about');
    const links = page.locator('a[aria-label*="访问"]');
    await expect(links).toHaveCount(3);
  });

  test('should display page content sections', async ({ page }) => {
    await page.goto('/blog/about');
    await expect(page.locator('.ant-card').first()).toBeVisible();
  });
});