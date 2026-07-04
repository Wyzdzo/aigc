// src/pages/blog/category/[id].spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { GET_CATEGORIES, GET_POSTS } from '@/features/blog';
import { PostStatus } from '@/entities/blog';

import { BlogCategoryPage } from './[id]';

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

function createWrapper(mocks: MockedResponse[], categoryId = '1') {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={[`/blog/category/${categoryId}`]}>
          <Routes>
            <Route path="/blog/category/:id" element={children} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );
  };
}

const mockCategories = [
  {
    __typename: 'BlogCategory',
    id: 1,
    name: '前端开发',
    slug: 'frontend',
    description: '前端开发相关技术文章',
    parentId: null,
    sortOrder: 0,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockPostsItems = [
  {
    __typename: 'BlogPost',
    id: 1,
    title: 'React 18 新特性详解',
    slug: 'react-18-new-features',
    summary: 'React 18 带来了并发渲染、自动批处理、Suspense 改进等重要特性。',
    coverImage: 'https://via.placeholder.com/800x400',
    status: PostStatus.PUBLISHED,
    isTop: true,
    viewCount: 1234,
    likeCount: 56,
    categoryId: 1,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

describe('BlogCategoryPage', () => {
  describe('Happy Path', () => {
    it('should render category name as title', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_CATEGORIES,
          },
          result: {
            data: { categories: mockCategories },
          },
        },
        {
          request: {
            query: GET_POSTS,
            variables: { categoryId: 1, status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPostsItems,
                total: 1,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      render(<BlogCategoryPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText('前端开发').length).toBeGreaterThan(0);
      });
    });

    it('should render post list for the category', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_CATEGORIES,
          },
          result: {
            data: { categories: mockCategories },
          },
        },
        {
          request: {
            query: GET_POSTS,
            variables: { categoryId: 1, status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPostsItems,
                total: 1,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      render(<BlogCategoryPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText('React 18 新特性详解').length).toBeGreaterThan(0);
      });
    });

    it('should render breadcrumb navigation', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_CATEGORIES,
          },
          result: {
            data: { categories: mockCategories },
          },
        },
        {
          request: {
            query: GET_POSTS,
            variables: { categoryId: 1, status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPostsItems,
                total: 1,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogCategoryPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-breadcrumb')).toBeTruthy();
      });
    });

    it('should render empty state when category has no posts', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_CATEGORIES,
          },
          result: {
            data: { categories: mockCategories },
          },
        },
        {
          request: {
            query: GET_POSTS,
            variables: { categoryId: 1, status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      render(<BlogCategoryPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText('该分类下暂无文章').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Path', () => {
    it('should render invalid category state for non-numeric id', async () => {
      const mocks: MockedResponse[] = [];

      render(<BlogCategoryPage />, { wrapper: createWrapper(mocks, 'abc') });

      await waitFor(() => {
        expect(screen.getAllByText('无效的分类链接').length).toBeGreaterThan(0);
      });
    });

    it('should show loading state initially', () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_CATEGORIES,
          },
          result: {
            data: { categories: mockCategories },
          },
          delay: 10000,
        },
        {
          request: {
            query: GET_POSTS,
            variables: { categoryId: 1, status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 10,
              },
            },
          },
          delay: 10000,
        },
      ];

      const { container } = render(<BlogCategoryPage />, { wrapper: createWrapper(mocks) });

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });
  });
});
