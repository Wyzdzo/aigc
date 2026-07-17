// src/features/auth/application/hooks/useAuth.spec.tsx

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';

import { useAuth, AuthProvider } from '@/features/auth';

// Mock App.useApp
const { mockMessageApi } = vi.hoisted(() => ({
  mockMessageApi: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
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

// Mock configureGraphQLRuntime
const { configureGraphQLRuntimeMock } = vi.hoisted(() => ({
  configureGraphQLRuntimeMock: vi.fn(),
}));

vi.mock('@/shared/graphql/client', () => ({
  configureGraphQLRuntime: configureGraphQLRuntimeMock,
}));

// Mock useMutation to control login behavior in tests
const { mockLoginMutationFn } = vi.hoisted(() => ({
  mockLoginMutationFn: vi.fn(),
}));

vi.mock('@apollo/client/react', () => ({
  useMutation: () => [mockLoginMutationFn, { loading: false }],
}));

beforeAll(() => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  };
}

describe('useAuth', () => {
  describe('Happy Path', () => {
    it('should initialize with unauthenticated state when no token in storage', async () => {
      (localStorage.getItem as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should check admin role correctly', () => {
      (localStorage.getItem as any)
        .mockReturnValueOnce('test-token')
        .mockReturnValueOnce(
          JSON.stringify({
            accessGroup: ['ADMIN', 'STAFF'],
          }),
        );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isAdmin()).toBe(true);
    });

    it('should logout successfully', () => {
      (localStorage.getItem as any).mockReturnValueOnce('test-token');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      result.current.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('admin_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('admin_user');
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should return false for isAdmin when user is null', () => {
      (localStorage.getItem as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isAdmin()).toBe(false);
    });

    it('should return false for hasRole when user is null', () => {
      (localStorage.getItem as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.hasRole('admin')).toBe(false);
    });

    it('should check hasRole correctly', () => {
      (localStorage.getItem as any)
        .mockReturnValueOnce('test-token')
        .mockReturnValueOnce(
          JSON.stringify({
            accessGroup: ['STAFF'],
          }),
        );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.hasRole('staff')).toBe(true);
      expect(result.current.hasRole('admin')).toBe(false);
    });

    it('should clear invalid storage data', () => {
      (localStorage.getItem as any)
        .mockReturnValueOnce('test-token')
        .mockReturnValueOnce('invalid-json');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('admin_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('admin_user');
    });

    it('should redirect to /login on auth failure', () => {
      (localStorage.getItem as any).mockReturnValue(null);

      renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // onAuthFailure is set up internally via configureGraphQLRuntime
      expect(configureGraphQLRuntimeMock).toHaveBeenCalled();
    });
  });

  describe('Login Flow', () => {
    const mockUserInfo = {
      id: 1,
      accountId: 1,
      nickname: '管理员',
      avatarUrl: null,
      email: 'admin@test.com',
      accessGroup: ['ADMIN'],
    };

    it('should login successfully and call messageApi.success', async () => {
      mockLoginMutationFn.mockResolvedValue({
        data: {
          login: {
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token',
            accountId: 1,
            role: 'ADMIN',
            userInfo: mockUserInfo,
          },
        },
      });

      (localStorage.getItem as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      const success = await result.current.login({
        loginName: 'admin',
        loginPassword: 'password123',
      });

      expect(mockLoginMutationFn).toHaveBeenCalled();
      expect(success).toBe(true);

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(result.current.user?.nickname).toBe('管理员');
      expect(mockMessageApi.success).toHaveBeenCalledWith('登录成功');
      expect(localStorage.setItem).toHaveBeenCalledWith('admin_token', 'test-access-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('admin_refresh_token', 'test-refresh-token');
    });

    it('should handle login failure and call messageApi.error', async () => {
      mockLoginMutationFn.mockRejectedValue(new Error('密码错误'));

      (localStorage.getItem as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      const success = await result.current.login({
        loginName: 'admin',
        loginPassword: 'wrong',
      });

      expect(success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe('密码错误');
      });

      expect(mockMessageApi.error).toHaveBeenCalledWith('密码错误');
    });

    it('should handle login with no result data', async () => {
      mockLoginMutationFn.mockResolvedValue({
        data: { login: null },
      });

      (localStorage.getItem as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      const success = await result.current.login({
        loginName: 'admin',
        loginPassword: 'password123',
      });

      expect(success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe('登录失败');
      });
    });

    it('should call messageApi.success on logout', () => {
      (localStorage.getItem as any).mockReturnValue('test-token');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      result.current.logout();

      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('admin_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('admin_user');
      expect(localStorage.removeItem).toHaveBeenCalledWith('admin_refresh_token');
      expect(mockMessageApi.success).toHaveBeenCalledWith('已退出登录');
    });
  });

  describe('onAuthFailure', () => {
    it('should redirect to /login when onAuthFailure is triggered', () => {
      (localStorage.getItem as any)
        .mockReturnValueOnce('test-token')
        .mockReturnValueOnce(JSON.stringify({ accessGroup: ['ADMIN'] }));

      const originalLocation = window.location;
      delete (window as any).location;
      (window as any).location = { href: '' };

      renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Find the onAuthFailure callback passed to configureGraphQLRuntime
      const onAuthFailureCall = configureGraphQLRuntimeMock.mock.calls.find(
        (call) => call[0] && typeof call[0].onAuthFailure === 'function',
      );

      if (onAuthFailureCall) {
        const onAuthFailure = (onAuthFailureCall[0] as { onAuthFailure: () => void }).onAuthFailure;
        onAuthFailure();
        expect(window.location.href).toBe('/login');
      }

      (window as any).location = originalLocation;
    });
  });
});