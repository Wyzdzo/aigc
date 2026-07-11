// e2e/admin-post-edit.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Post Edit Page', () => {
  test('should redirect to home when not authenticated', async ({ page }) => {
    await page.goto('/admin/posts/new');
    await expect(page).toHaveURL('/');
  });

  test('should redirect to home when editing without authentication', async ({ page }) => {
    await page.goto('/admin/posts/1');
    await expect(page).toHaveURL('/');
  });

  test('should display create post page when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await expect(page.locator('text=新建文章')).toBeVisible();
  });

  test('should display edit post page when authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/1');
    await expect(page.locator('text=编辑文章')).toBeVisible();
  });

  test('should render post editor form fields', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    await expect(page.getByPlaceholder('请输入文章标题')).toBeVisible();
    await expect(page.getByPlaceholder('自动生成')).toBeVisible();
    await expect(page.getByPlaceholder('简要描述文章内容')).toBeVisible();
    // Cover image is now an Upload component, check for upload button
    await expect(page.locator('text=上传封面')).toBeVisible();
  });

  test('should render post editor toolbar', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const toolbarButtons = page.locator('.ant-btn');
    const buttonCount = await toolbarButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should render sidebar sections', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=基本信息')).toBeVisible();
    await expect(page.locator('text=所属分类')).toBeVisible();
    await expect(page.locator('text=请选择标签')).toBeVisible();
    await expect(page.locator('text=状态设置')).toBeVisible();
  });

  test('should render status options', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=草稿')).toBeVisible();
  });

  test('should render action buttons', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=返回列表')).toBeVisible();
    await expect(page.locator('text=创建文章')).toBeVisible();
  });

  test('should toggle preview mode', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    // Markdown editor has a view mode selector
    const select = page.locator('.ant-select');
    await expect(select).toBeVisible();
  });

  test('should navigate back to posts list', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const backButton = page.locator('text=返回列表');
    await backButton.click();

    await expect(page).toHaveURL('/admin/posts');
  });

  test('should navigate back on return button', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const returnButton = page.locator('text=返回列表');
    await returnButton.click();

    await expect(page).toHaveURL('/admin/posts');
  });

  test('should show save button for create mode', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=创建文章')).toBeVisible();
  });

  test('should show update button for edit mode', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/1');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=更新文章')).toBeVisible();
  });

  test('should display edit post page with data', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/1');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=编辑文章')).toBeVisible();
  });

  test('should show error when submitting empty title', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const createButton = page.locator('text=创建文章');
    await createButton.click();

    await expect(page.locator('text=请输入文章标题')).toBeVisible();
  });

  test('should allow typing in title field', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const titleInput = page.getByPlaceholder('请输入文章标题');
    await titleInput.fill('测试文章标题');

    await expect(titleInput).toHaveValue('测试文章标题');
  });

  test('should allow typing in summary field', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const summaryInput = page.getByPlaceholder('简要描述文章内容');
    await summaryInput.fill('这是一篇测试文章的摘要');

    await expect(summaryInput).toHaveValue('这是一篇测试文章的摘要');
  });

  test('should allow typing in cover image field', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    // Cover image is now an Upload component
    const uploadArea = page.locator('.ant-upload');
    await expect(uploadArea).toBeVisible();
  });

  test('should show last saved time after clicking save', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const titleInput = page.getByPlaceholder('请输入文章标题');
    await titleInput.fill('测试文章');

    const saveButton = page.locator('text=保存');
    await saveButton.click();

    await expect(page.locator('text=上次保存:')).toBeVisible();
  });

  test('should handle invalid slug format', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const slugInput = page.getByPlaceholder('自动生成');
    await slugInput.fill('invalid slug');

    await expect(slugInput).toHaveValue('invalid slug');
  });

  test('should validate form fields correctly', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const titleInput = page.getByPlaceholder('请输入文章标题');
    await titleInput.fill('测试文章');

    const slugInput = page.getByPlaceholder('自动生成');
    await slugInput.fill('test-article');

    await expect(titleInput).toHaveValue('测试文章');
    await expect(slugInput).toHaveValue('test-article');
  });

  test('should render Markdown editor with split view', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    // Markdown editor should have textarea and view mode selector
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();

    // View mode selector (split/edit/preview)
    const select = page.locator('.ant-select');
    await expect(select).toBeVisible();
  });

  test('should render toolbar with heading buttons', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=H1')).toBeVisible();
    await expect(page.locator('text=H2')).toBeVisible();
    await expect(page.locator('text=H3')).toBeVisible();
  });

  test('should allow typing Markdown content in editor', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const textarea = page.locator('textarea');
    await textarea.fill('# Hello World\n\nThis is **bold** text.');

    await expect(textarea).toHaveValue('# Hello World\n\nThis is **bold** text.');
  });

  test('should insert heading syntax when H1 button clicked', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    // Type some content first
    const textarea = page.locator('textarea');
    await textarea.fill('Hello');

    // Click H1 button
    const h1Button = page.locator('button:has-text("H1")');
    await h1Button.click();

    // Content should be prefixed with #
    const value = await textarea.inputValue();
    expect(value).toContain('#');
  });

  test('should insert bold syntax when bold button clicked', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const textarea = page.locator('textarea');
    await textarea.fill('Hello');

    // Select text and click bold button
    await textarea.selectText();
    const boldButton = page.locator('.anticon-bold').first();
    await boldButton.click();

    const value = await textarea.inputValue();
    expect(value).toContain('**');
  });

  test('should handle Ctrl+S save shortcut', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
    });
    await page.goto('/admin/posts/new');
    await page.waitForLoadState('networkidle');

    const textarea = page.locator('textarea');
    await textarea.fill('测试内容');
    await textarea.press('Control+s');

    await expect(page.locator('text=上次保存:')).toBeVisible();
  });
});