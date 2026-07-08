// src/features/settings/application/hooks/usePublicSettings.spec.tsx

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';

import { usePublicSettings } from './usePublicSettings';
import { GET_PUBLIC_SETTINGS } from '../../infrastructure/graphql/queries';

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

function createWrapper(mocks: MockedResponse[]) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

describe('usePublicSettings', () => {
  describe('Happy Path', () => {
    it('should return announcement when set', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_PUBLIC_SETTINGS },
          result: {
            data: {
              publicSettings: { announcement: '欢迎访问本站！' },
            },
          },
        },
      ];

      const { result } = renderHook(() => usePublicSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.announcement).toBe('欢迎访问本站！');
    });

    it('should return null announcement when not set', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_PUBLIC_SETTINGS },
          result: {
            data: {
              publicSettings: { announcement: null },
            },
          },
        },
      ];

      const { result } = renderHook(() => usePublicSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.announcement).toBeNull();
    });
  });

  describe('Error Path', () => {
    it('should return null announcement and expose error on query failure', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_PUBLIC_SETTINGS },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => usePublicSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.announcement).toBeNull();
      expect(result.current.error).toBeTruthy();
    });
  });
});
