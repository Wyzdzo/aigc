// src/pages/admin/posts/index.spec.tsx

import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';

import { GET_POSTS } from '@/features/blog';
import { PostStatus } from '@/entities/blog';

import { AdminPostsPage } from './index';

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

  vi.spyOn(window, 'open').mockImplementation(() => null);
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

describe('AdminPostsPage', () => {
  describe('Happy Path', () => {
    it('should render page title', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: undefined, keyword: '', page: 1, pageSize: 20 },
          },
          result: {
            data: {
              posts: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { container } = render(<AdminPostsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('文章管理');
      });
    });

    it('should render filter controls', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: undefined, keyword: '', page: 1, pageSize: 20 },
          },
          result: {
            data: {
              posts: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { container } = render(<AdminPostsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-select')).toBeTruthy();
        expect(container.querySelector('input')).toBeTruthy();
      });
    });

    it('should render posts table with data', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: undefined, keyword: '', page: 1, pageSize: 20 },
          },
          result: {
            data: {
              posts: {
                items: [
                  {
                    id: 1,
                    title: '测试文章标题',
                    slug: 'test-post',
                    content: '<p>测试内容</p>',
                    summary: '测试摘要',
                    coverImage: null,
                    status: PostStatus.PUBLISHED,
                    isTop: false,
                    viewCount: 100,
                    likeCount: 10,
                    categoryId: 1,
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

      const { container } = render(<AdminPostsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-table')).toBeTruthy();
        expect(container.textContent).toContain('测试文章标题');
        expect(container.textContent).toContain('已发布');
      });
    });

    it('should render post status tags correctly', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: undefined, keyword: '', page: 1, pageSize: 20 },
          },
          result: {
            data: {
              posts: {
                items: [
                  {
                    id: 1,
                    title: '草稿文章',
                    slug: 'draft-post',
                    content: '<p>草稿内容</p>',
                    summary: null,
                    coverImage: null,
                    status: PostStatus.DRAFT,
                    isTop: false,
                    viewCount: 0,
                    likeCount: 0,
                    categoryId: null,
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-01-15T10:00:00Z',
                  },
                  {
                    id: 2,
                    title: '已发布文章',
                    slug: 'published-post',
                    content: '<p>已发布内容</p>',
                    summary: '已发布摘要',
                    coverImage: null,
                    status: PostStatus.PUBLISHED,
                    isTop: true,
                    viewCount: 200,
                    likeCount: 25,
                    categoryId: 1,
                    createdAt: '2024-01-14T08:00:00Z',
                    updatedAt: '2024-01-14T09:00:00Z',
                  },
                ],
                total: 2,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { container } = render(<AdminPostsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('草稿');
        expect(container.textContent).toContain('已发布');
      });
    });
  });

  describe('Error Path', () => {
    it('should show loading state initially', () => {
      const { container } = render(<AdminPostsPage />, { wrapper: createWrapper([]) });

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should render empty state when no posts', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: undefined, keyword: '', page: 1, pageSize: 20 },
          },
          result: {
            data: {
              posts: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { container } = render(<AdminPostsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无文章');
      });
    });

    it('should show empty state when GraphQL query error occurs', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: undefined, keyword: '', page: 1, pageSize: 20 },
          },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<AdminPostsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无文章');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should render table with pagination', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: undefined, keyword: '', page: 1, pageSize: 20 },
          },
          result: {
            data: {
              posts: {
                items: [
                  {
                    id: 1,
                    title: '分页测试文章',
                    slug: 'pagination-test',
                    content: '<p>内容</p>',
                    summary: null,
                    coverImage: null,
                    status: PostStatus.PUBLISHED,
                    isTop: false,
                    viewCount: 0,
                    likeCount: 0,
                    categoryId: null,
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-01-15T10:00:00Z',
                  },
                ],
                total: 100,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { container } = render(<AdminPostsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-pagination')).toBeTruthy();
        expect(container.textContent).toContain('共 100 条');
      });
    });

    it('should display action buttons', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: undefined, keyword: '', page: 1, pageSize: 20 },
          },
          result: {
            data: {
              posts: {
                items: [
                  {
                    id: 1,
                    title: '测试文章',
                    slug: 'test',
                    content: '<p>内容</p>',
                    summary: null,
                    coverImage: null,
                    status: PostStatus.PUBLISHED,
                    isTop: false,
                    viewCount: 0,
                    likeCount: 0,
                    categoryId: null,
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

      const { container } = render(<AdminPostsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('预览');
        expect(container.textContent).toContain('编辑');
        expect(container.textContent).toContain('删除');
      });
    });
  });
});
