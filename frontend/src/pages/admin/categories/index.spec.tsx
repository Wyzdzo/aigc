// src/pages/admin/categories/index.spec.tsx

import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';

import { GET_CATEGORIES } from '@/features/blog/infrastructure/graphql/queries';

import { AdminCategoriesPage } from './index';

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

describe('AdminCategoriesPage', () => {
  describe('Happy Path', () => {
    it('should render page title', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('分类管理');
      });
    });

    it('should render category tree with parent and children', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [
                {
                  id: 1,
                  name: '技术博客',
                  slug: 'tech',
                  description: '技术相关文章',
                  parentId: null,
                  sortOrder: 0,
                  createdAt: '2024-01-15T10:00:00Z',
                  updatedAt: '2024-01-15T10:00:00Z',
                },
                {
                  id: 2,
                  name: '前端开发',
                  slug: 'frontend',
                  description: '前端技术',
                  parentId: 1,
                  sortOrder: 0,
                  createdAt: '2024-01-15T11:00:00Z',
                  updatedAt: '2024-01-15T11:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-tree')).toBeTruthy();
        expect(container.textContent).toContain('技术博客');
        expect(container.textContent).toContain('前端开发');
      });
    });

    it('should render add and refresh buttons', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        const buttons = container.querySelectorAll('.ant-btn');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
        expect(container.textContent).toContain('新增分类');
        expect(container.textContent).toContain('刷新');
      });
    });

    it('should render empty state when no categories', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无分类');
      });
    });
  });

  describe('Error Path', () => {
    it('should show loading state initially', () => {
      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper([]) });

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should show empty state when GraphQL query error occurs', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无分类');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should render nested category structure (3 levels)', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [
                {
                  id: 1,
                  name: 'Level 1',
                  slug: 'level1',
                  description: '',
                  parentId: null,
                  sortOrder: 0,
                  createdAt: '2024-01-15T10:00:00Z',
                  updatedAt: '2024-01-15T10:00:00Z',
                },
                {
                  id: 2,
                  name: 'Level 2',
                  slug: 'level2',
                  description: '',
                  parentId: 1,
                  sortOrder: 0,
                  createdAt: '2024-01-15T11:00:00Z',
                  updatedAt: '2024-01-15T11:00:00Z',
                },
                {
                  id: 3,
                  name: 'Level 3',
                  slug: 'level3',
                  description: '',
                  parentId: 2,
                  sortOrder: 0,
                  createdAt: '2024-01-15T12:00:00Z',
                  updatedAt: '2024-01-15T12:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('Level 1');
        expect(container.textContent).toContain('Level 2');
        expect(container.textContent).toContain('Level 3');
      });
    });

    it('should render edit and delete buttons for each category', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [
                {
                  id: 1,
                  name: '测试分类',
                  slug: 'test',
                  description: '',
                  parentId: null,
                  sortOrder: 0,
                  createdAt: '2024-01-15T10:00:00Z',
                  updatedAt: '2024-01-15T10:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('编辑');
        expect(container.textContent).toContain('删除');
      });
    });
  });
});
