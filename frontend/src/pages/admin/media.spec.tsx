// src/pages/admin/media.spec.tsx

import { render, waitFor, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';

import { AdminMediaPage } from './media';
import { GET_MEDIA_LIST } from '@/features/media/infrastructure/graphql/queries';

// Mock fetch
const mockFetch = vi.fn();
(globalThis as typeof globalThis & { fetch?: typeof mockFetch }).fetch = mockFetch;

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

  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(() => 'test-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

function createWrapper(mocks: MockedResponse[] = []) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockedProvider mocks={mocks}>
        <BrowserRouter>{children}</BrowserRouter>
      </MockedProvider>
    );
  };
}

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

describe('AdminMediaPage', () => {
  describe('Happy Path', () => {
    it('should render page title and upload button', async () => {
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

      render(<AdminMediaPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getByText('文件管理')).toBeTruthy();
        expect(screen.getByText('上传图片')).toBeTruthy();
      });
    });

    it('should render media cards with correct info', async () => {
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

      render(<AdminMediaPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getByText('test-image-1.jpg')).toBeTruthy();
        expect(screen.getByText('test-image-2.png')).toBeTruthy();
      });
    });

    it('should show pagination with total count', async () => {
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
                total: 50,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      render(<AdminMediaPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getByText('共 50 个文件')).toBeTruthy();
      });
    });

    it('should render refresh button', async () => {
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

      render(<AdminMediaPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        // Refresh button with icon
        const buttons = document.querySelectorAll('button');
        const refreshBtn = Array.from(buttons).find(btn => btn.textContent?.includes('刷新'));
        expect(refreshBtn).toBeTruthy();
      });
    });

    it('should render search input', async () => {
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

      render(<AdminMediaPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        // Search component wraps input with placeholder
        const searchInput = document.querySelector('input[placeholder="搜索文件名"]');
        expect(searchInput).toBeTruthy();
      });
    });
  });

  describe('Error Path', () => {
    it('should show empty state when no media', async () => {
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

      render(<AdminMediaPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getByText('暂无文件，上传一张图片开始使用')).toBeTruthy();
      });
    });

    it('should handle network error gracefully', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_MEDIA_LIST,
            variables: { page: 1, pageSize: 20, keyword: undefined },
          },
          error: new Error('Network error'),
        },
      ];

      render(<AdminMediaPage />, { wrapper: createWrapper(mocks) });

      // Component should render without crashing on error
      await new Promise(resolve => setTimeout(resolve, 500));
    });
  });
});
