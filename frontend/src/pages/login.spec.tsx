// src/pages/login.spec.tsx

import { cleanup,fireEvent, render, waitFor } from '@testing-library/react';
import { App as AntApp } from 'antd';
import { MemoryRouter } from 'react-router';
import { afterEach,beforeAll, describe, expect, it, vi } from 'vitest';

import { USER_KEY } from '@/shared/graphql/auth-constants';

import { LoginPage } from './login';

const { mockLogin, mockLoading } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockLoading: false,
}));

const mockNavigate = vi.fn();

vi.mock('@/features/auth', () => ({
  useAuth: () => ({
    login: mockLogin,
    loading: mockLoading,
  }),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeAll(() => {
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
  return (
    <MemoryRouter>
      <AntApp>{children}</AntApp>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Happy Path', () => {
    it('should render login form', () => {
      render(<LoginPage />, { wrapper: Wrapper });

      expect(document.body.textContent).toContain('管理员登录');
    });

    it('should navigate to /admin when admin user logs in', async () => {
      mockLogin.mockResolvedValue(true);
      localStorage.setItem(USER_KEY, JSON.stringify({ accessGroup: ['ADMIN'] }));

      render(<LoginPage />, { wrapper: Wrapper });

      const inputs = document.querySelectorAll('.ant-input');
      const usernameInput = inputs[0] as HTMLInputElement;
      fireEvent.change(usernameInput, { target: { value: 'admin' } });

      const passwordInput = document.querySelector('.ant-input-password input') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });

      const submitButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          loginName: 'admin',
          loginPassword: 'admin123',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/admin');
      });
    });

    it('should navigate to /blog when non-admin user logs in', async () => {
      mockLogin.mockResolvedValue(true);
      localStorage.setItem(USER_KEY, JSON.stringify({ accessGroup: ['REGISTRANT'] }));

      render(<LoginPage />, { wrapper: Wrapper });

      const inputs = document.querySelectorAll('.ant-input');
      const usernameInput = inputs[0] as HTMLInputElement;
      fireEvent.change(usernameInput, { target: { value: 'guest' } });

      const passwordInput = document.querySelector('.ant-input-password input') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'Guest@123' } });

      const submitButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          loginName: 'guest',
          loginPassword: 'Guest@123',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/blog');
      });
    });
  });

  describe('Error Path', () => {
    it('should not navigate when login fails', async () => {
      mockLogin.mockResolvedValue(false);

      render(<LoginPage />, { wrapper: Wrapper });

      const inputs = document.querySelectorAll('.ant-input');
      const usernameInput = inputs[0] as HTMLInputElement;
      fireEvent.change(usernameInput, { target: { value: 'admin' } });

      const passwordInput = document.querySelector('.ant-input-password input') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });

      const submitButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle missing localStorage data gracefully', async () => {
      mockLogin.mockResolvedValue(true);
      // No USER_KEY in localStorage — login succeeds but no stored user info
      localStorage.removeItem(USER_KEY);

      render(<LoginPage />, { wrapper: Wrapper });

      const inputs = document.querySelectorAll('.ant-input');
      const usernameInput = inputs[0] as HTMLInputElement;
      fireEvent.change(usernameInput, { target: { value: 'test' } });

      const passwordInput = document.querySelector('.ant-input-password input') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'test1234' } });

      const submitButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/blog'); // No admin group → defaults to /blog
      });
    });

    it('should handle invalid JSON in localStorage gracefully', async () => {
      mockLogin.mockResolvedValue(true);
      localStorage.setItem(USER_KEY, 'invalid-json');

      render(<LoginPage />, { wrapper: Wrapper });

      const inputs = document.querySelectorAll('.ant-input');
      const usernameInput = inputs[0] as HTMLInputElement;
      fireEvent.change(usernameInput, { target: { value: 'test' } });

      const passwordInput = document.querySelector('.ant-input-password input') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'test1234' } });

      const submitButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/blog'); // JSON.parse fails → no admin → /blog
      });
    });

    it('should not navigate when form validation fails (empty fields)', async () => {
      render(<LoginPage />, { wrapper: Wrapper });

      const submitButton = document.querySelector('.ant-btn-primary') as HTMLElement;
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(document.querySelector('.ant-form-item-explain')).toBeTruthy();
      });

      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
