// src/pages/admin/media.spec.tsx

import { render, waitFor, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';

import { AdminMediaPage } from './media';
import { GET_MEDIA_LIST } from '@/features/media';

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
  cleanup();
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
    url: '/uploads/test-image-1.jpg',
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
    url: '/uploads/test-image-2.png',
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
        expect(screen.getByText('图片库')).toBeTruthy();
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

    it('should display file size in human-readable format', async () => {
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
        // 1024 * 100 = 102400 bytes -> "100.0 KB"
        expect(screen.getAllByText(/100\.0 KB/).length).toBeGreaterThan(0);
        // 2048 * 200 = 409600 bytes -> "400.0 KB"
        expect(screen.getAllByText(/400\.0 KB/).length).toBeGreaterThan(0);
      });
    });

    it('should show image dimensions', async () => {
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
        expect(screen.getAllByText(/1920 x 1080/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/800 x 600/).length).toBeGreaterThan(0);
      });
    });

    it('should render delete confirmation (Popconfirm)', async () => {
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
        expect(screen.getAllByText('test-image-1.jpg').length).toBeGreaterThan(0);
      });

      // Click the delete button to trigger Popconfirm popup
      const deleteButton = document.querySelector('.anticon-delete')?.closest('button');
      expect(deleteButton).toBeTruthy();
      fireEvent.click(deleteButton!);

      // Popconfirm content should now appear in the DOM
      await waitFor(() => {
        expect(screen.getByText('确定删除这张图片吗？')).toBeTruthy();
      });
    });

    it('should render copy link button', async () => {
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
        expect(screen.getAllByText('test-image-1.jpg').length).toBeGreaterThan(0);
      });

      // Copy link buttons with CopyOutlined icon exist
      const copyButtons = document.querySelectorAll('.anticon-copy');
      expect(copyButtons.length).toBeGreaterThan(0);
    });

    it('should render preview button', async () => {
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
        expect(screen.getAllByText('test-image-1.jpg').length).toBeGreaterThan(0);
      });

      // Preview buttons with EyeOutlined icon exist
      const previewButtons = document.querySelectorAll('.anticon-eye');
      expect(previewButtons.length).toBeGreaterThan(0);
    });

    it('should open preview modal when clicking preview button', async () => {
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
        expect(screen.getAllByText('test-image-1.jpg').length).toBeGreaterThan(0);
      });

      // Click the first preview button
      const previewButton = document.querySelector('.anticon-eye')?.closest('button');
      expect(previewButton).toBeTruthy();
      fireEvent.click(previewButton!);

      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
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
        expect(screen.getByText('暂无图片，上传一张开始使用')).toBeTruthy();
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

    it('should show error result when GraphQL query fails', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_MEDIA_LIST,
            variables: { page: 1, pageSize: 20, keyword: undefined },
          },
          error: new Error('GraphQL error'),
        },
      ];

      render(<AdminMediaPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText('加载图片列表失败').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });

    it('should show retry button in error state', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_MEDIA_LIST,
            variables: { page: 1, pageSize: 20, keyword: undefined },
          },
          error: new Error('GraphQL error'),
        },
      ];

      render(<AdminMediaPage />, { wrapper: createWrapper(mocks) });

      // Wait for error result to render first
      await waitFor(() => {
        expect(screen.getAllByText('加载图片列表失败').length).toBeGreaterThan(0);
      }, { timeout: 5000 });

      // Then check for retry button (Ant Design may render button text with spaces between characters)
      const retryButton = screen.getByRole('button', { name: /重\s*试/ });
      expect(retryButton).toBeTruthy();
    });

    it('should handle upload failure gracefully', async () => {
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

      // Mock fetch to return non-ok response
      mockFetch.mockResolvedValueOnce({ ok: false });

      render(<AdminMediaPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText('上传图片').length).toBeGreaterThan(0);
      });

      // Trigger upload via the Upload component's beforeUpload
      const uploadInput = document.querySelector('input[type="file"]');
      expect(uploadInput).toBeTruthy();

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(uploadInput!, 'files', { value: [file], configurable: true });
      fireEvent.change(uploadInput!);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Verify the upload was attempted (fetch was called)
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });
  });
});
