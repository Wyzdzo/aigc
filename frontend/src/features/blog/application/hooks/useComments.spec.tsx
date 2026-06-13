import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CommentStatus } from '@/entities/blog';

import { GET_COMMENT_STATS,GET_COMMENTS } from '../../infrastructure/graphql/queries';
import { mockComments } from '../../infrastructure/mock/mock';

import { useComments,useCommentStats } from './useComments';

describe('useComments', () => {
  describe('happy path', () => {
    it('should fetch comments successfully', async () => {
      const mocks = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              comments: {
                items: mockComments,
                total: mockComments.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useComments({ postId: 1 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(mockComments.length);
      });

      expect(result.current.items).toEqual(mockComments);
      expect(result.current.total).toBe(mockComments.length);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeUndefined();
    });

    it('should return empty items when no comments', async () => {
      const mocks = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 999, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              comments: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useComments({ postId: 999 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.total).toBe(0);
    });

    it('should filter by status', async () => {
      const approvedComments = mockComments.filter((c) => c.status === CommentStatus.APPROVED);
      const mocks = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, status: CommentStatus.APPROVED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              comments: {
                items: approvedComments,
                total: approvedComments.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { result } = renderHook(
        () => useComments({ postId: 1, status: CommentStatus.APPROVED }),
        {
          wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
        },
      );

      await waitFor(() => {
        expect(result.current.items.length).toBe(approvedComments.length);
      });

      expect(result.current.items).toEqual(approvedComments);
    });

    it('should paginate correctly', async () => {
      const mocks = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 2, pageSize: 2 },
          },
          result: {
            data: {
              comments: {
                items: mockComments.slice(0, 2),
                total: mockComments.length,
                page: 2,
                pageSize: 2,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useComments({ postId: 1, page: 2, pageSize: 2 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.pageSize).toBe(2);
    });
  });

  describe('error path', () => {
    it('should handle query error', async () => {
      const mocks = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 1, pageSize: 10 },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useComments({ postId: 1 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('skip behavior', () => {
    it('should skip query when postId is not provided', () => {
      const { result } = renderHook(() => useComments({}), {
        wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeUndefined();
    });
  });
});

describe('useCommentStats', () => {
  describe('happy path', () => {
    it('should fetch comment stats successfully', async () => {
      const mocks = [
        {
          request: {
            query: GET_COMMENT_STATS,
            variables: { postId: 1 },
          },
          result: {
            data: {
              commentStats: {
                total: 10,
                pending: 2,
                approved: 7,
                rejected: 1,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useCommentStats(1), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.stats.total).toBe(10);
      });

      expect(result.current.stats.total).toBe(10);
      expect(result.current.stats.pending).toBe(2);
      expect(result.current.stats.approved).toBe(7);
      expect(result.current.stats.rejected).toBe(1);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('error path', () => {
    it('should handle query error', async () => {
      const mocks = [
        {
          request: {
            query: GET_COMMENT_STATS,
            variables: { postId: 1 },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useCommentStats(1), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.stats.total).toBe(0);
      expect(result.current.stats.pending).toBe(0);
      expect(result.current.stats.approved).toBe(0);
      expect(result.current.stats.rejected).toBe(0);
    });
  });

  describe('skip behavior', () => {
    it('should return default stats when postId is undefined', () => {
      const { result } = renderHook(() => useCommentStats(undefined), {
        wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
      });

      expect(result.current.stats.total).toBe(0);
      expect(result.current.stats.pending).toBe(0);
      expect(result.current.stats.approved).toBe(0);
      expect(result.current.stats.rejected).toBe(0);
      expect(result.current.loading).toBe(false);
    });
  });
});
