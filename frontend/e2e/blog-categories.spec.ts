// e2e/blog-categories.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog Categories Page', () => {
  test('should display page content', async ({ page }) => {
    await page.goto('/blog/categories');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show categories page title', async ({ page }) => {
    await page.goto('/blog/categories');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=文章分类')).toBeVisible();
  });

  test('should show category tree or empty state', async ({ page }) => {
    await page.goto('/blog/categories');
    await page.waitForLoadState('networkidle');
    const categoryTree = page.locator('.ant-tree');
    const emptyState = page.locator('.ant-empty');
    await expect(categoryTree.or(emptyState)).toBeVisible();
  });
});
