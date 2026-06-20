// src/pages/admin/comments.spec.tsx

import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';

import { GET_COMMENTS } from '@/features/blog';
import { CommentStatus } from '@/entities/blog';

import { AdminCommentsPage } from './comments';

// Mock ResizeObserver and matchMedia
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

describe('AdminCommentsPage', () => {
  describe('Happy Path', () => {
    it('should render page title', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 0, status: undefined, page: 1, pageSize: 20 },
          },
          result: {
            data: {
              comments: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { container } = render(<AdminCommentsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('评论管理');
      });
    });

    it('should render filter controls', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 0, status: undefined, page: 1, pageSize: 20 },
          },
          result: {
            data: {
              comments: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { container } = render(<AdminCommentsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-select')).toBeTruthy();
        expect(container.querySelector('input')).toBeTruthy();
      });
    });

    it('should render comments table', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 0, status: undefined, page: 1, pageSize: 20 },
          },
          result: {
            data: {
              comments: {
                items: [
                  {
                    __typename: 'BlogComment',
                    id: 1,
                    postId: 0,
                    parentId: null,
                    nickname: '测试用户',
                    email: 'test@example.com',
                    avatar: null,
                    content: '测试评论内容',
                    status: CommentStatus.APPROVED,
                    likeCount: 5,
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

      const { container } = render(<AdminCommentsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-table')).toBeTruthy();
        expect(container.textContent).toContain('测试用户');
        expect(container.textContent).toContain('test@example.com');
        expect(container.textContent).toContain('测试评论内容');
      });
    });

    it('should render empty state when no comments', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 0, status: undefined, page: 1, pageSize: 20 },
          },
          result: {
            data: {
              comments: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { container } = render(<AdminCommentsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无评论');
      });
    });
  });

  describe('Error Path', () => {
    it('should show loading state initially', () => {
      const { container } = render(<AdminCommentsPage />, { wrapper: createWrapper([]) });

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should show empty state when GraphQL query error occurs', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 0, status: undefined, page: 1, pageSize: 20 },
          },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<AdminCommentsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无评论');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should render different status tags', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 0, status: undefined, page: 1, pageSize: 20 },
          },
          result: {
            data: {
              comments: {
                items: [
                  {
                    __typename: 'BlogComment',
                    id: 1,
                    postId: 0,
                    parentId: null,
                    nickname: '用户A',
                    email: 'a@example.com',
                    avatar: null,
                    content: '待审核评论',
                    status: CommentStatus.PENDING,
                    likeCount: 0,
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-01-15T10:00:00Z',
                  },
                  {
                    __typename: 'BlogComment',
                    id: 2,
                    postId: 0,
                    parentId: null,
                    nickname: '用户B',
                    email: 'b@example.com',
                    avatar: null,
                    content: '已通过评论',
                    status: CommentStatus.APPROVED,
                    likeCount: 10,
                    createdAt: '2024-01-15T11:00:00Z',
                    updatedAt: '2024-01-15T11:00:00Z',
                  },
                  {
                    __typename: 'BlogComment',
                    id: 3,
                    postId: 0,
                    parentId: null,
                    nickname: '用户C',
                    email: 'c@example.com',
                    avatar: null,
                    content: '已拒绝评论',
                    status: CommentStatus.REJECTED,
                    likeCount: 0,
                    createdAt: '2024-01-15T12:00:00Z',
                    updatedAt: '2024-01-15T12:00:00Z',
                  },
                ],
                total: 3,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { container } = render(<AdminCommentsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('待审核');
        expect(container.textContent).toContain('已通过');
        expect(container.textContent).toContain('已拒绝');
      });
    });
  });

  describe('Action Buttons', () => {
    it('should show delete button for all comments', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 0, status: undefined, page: 1, pageSize: 20 },
          },
          result: {
            data: {
              comments: {
                items: [
                  {
                    __typename: 'BlogComment',
                    id: 1,
                    postId: 0,
                    parentId: null,
                    nickname: '测试用户',
                    email: 'test@example.com',
                    avatar: null,
                    content: '测试评论',
                    status: CommentStatus.APPROVED,
                    likeCount: 5,
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

      const { container } = render(<AdminCommentsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('删除');
      });
    });
  });
});
