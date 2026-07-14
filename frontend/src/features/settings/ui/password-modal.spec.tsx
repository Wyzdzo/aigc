// src/features/settings/ui/password-modal.spec.tsx

import { render, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';

import { PasswordModal } from './password-modal';

const { mockUpdatePassword, mockMessageApi } = vi.hoisted(() => ({
  mockUpdatePassword: vi.fn(),
  mockMessageApi: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('../application/hooks', () => ({
  useSettings: () => ({
    updatePassword: mockUpdatePassword,
    updatePasswordLoading: false,
    settings: null,
    loading: false,
    refetch: vi.fn(),
    updateSiteSettings: vi.fn(),
    updateSiteSettingsLoading: false,
    updateBloggerInfo: vi.fn(),
    updateBloggerInfoLoading: false,
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

describe('PasswordModal', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Clean up antd Modal portal content from document.body
    document.querySelectorAll('.ant-modal-root').forEach((el) => el.remove());
  });

  describe('Happy Path', () => {
    it('should render modal with form fields when open=true', async () => {
      render(
        <PasswordModal open={true} onClose={vi.fn()} />,
        { wrapper: Wrapper },
      );

      // Modal renders in a portal (document.body)
      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      expect(document.querySelector('.ant-modal-title')?.textContent).toContain('修改密码');
      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      expect(inputs.length).toBe(3);
    });

    it('should not render modal content when open=false', () => {
      render(
        <PasswordModal open={false} onClose={vi.fn()} />,
        { wrapper: Wrapper },
      );

      // When open=false, antd Modal renders but the wrap is hidden (display: none)
      const modalWrap = document.querySelector('.ant-modal-wrap');
      expect(modalWrap).toBeFalsy();
    });

    it('should call updatePassword with correct values on submit success, then call messageApi.success and onClose', async () => {
      const onClose = vi.fn();
      mockUpdatePassword.mockResolvedValue(true);

      render(
        <PasswordModal open={true} onClose={onClose} />,
        { wrapper: Wrapper },
      );

      // Modal renders in a portal (document.body)
      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      const oldPasswordInput = inputs[0] as HTMLInputElement;
      const newPasswordInput = inputs[1] as HTMLInputElement;
      const confirmPasswordInput = inputs[2] as HTMLInputElement;

      fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpass456' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpass456' } });

      const okButton = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockUpdatePassword).toHaveBeenCalledWith({
          oldPassword: 'oldpass123',
          newPassword: 'newpass456',
        });
        expect(mockMessageApi.success).toHaveBeenCalledWith('密码修改成功');
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('should call messageApi.error when updatePassword returns false', async () => {
      const onClose = vi.fn();
      mockUpdatePassword.mockResolvedValue(false);

      render(
        <PasswordModal open={true} onClose={onClose} />,
        { wrapper: Wrapper },
      );

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      const oldPasswordInput = inputs[0] as HTMLInputElement;
      const newPasswordInput = inputs[1] as HTMLInputElement;
      const confirmPasswordInput = inputs[2] as HTMLInputElement;

      fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpass456' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpass456' } });

      const okButton = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockMessageApi.error).toHaveBeenCalledWith('密码修改失败，请重试');
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should reset form and call onClose when cancel is clicked', async () => {
      const onClose = vi.fn();

      render(
        <PasswordModal open={true} onClose={onClose} />,
        { wrapper: Wrapper },
      );

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const cancelButton = document.querySelector('.ant-modal .ant-btn-default') as HTMLElement;
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Error Path', () => {
    it('should call messageApi.error when updatePassword throws an error (not validation error)', async () => {
      const onClose = vi.fn();
      mockUpdatePassword.mockRejectedValue(new Error('Network error'));

      render(
        <PasswordModal open={true} onClose={onClose} />,
        { wrapper: Wrapper },
      );

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      const oldPasswordInput = inputs[0] as HTMLInputElement;
      const newPasswordInput = inputs[1] as HTMLInputElement;
      const confirmPasswordInput = inputs[2] as HTMLInputElement;

      fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpass456' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpass456' } });

      const okButton = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockMessageApi.error).toHaveBeenCalledWith('密码修改失败，请重试');
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not call updatePassword when form validation fails (required fields empty)', async () => {
      const onClose = vi.fn();

      render(
        <PasswordModal open={true} onClose={onClose} />,
        { wrapper: Wrapper },
      );

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const okButton = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(document.querySelector('.ant-form-item-explain')?.textContent).toContain('请输入当前密码');
      });

      expect(mockUpdatePassword).not.toHaveBeenCalled();
    });

    it('should show validation error when new password is less than 8 characters', async () => {
      render(
        <PasswordModal open={true} onClose={vi.fn()} />,
        { wrapper: Wrapper },
      );

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      const oldPasswordInput = inputs[0] as HTMLInputElement;
      const newPasswordInput = inputs[1] as HTMLInputElement;
      const confirmPasswordInput = inputs[2] as HTMLInputElement;

      fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
      fireEvent.change(newPasswordInput, { target: { value: 'short' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });

      const okButton = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(document.querySelector('.ant-form-item-explain')?.textContent).toContain('密码至少8个字符');
      });

      expect(mockUpdatePassword).not.toHaveBeenCalled();
    });

    it('should show validation error when confirm password doesn\'t match new password', async () => {
      render(
        <PasswordModal open={true} onClose={vi.fn()} />,
        { wrapper: Wrapper },
      );

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      const oldPasswordInput = inputs[0] as HTMLInputElement;
      const newPasswordInput = inputs[1] as HTMLInputElement;
      const confirmPasswordInput = inputs[2] as HTMLInputElement;

      fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpass456' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different789' } });

      const okButton = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(document.querySelector('.ant-form-item-explain')?.textContent).toContain('两次输入的密码不一致');
      });

      expect(mockUpdatePassword).not.toHaveBeenCalled();
    });
  });
});
