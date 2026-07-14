// src/features/settings/ui/blogger-info-modal.spec.tsx

import { render, waitFor, fireEvent, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';

import { BloggerInfoModal } from './blogger-info-modal';

const { mockUpdateBloggerInfo, mockMessageApi, mockSettings } = vi.hoisted(() => ({
  mockUpdateBloggerInfo: vi.fn(),
  mockMessageApi: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
  mockSettings: {
    siteSettings: [],
    bloggerInfo: { nickname: '博主', avatar: 'https://example.com/avatar.jpg', bio: '简介' },
  },
}));

vi.mock('../application/hooks', () => ({
  useSettings: () => ({
    updateBloggerInfo: mockUpdateBloggerInfo,
    updateBloggerInfoLoading: false,
    settings: mockSettings,
    loading: false,
    refetch: vi.fn(),
    updateSiteSettings: vi.fn(),
    updateSiteSettingsLoading: false,
    updatePassword: vi.fn(),
    updatePasswordLoading: false,
  }),
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    App: {
      ...((actual as Record<string, unknown>).App || {}),
      useApp: vi.fn(() => ({
        message: mockMessageApi,
        notification: {},
        modal: {},
      })),
    },
  };
});

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverMock;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

describe('BloggerInfoModal', () => {
  afterEach(() => {
    cleanup();
    // Clean up portal-rendered modals
    document.querySelectorAll('.ant-modal-root').forEach(el => el.remove());
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('Happy Path', () => {
    it('should render modal with form fields when open=true', async () => {
      render(
        <BloggerInfoModal open={true} onClose={vi.fn()} />,
        { wrapper: Wrapper },
      );

      await waitFor(() => {
        expect(screen.getByText('修改博主信息')).toBeTruthy();
      });

      expect(document.querySelector('input[placeholder="博主昵称"]')).toBeTruthy();
      expect(document.querySelector('textarea[placeholder="简单介绍自己"]')).toBeTruthy();
      expect(screen.getByText('上传头像')).toBeTruthy();
    });

    it('should call updateBloggerInfo with correct values on submit success, then call messageApi.success and onClose', async () => {
      const onClose = vi.fn();
      mockUpdateBloggerInfo.mockResolvedValue(true);

      render(
        <BloggerInfoModal open={true} onClose={onClose} />,
        { wrapper: Wrapper },
      );

      const nicknameInput = document.querySelector('input[placeholder="博主昵称"]') as HTMLInputElement;
      const bioTextarea = document.querySelector('textarea[placeholder="简单介绍自己"]') as HTMLTextAreaElement;

      fireEvent.change(nicknameInput, { target: { value: '新昵称' } });
      fireEvent.change(bioTextarea, { target: { value: '新简介' } });

      const okButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockUpdateBloggerInfo).toHaveBeenCalledWith({
          nickname: '新昵称',
          avatar: 'https://example.com/avatar.jpg',
          bio: '新简介',
        });
      });

      expect(mockMessageApi.success).toHaveBeenCalledWith('博主信息更新成功');
      expect(onClose).toHaveBeenCalled();
    });

    it('should call onSuccess callback with form values on submit success', async () => {
      const onSuccess = vi.fn();
      const onClose = vi.fn();
      mockUpdateBloggerInfo.mockResolvedValue(true);

      render(
        <BloggerInfoModal open={true} onClose={onClose} onSuccess={onSuccess} />,
        { wrapper: Wrapper },
      );

      const nicknameInput = document.querySelector('input[placeholder="博主昵称"]') as HTMLInputElement;
      const bioTextarea = document.querySelector('textarea[placeholder="简单介绍自己"]') as HTMLTextAreaElement;

      fireEvent.change(nicknameInput, { target: { value: '新博主' } });
      fireEvent.change(bioTextarea, { target: { value: '新个人简介' } });

      const okButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith({
          nickname: '新博主',
          avatar: 'https://example.com/avatar.jpg',
          bio: '新个人简介',
        });
      });
    });

    it('should call messageApi.error when updateBloggerInfo returns false', async () => {
      const onClose = vi.fn();
      mockUpdateBloggerInfo.mockResolvedValue(false);

      render(
        <BloggerInfoModal open={true} onClose={onClose} />,
        { wrapper: Wrapper },
      );

      const nicknameInput = document.querySelector('input[placeholder="博主昵称"]') as HTMLInputElement;

      fireEvent.change(nicknameInput, { target: { value: '昵称' } });

      const okButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockMessageApi.error).toHaveBeenCalledWith('更新失败，请重新登录后再试');
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should populate form with existing bloggerInfo when open', async () => {
      render(
        <BloggerInfoModal open={true} onClose={vi.fn()} />,
        { wrapper: Wrapper },
      );

      await waitFor(() => {
        const nicknameInput = document.querySelector('input[placeholder="博主昵称"]') as HTMLInputElement;
        const bioTextarea = document.querySelector('textarea[placeholder="简单介绍自己"]') as HTMLTextAreaElement;

        expect(nicknameInput.value).toBe('博主');
        expect(bioTextarea.value).toBe('简介');
      });
    });
  });

  describe('Error Path', () => {
    it('should call messageApi.error when updateBloggerInfo throws an error', async () => {
      const onClose = vi.fn();
      mockUpdateBloggerInfo.mockRejectedValue(new Error('Network error'));

      render(
        <BloggerInfoModal open={true} onClose={onClose} />,
        { wrapper: Wrapper },
      );

      const nicknameInput = document.querySelector('input[placeholder="博主昵称"]') as HTMLInputElement;

      fireEvent.change(nicknameInput, { target: { value: '昵称' } });

      const okButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockMessageApi.error).toHaveBeenCalledWith('更新失败，请重新登录后再试');
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not call updateBloggerInfo when form validation fails (nickname required)', async () => {
      const onClose = vi.fn();

      // Set bloggerInfo to null so the form is empty
      const originalBloggerInfo = mockSettings.bloggerInfo;
      (mockSettings as Record<string, unknown>).bloggerInfo = null;

      render(
        <BloggerInfoModal open={true} onClose={onClose} />,
        { wrapper: Wrapper },
      );

      const okButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(document.body.textContent).toContain('请输入昵称');
      });

      expect(mockUpdateBloggerInfo).not.toHaveBeenCalled();

      // Restore bloggerInfo
      (mockSettings as Record<string, unknown>).bloggerInfo = originalBloggerInfo;
    });

    it('should handle avatar upload failure (non-ok response)', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      render(
        <BloggerInfoModal open={true} onClose={vi.fn()} />,
        { wrapper: Wrapper },
      );

      await waitFor(() => {
        expect(document.querySelector('input[type="file"]')).toBeTruthy();
      });

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'avatar.png', { type: 'image/png' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockMessageApi.error).toHaveBeenCalledWith('上传失败');
      });
    });

    it('should handle avatar upload network error', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

      render(
        <BloggerInfoModal open={true} onClose={vi.fn()} />,
        { wrapper: Wrapper },
      );

      await waitFor(() => {
        expect(document.querySelector('input[type="file"]')).toBeTruthy();
      });

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'avatar.png', { type: 'image/png' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockMessageApi.error).toHaveBeenCalledWith('上传失败');
      });
    });
  });
});
