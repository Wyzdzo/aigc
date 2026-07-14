import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CommentStatus } from '@/entities/blog';

import { GET_COMMENT_STATS, GET_COMMENTS } from '../../infrastructure/graphql/queries';

import { useCommentStats, useComments } from './useComments';

const { mockUseQuery } = vi.hoisted(() => ({
  mockUseQuery: vi.fn(),
}));

vi.mock('@apollo/client/react', () => ({
  useQuery: mockUseQuery,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('useComments', () => {
  it('should return comments when postId is a normal number', () => {
    const mockItems = [
      {
        id: 1,
        postId: 1,
        parentId: null,
        nickname: '张三',
        email: 'zhangsan@example.com',
        avatar: null,
        content: '很棒！',
        status: CommentStatus.APPROVED,
        likeCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockUseQuery.mockReturnValue({
      data: {
        comments: {
          items: mockItems,
          total: 1,
          page: 1,
          pageSize: 10,
        },
      },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useComments({ postId: 1 }));

    expect(mockUseQuery).toHaveBeenCalledWith(GET_COMMENTS, {
      variables: { postId: 1, status: CommentStatus.APPROVED, page: 1, pageSize: 10 },
      skip: false,
      fetchPolicy: 'cache-first',
    });

    expect(result.current.items).toEqual(mockItems);
    expect(result.current.total).toBe(1);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should NOT skip query when postId is 0 (guestbook)', () => {
    mockUseQuery.mockReturnValue({
      data: {
        comments: { items: [], total: 0, page: 1, pageSize: 10 },
      },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderHook(() => useComments({ postId: 0 }));

    const options = mockUseQuery.mock.calls[0][1];
    expect(options.skip).toBe(false);
    expect(options.variables.postId).toBe(0);
  });

  it('should skip query when postId is undefined', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useComments({}));

    const options = mockUseQuery.mock.calls[0][1];
    expect(options.skip).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('should return default values when data is undefined', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useComments({ postId: 1 }));

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.loading).toBe(true);
  });

  it('should pass default status APPROVED when no status specified', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderHook(() => useComments({ postId: 1 }));

    const options = mockUseQuery.mock.calls[0][1];
    expect(options.variables.status).toBe(CommentStatus.APPROVED);
  });

  it('should pass custom page and pageSize', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderHook(() => useComments({ postId: 1, page: 3, pageSize: 25 }));

    const options = mockUseQuery.mock.calls[0][1];
    expect(options.variables.page).toBe(3);
    expect(options.variables.pageSize).toBe(25);
  });
});

describe('useCommentStats', () => {
  it('should return stats for a post', () => {
    mockUseQuery.mockReturnValue({
      data: {
        commentStats: { total: 10, pending: 2, approved: 7, rejected: 1 },
      },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useCommentStats(1));

    expect(mockUseQuery).toHaveBeenCalledWith(GET_COMMENT_STATS, {
      variables: { postId: 1 },
      skip: false,
      fetchPolicy: 'cache-first',
    });

    expect(result.current.stats).toEqual({ total: 10, pending: 2, approved: 7, rejected: 1 });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should skip query when postId is undefined', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useCommentStats(undefined));

    const options = mockUseQuery.mock.calls[0][1];
    expect(options.skip).toBe(true);
    expect(result.current.stats).toEqual({ total: 0, pending: 0, approved: 0, rejected: 0 });
  });

  it('should NOT skip query when postId is 0 (guestbook)', () => {
    mockUseQuery.mockReturnValue({
      data: {
        commentStats: { total: 5, pending: 0, approved: 5, rejected: 0 },
      },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useCommentStats(0));

    const options = mockUseQuery.mock.calls[0][1];
    expect(options.skip).toBe(false);
    expect(options.variables.postId).toBe(0);
    expect(result.current.stats.total).toBe(5);
  });

  it('should return default zero stats when data is undefined', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useCommentStats(1));

    expect(result.current.stats).toEqual({ total: 0, pending: 0, approved: 0, rejected: 0 });
    expect(result.current.loading).toBe(true);
  });
});
