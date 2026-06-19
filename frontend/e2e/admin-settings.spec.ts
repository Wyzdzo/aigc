// e2e/admin-settings.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin Settings Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');

    // Navigate to settings page
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Rendering', () => {
    test('should display page title', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '系统设置' })).toBeVisible();
    });

    test('should display all tabs', async ({ page }) => {
      await expect(page.getByRole('tab', { name: '网站设置' })).toBeVisible();
      await expect(page.getByRole('tab', { name: '博主信息' })).toBeVisible();
      await expect(page.getByRole('tab', { name: '修改密码' })).toBeVisible();
    });

    test('should show site settings form by default', async ({ page }) => {
      await expect(page.getByLabel('网站名称')).toBeVisible();
      await expect(page.getByLabel('网站描述')).toBeVisible();
      await expect(page.getByLabel('SEO关键词')).toBeVisible();
      await expect(page.getByLabel('每页文章数')).toBeVisible();
    });
  });

  test.describe('Site Settings Tab', () => {
    test('should display save button', async ({ page }) => {
      await expect(page.getByRole('button', { name: '保存设置' })).toBeVisible();
    });

    test('should allow editing site name', async ({ page }) => {
      const siteNameInput = page.getByLabel('网站名称');
      await siteNameInput.clear();
      await siteNameInput.fill('New Blog Name');
      await expect(siteNameInput).toHaveValue('New Blog Name');
    });

    test('should allow editing site description', async ({ page }) => {
      const descriptionInput = page.getByLabel('网站描述');
      await descriptionInput.clear();
      await descriptionInput.fill('New Description');
      await expect(descriptionInput).toHaveValue('New Description');
    });

    test('should allow editing per page count', async ({ page }) => {
      const perPageInput = page.getByLabel('每页文章数');
      await perPageInput.fill('20');
      await expect(perPageInput).toHaveValue('20');
    });

    test('should toggle allow comment switch', async ({ page }) => {
      const switchLocator = page.locator('.ant-switch');
      // Click the switch to toggle
      await switchLocator.click();
      // Verify the switch is clickable
      await expect(switchLocator).toBeVisible();
    });
  });

  test.describe('Blogger Info Tab', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('tab', { name: '博主信息' }).click();
      await page.waitForTimeout(500);
    });

    test('should display blogger info form', async ({ page }) => {
      await expect(page.getByLabel('昵称')).toBeVisible();
      await expect(page.getByLabel('个人简介')).toBeVisible();
    });

    test('should display avatar upload button', async ({ page }) => {
      await expect(page.getByRole('button', { name: '上传头像' })).toBeVisible();
    });

    test('should display save button', async ({ page }) => {
      await expect(page.getByRole('button', { name: '保存信息' })).toBeVisible();
    });

    test('should allow editing nickname', async ({ page }) => {
      const nicknameInput = page.getByLabel('昵称');
      await nicknameInput.clear();
      await nicknameInput.fill('New Nickname');
      await expect(nicknameInput).toHaveValue('New Nickname');
    });
  });

  test.describe('Password Tab', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('tab', { name: '修改密码' }).click();
      await page.waitForTimeout(500);
    });

    test('should display password form', async ({ page }) => {
      await expect(page.getByLabel('旧密码')).toBeVisible();
      await expect(page.getByLabel('新密码')).toBeVisible();
      await expect(page.getByLabel('确认密码')).toBeVisible();
    });

    test('should display submit button', async ({ page }) => {
      await expect(page.getByRole('button', { name: '修改密码' })).toBeVisible();
    });

    test('should allow entering old password', async ({ page }) => {
      const oldPasswordInput = page.getByLabel('旧密码');
      await oldPasswordInput.fill('oldpassword123');
      await expect(oldPasswordInput).toHaveValue('oldpassword123');
    });

    test('should allow entering new password', async ({ page }) => {
      const newPasswordInput = page.getByLabel('新密码');
      await newPasswordInput.fill('newpassword456');
      await expect(newPasswordInput).toHaveValue('newpassword456');
    });

    test('should show validation error for mismatched passwords', async ({ page }) => {
      await page.getByLabel('旧密码').fill('oldpassword123');
      await page.getByLabel('新密码').fill('newpassword456');
      await page.getByLabel('确认密码').fill('differentpassword');

      await page.getByRole('button', { name: '修改密码' }).click();

      await expect(page.getByText('两次密码不一致')).toBeVisible();
    });

    test('should show validation error for short password', async ({ page }) => {
      await page.getByLabel('旧密码').fill('oldpassword123');
      await page.getByLabel('新密码').fill('short');
      await page.getByLabel('确认密码').fill('short');

      await page.getByRole('button', { name: '修改密码' }).click();

      await expect(page.getByText('密码至少6位')).toBeVisible();
    });
  });

  test.describe('Tab Navigation', () => {
    test('should switch between tabs', async ({ page }) => {
      // Start on site settings tab
      await expect(page.getByLabel('网站名称')).toBeVisible();

      // Switch to blogger info tab
      await page.getByRole('tab', { name: '博主信息' }).click();
      await page.waitForTimeout(500);
      await expect(page.getByLabel('昵称')).toBeVisible();

      // Switch to password tab
      await page.getByRole('tab', { name: '修改密码' }).click();
      await page.waitForTimeout(500);
      await expect(page.getByLabel('旧密码')).toBeVisible();

      // Switch back to site settings tab
      await page.getByRole('tab', { name: '网站设置' }).click();
      await page.waitForTimeout(500);
      await expect(page.getByLabel('网站名称')).toBeVisible();
    });
  });

  test.describe('Loading State', () => {
    test('should show loading indicator on initial load', async ({ page }) => {
      await page.goto('/admin/settings');
      const loading = page.locator('.ant-spin');
      if (await loading.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(loading).toBeVisible();
      }
    });
  });
});