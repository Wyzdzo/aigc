// e2e/blog-tags.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog Tags Page', () => {
  test('should display page content', async ({ page }) => {
    await page.goto('/blog/tags');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show tag cloud or empty state', async ({ page }) => {
    await page.goto('/blog/tags');
    await page.waitForLoadState('networkidle');
    const tagCloud = page.locator('.tag-cloud, .tags-list, [data-testid="tag-cloud"]');
    const emptyState = page.locator('.empty-state, [data-testid="empty-state"]');
    await expect(tagCloud.or(emptyState)).toBeVisible();
  });
});
