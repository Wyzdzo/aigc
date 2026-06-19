// src/features/media/application/hooks/useMediaList.spec.tsx

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';

import { useMediaList } from './useMediaList';
import { GET_MEDIA_LIST } from '../../infrastructure/graphql/queries';

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

describe('useMediaList', () => {
  describe('Happy Path', () => {
    it('should fetch media list successfully', async () => {
      const mockMediaItems = [
        {
          id: 1,
          filename: 'test-image-1.jpg',
          originalName: 'test-image-1.jpg',
          mimeType: 'image/jpeg',
          size: 1024 * 100,
          url: 'http://localhost:3000/uploads/test-image-1.jpg',
          width: 1920,
          height: 1080,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 2,
          filename: 'test-image-2.png',
          originalName: 'test-image-2.png',
          mimeType: 'image/png',
          size: 2048 * 200,
          url: 'http://localhost:3000/uploads/test-image-2.png',
          width: 800,
          height: 600,
          createdAt: '2024-01-16T10:00:00Z',
          updatedAt: '2024-01-16T10:00:00Z',
        },
      ];

      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_MEDIA_LIST,
            variables: { page: 1, pageSize: 20, keyword: undefined },
          },
          result: {
            data: {
              mediaList: {
                items: mockMediaItems,
                total: 2,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useMediaList(1, 20), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.mediaList).toBeDefined();
      expect(result.current.mediaList?.items).toHaveLength(2);
      expect(result.current.mediaList?.total).toBe(2);
      expect(result.current.mediaList?.items[0].originalName).toBe('test-image-1.jpg');
    });

    it('should handle pagination parameters', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_MEDIA_LIST,
            variables: { page: 2, pageSize: 10, keyword: undefined },
          },
          result: {
            data: {
              mediaList: {
                items: [],
                total: 15,
                page: 2,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useMediaList(2, 10), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.mediaList?.page).toBe(2);
      expect(result.current.mediaList?.pageSize).toBe(10);
    });

    it('should handle search keyword', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_MEDIA_LIST,
            variables: { page: 1, pageSize: 20, keyword: 'test' },
          },
          result: {
            data: {
              mediaList: {
                items: [
                  {
                    id: 1,
                    filename: 'test-image.jpg',
                    originalName: 'test-image.jpg',
                    mimeType: 'image/jpeg',
                    size: 1024,
                    url: 'http://localhost:3000/uploads/test-image.jpg',
                    width: 1920,
                    height: 1080,
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-01-15T10:00:00Z',
                  },
                ],
                total: 1,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useMediaList(1, 20, 'test'), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.mediaList?.items).toHaveLength(1);
      expect(result.current.mediaList?.items[0].originalName).toContain('test');
    });
  });

  describe('Error Path', () => {
    it('should handle empty media list', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_MEDIA_LIST,
            variables: { page: 1, pageSize: 20, keyword: undefined },
          },
          result: {
            data: {
              mediaList: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useMediaList(1, 20), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.mediaList?.items).toHaveLength(0);
      expect(result.current.mediaList?.total).toBe(0);
    });

    it('should handle network error', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_MEDIA_LIST,
            variables: { page: 1, pageSize: 20, keyword: undefined },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useMediaList(1, 20), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBeDefined();
      expect(result.current.mediaList).toBeUndefined();
    });
  });
});
