// src/pages/admin/tags/index.spec.tsx

import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';

import { GET_TAGS } from '@/features/blog/infrastructure/graphql/queries';

import { AdminTagsPage } from './index';

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

function createWrapper(mocks: MockedResponse[] = []) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockedProvider mocks={mocks}>
        <BrowserRouter>{children}</BrowserRouter>
      </MockedProvider>
    );
  };
}

describe('AdminTagsPage', () => {
  describe('Happy Path', () => {
    it('should render page title', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('标签管理');
      });
    });

    it('should render tags table with columns', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [
                {
                  id: 1,
                  name: 'React',
                  slug: 'react',
                  createdAt: '2024-01-15T10:00:00Z',
                },
                {
                  id: 2,
                  name: 'TypeScript',
                  slug: 'typescript',
                  createdAt: '2024-01-15T11:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-table')).toBeTruthy();
        expect(container.textContent).toContain('React');
        expect(container.textContent).toContain('TypeScript');
        expect(container.textContent).toContain('标签名称');
        expect(container.textContent).toContain('标签别名');
        expect(container.textContent).toContain('创建时间');
        expect(container.textContent).toContain('操作');
      });
    });

    it('should render add and refresh buttons', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        const buttons = container.querySelectorAll('.ant-btn');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
        expect(container.textContent).toContain('新增标签');
        expect(container.textContent).toContain('刷新');
      });
    });

    it('should render empty state when no tags', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无标签');
      });
    });
  });

  describe('Error Path', () => {
    it('should show loading state initially', () => {
      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper([]) });

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should show empty state when GraphQL query error occurs', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无标签');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should render edit and delete buttons for each tag', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [
                {
                  id: 1,
                  name: '测试标签',
                  slug: 'test-tag',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('编辑');
        expect(container.textContent).toContain('删除');
      });
    });

    it('should handle special characters in tag names', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [
                {
                  id: 1,
                  name: 'AI & Machine Learning',
                  slug: 'ai-ml',
                  createdAt: '2024-01-15T10:00:00Z',
                },
                {
                  id: 2,
                  name: 'Web 前端开发',
                  slug: 'web-frontend',
                  createdAt: '2024-01-15T11:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('AI & Machine Learning');
        expect(container.textContent).toContain('Web 前端开发');
      });
    });
  });
});
