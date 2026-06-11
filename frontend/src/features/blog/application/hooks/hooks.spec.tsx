// src/features/blog/application/hooks/hooks.spec.ts
import { describe, expect, it } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from './usePosts';
import { usePostById, usePostBySlug } from './usePost';
import { useCategories } from './useCategories';
import { useTags, usePostTags } from './useTags';
import { useComments, useCommentStats } from './useComments';
import { useLinks } from './useLinks';
import {
  GET_POSTS,
  GET_POST_BY_ID,
  GET_POST_BY_SLUG,
  GET_CATEGORIES,
  GET_TAGS,
  GET_POST_TAGS,
  GET_COMMENTS,
  GET_COMMENT_STATS,
  GET_LINKS,
} from '../../infrastructure/graphql/queries';
import { mockPosts, mockCategories, mockTags, mockComments, mockLinks } from '../../infrastructure/mock/mock';

describe('Blog Hooks', () => {
  describe('usePosts', () => {
    it('should return posts data with pagination', async () => {
      const mockPostsWithoutContent = mockPosts.map(({ content, ...rest }) => rest);
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { page: 1, pageSize: 5 },
          },
          result: {
            data: {
              posts: {
                items: mockPostsWithoutContent.slice(0, 5),
                total: mockPostsWithoutContent.length,
                page: 1,
                pageSize: 5,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => usePosts({ page: 1, pageSize: 5 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toHaveLength(5);
      expect(result.current.total).toBe(mockPostsWithoutContent.length);
      expect(result.current.currentPage).toBe(1);
    });

    it('should handle error gracefully', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { page: 1, pageSize: 10 },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => usePosts({ page: 1, pageSize: 10 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(result.current.posts).toEqual([]);
        expect(result.current.total).toBe(0);
      });
    });

    it('should return empty array when no posts found', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { page: 1, pageSize: 10 },
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

      const { result } = renderHook(() => usePosts({ page: 1, pageSize: 10 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.total).toBe(0);
    });

    it('should support category filtering', async () => {
      const mockPostsWithoutContent = mockPosts
        .filter(p => p.categoryId === 1)
        .map(({ content, ...rest }) => rest);
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { page: 1, pageSize: 10, categoryId: 1 },
          },
          result: {
            data: {
              posts: {
                items: mockPostsWithoutContent,
                total: mockPostsWithoutContent.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => usePosts({ page: 1, pageSize: 10, categoryId: 1 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toHaveLength(mockPostsWithoutContent.length);
    });
  });

  describe('usePostById', () => {
    it('should return post by id', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_ID,
            variables: { id: 1 },
          },
          result: {
            data: { post: mockPosts[0] },
          },
        },
      ];

      const { result } = renderHook(() => usePostById(1), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.post).toEqual(mockPosts[0]);
    });

    it('should skip query when id is undefined', () => {
      const { result } = renderHook(() => usePostById(undefined), {
        wrapper: ({ children }) => <MockedProvider mocks={[]}>{children}</MockedProvider>,
      });

      expect(result.current.post).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should return null when post not found', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_ID,
            variables: { id: 999 },
          },
          result: {
            data: { post: null },
          },
        },
      ];

      const { result } = renderHook(() => usePostById(999), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.post).toBeNull();
    });

    it('should handle error when fetching post', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_ID,
            variables: { id: 1 },
          },
          error: new Error('Database error'),
        },
      ];

      const { result } = renderHook(() => usePostById(1), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(result.current.post).toBeNull();
      });
    });
  });

  describe('usePostBySlug', () => {
    it('should return post by slug', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'first-post' },
          },
          result: {
            data: { postBySlug: mockPosts[0] },
          },
        },
      ];

      const { result } = renderHook(() => usePostBySlug('first-post'), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.post).toEqual(mockPosts[0]);
    });

    it('should skip query when slug is undefined', () => {
      const { result } = renderHook(() => usePostBySlug(undefined), {
        wrapper: ({ children }) => <MockedProvider mocks={[]}>{children}</MockedProvider>,
      });

      expect(result.current.post).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('useCategories', () => {
    it('should return categories', async () => {
      const mocks = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: mockCategories } },
        },
      ];

      const { result } = renderHook(() => useCategories(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.categories).toEqual(mockCategories);
    });
  });

  describe('useTags', () => {
    it('should return tags', async () => {
      const mocks = [
        {
          request: { query: GET_TAGS },
          result: { data: { tags: mockTags } },
        },
      ];

      const { result } = renderHook(() => useTags(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tags).toEqual(mockTags);
    });
  });

  describe('usePostTags', () => {
    it('should return tags for a post', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_TAGS,
            variables: { postId: 1 },
          },
          result: {
            data: { postTags: mockTags.slice(0, 3) },
          },
        },
      ];

      const { result } = renderHook(() => usePostTags(1), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tags).toEqual(mockTags.slice(0, 3));
    });
  });

  describe('useComments', () => {
    it('should return comments with pagination', async () => {
      const postComments = mockComments.filter(c => c.postId === 1);
      const mocks = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              comments: {
                items: postComments,
                total: postComments.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useComments({ postId: 1, page: 1, pageSize: 10 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toHaveLength(postComments.length);
      expect(result.current.total).toBe(postComments.length);
    });

    it('should return empty when no comments found', async () => {
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

      const { result } = renderHook(() => useComments({ postId: 999, page: 1, pageSize: 10 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.total).toBe(0);
    });

    it('should handle error when fetching comments', async () => {
      const mocks = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 1, pageSize: 10 },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useComments({ postId: 1, page: 1, pageSize: 10 }), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(result.current.items).toEqual([]);
      });
    });
  });

  describe('useCommentStats', () => {
    it('should return comment stats', async () => {
      const mocks = [
        {
          request: {
            query: GET_COMMENT_STATS,
            variables: { postId: 1 },
          },
          result: {
            data: {
              commentStats: { total: 10, pending: 2, approved: 7, rejected: 1 },
            },
          },
        },
      ];

      const { result } = renderHook(() => useCommentStats(1), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual({ total: 10, pending: 2, approved: 7, rejected: 1 });
    });
  });

  describe('useLinks', () => {
    it('should return links', async () => {
      const mocks = [
        {
          request: { query: GET_LINKS },
          result: { data: { links: mockLinks } },
        },
      ];

      const { result } = renderHook(() => useLinks(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.links).toEqual(mockLinks);
    });
  });
});