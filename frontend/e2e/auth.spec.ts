// e2e/auth.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
    });

    test('should display login page title', async ({ page }) => {
      await expect(page.getByText('管理员登录')).toBeVisible();
    });

    test('should display username and password fields', async ({ page }) => {
      await expect(page.getByText('用户名')).toBeVisible();
      await expect(page.getByText('密码')).toBeVisible();
    });

    test('should display submit button', async ({ page }) => {
      await expect(page.getByRole('button', { name: '登录' })).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.getByRole('button', { name: '登录' }).click();
      await expect(page.getByText('请输入用户名')).toBeVisible();
    });
  });

  test.describe('Login Flow', () => {
    test('should redirect to admin page after successful login', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Fill in credentials
      await page.fill('input[placeholder="请输入用户名"]', 'admin');
      await page.fill('input[placeholder="请输入密码"]', 'admin123');
      await page.getByRole('button', { name: '登录' }).click();

      // Wait for redirect to admin page
      await page.waitForURL(/\/admin/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/admin/);
    });

    test('should stay on login page after failed login', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Fill in wrong credentials
      await page.fill('input[placeholder="请输入用户名"]', 'wronguser');
      await page.fill('input[placeholder="请输入密码"]', 'wrongpassword');
      await page.getByRole('button', { name: '登录' }).click();

      // Should stay on login page
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Route Protection', () => {
    test('should redirect unauthenticated user to login', async ({ page }) => {
      await page.goto('/admin');
      await expect(page).toHaveURL(/\/login/);
    });

    test('should allow authenticated user to access admin page', async ({ page }) => {
      // Set localStorage to simulate authenticated user
      await page.goto('/login');
      await page.evaluate(() => {
        localStorage.setItem(
          'admin_token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        );
        localStorage.setItem(
          'admin_user',
          JSON.stringify({
            id: 1,
            accountId: 1,
            nickname: 'Admin',
            accessGroup: ['ADMIN', 'STAFF'],
          }),
        );
      });

      // Navigate to admin page
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      // Should be able to access admin page
      await expect(page).toHaveURL(/\/admin/);
    });

    test('should block user without admin role', async ({ page }) => {
      // Set localStorage with non-admin user
      await page.goto('/login');
      await page.evaluate(() => {
        localStorage.setItem('admin_token', 'user-token');
        localStorage.setItem(
          'admin_user',
          JSON.stringify({
            id: 1,
            accountId: 1,
            nickname: 'User',
            accessGroup: ['GUEST'],
          }),
        );
      });

      // Navigate to admin page
      await page.goto('/admin');

      // Should redirect to home page (not admin or login)
      await page.waitForLoadState('networkidle');
      const url = page.url();
      expect(url).not.toContain('/admin');
    });
  });

  test.describe('Logout', () => {
    test('should clear auth data on logout', async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.evaluate(() => {
        localStorage.setItem('admin_token', 'test-token');
        localStorage.setItem(
          'admin_user',
          JSON.stringify({
            id: 1,
            accountId: 1,
            nickname: 'Admin',
            accessGroup: ['ADMIN'],
          }),
        );
      });

      // Go to admin page
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      // Clear localStorage (simulating logout)
      await page.evaluate(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      });

      // Try to access admin page again
      await page.goto('/admin');

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });
  });
});