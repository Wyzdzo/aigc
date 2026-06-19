// src/features/media/application/hooks/useDeleteMedia.spec.tsx

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';

import { useDeleteMedia } from './useDeleteMedia';
import { DELETE_MEDIA } from '../../infrastructure/graphql/mutations';

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

describe('useDeleteMedia', () => {
  describe('Happy Path', () => {
    it('should delete media successfully', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: DELETE_MEDIA,
            variables: { id: 1 },
          },
          result: {
            data: {
              deleteMedia: true,
            },
          },
        },
      ];

      const { result } = renderHook(() => useDeleteMedia(), {
        wrapper: createWrapper(mocks),
      });

      let deleteResult: boolean | null = null;
      await waitFor(async () => {
        deleteResult = await result.current.deleteMedia(1);
      });

      expect(deleteResult).toBe(true);
    });
  });

  describe('Error Path', () => {
    it('should handle delete failure', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: DELETE_MEDIA,
            variables: { id: 999 },
          },
          result: {
            data: {
              deleteMedia: false,
            },
          },
        },
      ];

      const { result } = renderHook(() => useDeleteMedia(), {
        wrapper: createWrapper(mocks),
      });

      let deleteResult: boolean | null = null;
      await waitFor(async () => {
        deleteResult = await result.current.deleteMedia(999);
      });

      expect(deleteResult).toBe(false);
    });
  });
});
