// src/features/auth/application/hooks/useAuth.spec.tsx

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';

import { useAuth } from '@/features/auth';
import type { DocumentNode } from 'graphql';

// Mock LOGIN
vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual('@/features/auth');
  return {
    ...actual,
    LOGIN: { type: 'document' } as unknown as DocumentNode,
  };
});

// Mock message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Mock configureGraphQLRuntime
vi.mock('@/shared/graphql/client', () => ({
  configureGraphQLRuntime: vi.fn(),
}));

beforeAll(() => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

const mockLoginSuccess = {
  request: { query: { type: 'document' } as any },
  result: {
    data: {
      login: {
        accessToken: 'test-token-123',
        refreshToken: 'refresh-token-456',
        accountId: 1,
        role: 'admin',
        userInfo: {
          id: 1,
          accountId: 1,
          nickname: 'Admin',
          avatarUrl: null,
          email: 'admin@example.com',
          accessGroup: ['ADMIN', 'STAFF'],
        },
      },
    },
  },
};

const mockLoginFailure = {
  request: { query: { type: 'document' } as any },
  error: new Error('Invalid credentials'),
};

function createWrapper(mocks: MockedResponse[] = []) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
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
  });
});