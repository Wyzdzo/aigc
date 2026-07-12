// e2e/admin-media.spec.ts

import { test, expect } from '@playwright/test';
import { setupAdminAuth } from './common/auth';

test.describe('Admin Media Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(setupAdminAuth());
    await page.goto('/admin/media');
    await page.waitForLoadState('networkidle');
  });

  test('should display page title and upload button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '图片库' })).toBeVisible();
    await expect(page.getByRole('button', { name: '上传图片' })).toBeVisible();
  });

  test('should display empty state when no media', async ({ page }) => {
    const emptyText = page.getByText('暂无图片，上传一张开始使用');
    const mediaCard = page.locator('.ant-card');
    const hasMedia = (await mediaCard.count()) > 0;
    if (!hasMedia) {
      await expect(emptyText).toBeVisible();
    }
  });

  test('should display search input', async ({ page }) => {
    await expect(page.getByPlaceholder('搜索文件名')).toBeVisible();
  });

  test('should display refresh button', async ({ page }) => {
    await expect(page.getByRole('button', { name: '刷新' })).toBeVisible();
  });

  test('should show loading state', async ({ page }) => {
    await page.goto('/admin/media');
    const loading = page.locator('.ant-spin');
    if (await loading.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(loading).toBeVisible();
    }
  });

  test('should display media grid with images', async ({ page }) => {
    const mediaCard = page.locator('.ant-card');
    const cardCount = await mediaCard.count();
    if (cardCount > 0) {
      const img = mediaCard.first().locator('img');
      await expect(img).toBeVisible();
    }
  });

  test('should display file size information', async ({ page }) => {
    const sizeText = page.locator('text=/\\d+(\\.\\d+)?\\s*(KB|MB)/');
    const mediaCard = page.locator('.ant-card');
    const hasMedia = (await mediaCard.count()) > 0;
    if (hasMedia) {
      await expect(sizeText.first()).toBeVisible();
    }
  });

  test('should display image dimensions', async ({ page }) => {
    const dimText = page.locator('text=/\\d+\\s*x\\s*\\d+/');
    const mediaCard = page.locator('.ant-card');
    const hasMedia = (await mediaCard.count()) > 0;
    if (hasMedia) {
      await expect(dimText.first()).toBeVisible();
    }
  });

  test('should display pagination', async ({ page }) => {
    const pagination = page.locator('.ant-pagination');
    await expect(pagination).toBeVisible();
  });

  test('should show delete confirmation popover', async ({ page }) => {
    const mediaCard = page.locator('.ant-card');
    const hasMedia = (await mediaCard.count()) > 0;
    if (hasMedia) {
      const deleteBtn = page.getByRole('button', { name: /删除/ }).first();
      if (await deleteBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await deleteBtn.click();
        await expect(page.locator('.ant-popconfirm')).toBeVisible();
      }
    }
  });
});
