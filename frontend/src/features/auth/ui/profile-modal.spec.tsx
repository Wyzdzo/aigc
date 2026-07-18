// src/features/auth/ui/profile-modal.spec.tsx

import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach,beforeAll, describe, expect, it, vi } from 'vitest';

import { ProfileModal } from './profile-modal';

const { mockUpdateUserInfo, mockMessageApi } = vi.hoisted(() => ({
  mockUpdateUserInfo: vi.fn(),
  mockMessageApi: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('../application/hooks/useUpdateUserInfo', () => ({
  useUpdateUserInfo: () => ({
    updateUserInfo: mockUpdateUserInfo,
    loading: false,
  }),
}));

const mockUser = {
  id: 2,
  accountId: 2,
  nickname: '访客用户',
  avatarUrl: 'https://example.com/avatar.png',
  email: 'guest@test.com',
  accessGroup: ['REGISTRANT'],
};

vi.mock('../application/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    updateUser: vi.fn(),
    isAuthenticated: true,
    isAdmin: () => false,
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

describe('ProfileModal', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    document.querySelectorAll('.ant-modal-root').forEach((el) => el.remove());
  });

  describe('Happy Path', () => {
    it('should render modal with form fields when open=true', async () => {
      render(<ProfileModal open={true} onClose={vi.fn()} />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      expect(document.querySelector('.ant-modal-title')?.textContent).toContain('个人资料');
    });

    it('should not render modal content when open=false', () => {
      render(<ProfileModal open={false} onClose={vi.fn()} />, { wrapper: Wrapper });

      const modalWrap = document.querySelector('.ant-modal-wrap');
      expect(modalWrap).toBeFalsy();
    });

    it('should initialize form with user data when opened', async () => {
      render(<ProfileModal open={true} onClose={vi.fn()} />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      // Check nickname input has user's nickname
      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      const nicknameInput = inputs[0] as HTMLInputElement;
      expect(nicknameInput.value).toBe('访客用户');
    });

    it('should call updateUserInfo and onClose on successful submit', async () => {
      const onClose = vi.fn();
      mockUpdateUserInfo.mockResolvedValue(true);

      render(<ProfileModal open={true} onClose={onClose} />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const okButton = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockUpdateUserInfo).toHaveBeenCalled();
        expect(mockMessageApi.success).toHaveBeenCalledWith('个人信息更新成功');
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Error Path', () => {
    it('should show error message when updateUserInfo returns false', async () => {
      const onClose = vi.fn();
      mockUpdateUserInfo.mockResolvedValue(false);

      render(<ProfileModal open={true} onClose={onClose} />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const okButton = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockMessageApi.error).toHaveBeenCalledWith('更新失败，请重新登录后再试');
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should show error message when updateUserInfo throws', async () => {
      const onClose = vi.fn();
      mockUpdateUserInfo.mockRejectedValue(new Error('Server error'));

      render(<ProfileModal open={true} onClose={onClose} />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const okButton = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockMessageApi.error).toHaveBeenCalledWith('更新失败，请重新登录后再试');
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not call updateUserInfo when form validation fails (nickname required)', async () => {
      // Override mock to return user with no nickname to test validation
      render(<ProfileModal open={true} onClose={vi.fn()} />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      // Clear the nickname input to trigger required validation
      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      const nicknameInput = inputs[0] as HTMLInputElement;
      fireEvent.change(nicknameInput, { target: { value: '' } });

      const okButton = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(document.querySelector('.ant-form-item-explain')?.textContent).toContain('请输入昵称');
      });

      expect(mockUpdateUserInfo).not.toHaveBeenCalled();
    });

    it('should show upload error when avatar upload fails', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.stubGlobal('fetch', mockFetch);

      render(<ProfileModal open={true} onClose={vi.fn()} />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      // Trigger file upload via hidden input
      const fileInput = document.querySelector('.ant-modal input[type="file"]') as HTMLElement;
      const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
        expect(mockMessageApi.error).toHaveBeenCalledWith('上传失败');
      });

      vi.restoreAllMocks();
    });

    it('should show upload error when server returns non-OK response', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
      vi.stubGlobal('fetch', mockFetch);

      render(<ProfileModal open={true} onClose={vi.fn()} />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const fileInput = document.querySelector('.ant-modal input[type="file"]') as HTMLElement;
      const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
        expect(mockMessageApi.error).toHaveBeenCalledWith('上传失败');
      });

      vi.restoreAllMocks();
    });

    it('should call onClose when cancel is clicked', async () => {
      const onClose = vi.fn();

      render(<ProfileModal open={true} onClose={onClose} />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      // Use footer-specific selector to avoid matching Upload button
      const cancelButton = document.querySelector('.ant-modal-footer .ant-btn-default') as HTMLElement;
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });
});
