// e2e/blog-tags.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog Tags Page', () => {
  test('should display page content', async ({ page }) => {
    await page.goto('/blog/tags');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show tags page title', async ({ page }) => {
    await page.goto('/blog/tags');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=文章标签')).toBeVisible();
  });

  test('should show tag cloud or empty state', async ({ page }) => {
    await page.goto('/blog/tags');
    await page.waitForLoadState('networkidle');
    const tagItems = page.locator('.ant-tag');
    const emptyState = page.locator('.ant-empty');
    await expect(tagItems.first().or(emptyState)).toBeVisible();
  });
});
