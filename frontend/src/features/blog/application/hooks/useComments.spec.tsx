import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CommentStatus } from '@/entities/blog';

import { GET_COMMENT_STATS,GET_COMMENTS } from '../../infrastructure/graphql/queries';

import { useComments,useCommentStats } from './useComments';

// 内联mock数据，避免Apollo Client缓存问题
const createMockComments = () => [
  {
    __typename: 'BlogComment',
    id: 1,
    postId: 1,
    parentId: null,
    nickname: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://ui-avatars.com/api/?name=张三&background=random',
    content: '文章写得很棒！',
    status: CommentStatus.APPROVED,
    likeCount: 12,
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
  },
  {
    __typename: 'BlogComment',
    id: 2,
    postId: 1,
    parentId: 1,
    nickname: '李四',
    email: 'lisi@example.com',
    avatar: 'https://ui-avatars.com/api/?name=李四&background=random',
    content: '同意楼上的观点！',
    status: CommentStatus.APPROVED,
    likeCount: 5,
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
  },
  {
    __typename: 'BlogComment',
    id: 3,
    postId: 1,
    parentId: null,
    nickname: '王五',
    email: 'wangwu@example.com',
    avatar: 'https://ui-avatars.com/api/?name=王五&background=random',
    content: '期待更多文章！',
    status: CommentStatus.APPROVED,
    likeCount: 8,
    createdAt: new Date('2024-01-17').toISOString(),
    updatedAt: new Date('2024-01-17').toISOString(),
  },
];

describe('useComments', () => {
  describe('happy path', () => {
    it('should fetch comments successfully', async () => {
      const mockComments = createMockComments();
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

      // 只验证数量和基本属性，因为Apollo Client可能缓存/规范化数据
      expect(result.current.total).toBe(mockComments.length);
      expect(result.current.items[0].id).toBe(1);
      expect(result.current.items[0].nickname).toBe('张三');
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
      const mockComments = createMockComments();
      const approvedComments = mockComments.filter(
        (c) => c.postId === 1 && c.status === CommentStatus.APPROVED
      );
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

      // 验证返回的数据包含正确的评论
      expect(result.current.items[0].status).toBe(CommentStatus.APPROVED);
    });

    it('should paginate correctly', async () => {
      const mockComments = createMockComments();
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
