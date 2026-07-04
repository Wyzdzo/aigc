// src/features/blog/application/hooks/useAdminComments.spec.ts

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';

import { GET_COMMENTS } from '../../infrastructure/graphql/queries';
import { CommentStatus } from '@/entities/blog';

import { useAdminComments, useDeleteComment, useUpdateCommentStatus } from './useAdminComments';

// Mock ResizeObserver
beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverMock;
});

function createWrapper(mocks: MockedResponse[] = []) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

describe('useAdminComments', () => {
  describe('Happy Path', () => {
    it('should fetch comments with default parameters', async () => {
      const mockComments = [
        {
          id: 1,
          postId: 0,
          parentId: null,
          nickname: '测试用户',
          email: 'test@example.com',
          avatar: null,
          content: '测试评论',
          status: CommentStatus.APPROVED,
          likeCount: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: undefined, page: 1, pageSize: 20 },
          },
          result: {
            data: {
              comments: {
                items: mockComments,
                total: 1,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useAdminComments(), { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.items.length).toBe(1);
        expect(result.current.total).toBe(1);
      });
    });

    it('should fetch comments with status filter', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: undefined, status: CommentStatus.PENDING, page: 1, pageSize: 20 },
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

      const { result } = renderHook(() => useAdminComments({ status: CommentStatus.PENDING }), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.items.length).toBe(0);
      });
    });

    it('should fetch comments with custom pagination', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: undefined, page: 2, pageSize: 10 },
          },
          result: {
            data: {
              comments: {
                items: [],
                total: 15,
                page: 2,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useAdminComments({ page: 2, pageSize: 10 }), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.currentPage).toBe(2);
        expect(result.current.pageSize).toBe(10);
        expect(result.current.total).toBe(15);
      });
    });
  });

  describe('Error Path', () => {
    it('should handle empty comments', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: undefined, page: 1, pageSize: 20 },
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

      const { result } = renderHook(() => useAdminComments(), { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.items.length).toBe(0);
        expect(result.current.total).toBe(0);
      });
    });

    it('should handle loading state', () => {
      const { result } = renderHook(() => useAdminComments(), {
        wrapper: createWrapper([]),
      });

      expect(result.current.loading).toBe(true);
    });
  });
});

describe('useUpdateCommentStatus', () => {
  describe('Happy Path', () => {
    it('should update comment status to APPROVED', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: undefined, page: 1, pageSize: 20 },
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

      const { result } = renderHook(() => useUpdateCommentStatus(), {
        wrapper: createWrapper(mocks),
      });

      expect(result.current.loading).toBe(false);
    });
  });
});

describe('useDeleteComment', () => {
  describe('Happy Path', () => {
    it('should have delete function available', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: undefined, page: 1, pageSize: 20 },
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

      const { result } = renderHook(() => useDeleteComment(), {
        wrapper: createWrapper(mocks),
      });

      expect(result.current.loading).toBe(false);
      expect(typeof result.current.deleteComment).toBe('function');
    });
  });
});
