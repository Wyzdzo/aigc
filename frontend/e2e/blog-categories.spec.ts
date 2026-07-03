// e2e/blog-categories.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog Categories Page', () => {
  test('should display page content', async ({ page }) => {
    await page.goto('/blog/categories');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show category tree or empty state', async ({ page }) => {
    await page.goto('/blog/categories');
    await page.waitForLoadState('networkidle');
    const categoryTree = page.locator('[data-testid="category-tree"]');
    const emptyState = page.locator('[data-testid="empty-state"]');
    await expect(categoryTree.or(emptyState)).toBeVisible();
  });
});
