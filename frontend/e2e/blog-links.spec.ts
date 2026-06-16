// e2e/blog-links.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog Links Page', () => {
  test('should display page title', async ({ page }) => {
    await page.goto('/blog/links');
    await expect(page.getByRole('heading', { name: '友情链接' })).toBeVisible();
  });

  test('should display apply button', async ({ page }) => {
    await page.goto('/blog/links');
    const applyButton = page.getByRole('button', { name: '申请友链' });
    await expect(applyButton).toBeVisible();
  });

  test('should display link exchange rules', async ({ page }) => {
    await page.goto('/blog/links');
    await expect(page.getByRole('heading', { name: '友链交换须知' })).toBeVisible();
  });
});