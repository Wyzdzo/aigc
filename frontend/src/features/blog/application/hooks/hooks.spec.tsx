// src/features/blog/application/hooks/hooks.spec.ts
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PostStatus } from '@/entities/blog';

import {
  CREATE_POST,
  DELETE_CATEGORY,
  DELETE_TAG,
  UPDATE_POST,
} from '../../infrastructure/graphql/mutations';
import {
  GET_CATEGORIES,
  GET_COMMENT_STATS,
  GET_COMMENTS,
  GET_LINKS,
  GET_POST_BY_ID,
  GET_POST_BY_SLUG,
  GET_POST_TAGS,
  GET_POSTS,
  GET_TAGS,
} from '../../infrastructure/graphql/queries';
import { mockCategories, mockComments, mockLinks,mockPosts, mockTags } from '../../infrastructure/mock/mock';

import { useCategories } from './useCategories';
import { useComments, useCommentStats } from './useComments';
import { useCreatePost } from './useCreatePost';
import { useDeleteCategory } from './useDeleteCategory';
import { useDeleteTag } from './useDeleteTag';
import { useLinks } from './useLinks';
import { usePostById, usePostBySlug } from './usePost';
import { usePosts } from './usePosts';
import { usePostTags,useTags } from './useTags';
import { useUpdatePost } from './useUpdatePost';

describe('Blog Hooks', () => {
  describe('usePosts', () => {
    it('should return posts data with pagination', async () => {
      const mockPostsWithoutContent = mockPosts.map(({ ...rest }) => rest);
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
        .map(({ ...rest }) => rest);
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

  describe('useCreatePost', () => {
    it('should create post successfully', async () => {
      const newPost = {
        id: 100,
        title: 'Test New Post',
        slug: 'test-new-post',
        content: '<p>Test content</p>',
        summary: 'Test summary',
        coverImage: null,
        status: 'DRAFT',
        isTop: false,
        viewCount: 0,
        likeCount: 0,
        categoryId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mocks = [
        {
          request: {
            query: CREATE_POST,
            variables: {
              input: {
                title: 'Test New Post',
                slug: 'test-new-post',
                content: '<p>Test content</p>',
                summary: 'Test summary',
                categoryId: 1,
                status: 'DRAFT',
                isTop: false,
              },
            },
          },
          result: {
            data: { createPost: newPost },
          },
        },
      ];

      const { result } = renderHook(() => useCreatePost(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      const createdPost = await result.current.createPost({
        title: 'Test New Post',
        slug: 'test-new-post',
        content: '<p>Test content</p>',
        summary: 'Test summary',
        categoryId: 1,
        status: PostStatus.DRAFT,
        isTop: false,
      });

      expect(createdPost).toEqual(newPost);
    });

    it('should handle create post error', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_POST,
            variables: {
              input: {
                title: 'Test Post',
                slug: 'test-post',
                content: '<p>Content</p>',
              },
            },
          },
          error: new Error('Database error'),
        },
      ];

      const { result } = renderHook(() => useCreatePost(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await expect(
        result.current.createPost({
          title: 'Test Post',
          slug: 'test-post',
          content: '<p>Content</p>',
        }),
      ).rejects.toThrow();
    });
  });

  describe('useUpdatePost', () => {
    it('should update post successfully', async () => {
      const updatedPost = {
        id: 1,
        title: 'Updated Post',
        slug: 'updated-post',
        content: '<p>Updated content</p>',
        summary: 'Updated summary',
        coverImage: null,
        status: 'PUBLISHED',
        isTop: true,
        viewCount: 10,
        likeCount: 5,
        categoryId: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mocks = [
        {
          request: {
            query: UPDATE_POST,
            variables: {
              id: 1,
              input: {
                title: 'Updated Post',
                slug: 'updated-post',
                content: '<p>Updated content</p>',
                summary: 'Updated summary',
                status: 'PUBLISHED',
                isTop: true,
                categoryId: 2,
              },
            },
          },
          result: {
            data: { updatePost: updatedPost },
          },
        },
      ];

      const { result } = renderHook(() => useUpdatePost(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      const resultPost = await result.current.updatePost(1, {
        title: 'Updated Post',
        slug: 'updated-post',
        content: '<p>Updated content</p>',
        summary: 'Updated summary',
        status: PostStatus.PUBLISHED,
        isTop: true,
        categoryId: 2,
      });

      expect(resultPost).toEqual(updatedPost);
    });

    it('should handle update post error', async () => {
      const mocks = [
        {
          request: {
            query: UPDATE_POST,
            variables: {
              id: 999,
              input: {
                title: 'Non-existent Post',
              },
            },
          },
          error: new Error('Post not found'),
        },
      ];

      const { result } = renderHook(() => useUpdatePost(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await expect(
        result.current.updatePost(999, { title: 'Non-existent Post' }),
      ).rejects.toThrow();
    });
  });

  describe('useDeleteCategory', () => {
    it('should delete category successfully', async () => {
      const mocks = [
        {
          request: {
            query: DELETE_CATEGORY,
            variables: { id: 1 },
          },
          result: {
            data: { deleteCategory: true },
          },
        },
      ];

      const { result } = renderHook(() => useDeleteCategory(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      const deleted = await result.current.deleteCategory(1);
      expect(deleted).toBe(true);
    });

    it('should handle delete category error', async () => {
      const mocks = [
        {
          request: {
            query: DELETE_CATEGORY,
            variables: { id: 999 },
          },
          error: new Error('Category not found'),
        },
      ];

      const { result } = renderHook(() => useDeleteCategory(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await expect(result.current.deleteCategory(999)).rejects.toThrow();
    });

    it('should return false when delete fails', async () => {
      const mocks = [
        {
          request: {
            query: DELETE_CATEGORY,
            variables: { id: 1 },
          },
          result: {
            data: { deleteCategory: false },
          },
        },
      ];

      const { result } = renderHook(() => useDeleteCategory(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      const deleted = await result.current.deleteCategory(1);
      expect(deleted).toBe(false);
    });
  });

  describe('useDeleteTag', () => {
    it('should delete tag successfully', async () => {
      const mocks = [
        {
          request: {
            query: DELETE_TAG,
            variables: { id: 1 },
          },
          result: {
            data: { deleteTag: true },
          },
        },
      ];

      const { result } = renderHook(() => useDeleteTag(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      const deleted = await result.current.deleteTag(1);
      expect(deleted).toBe(true);
    });

    it('should handle delete tag error', async () => {
      const mocks = [
        {
          request: {
            query: DELETE_TAG,
            variables: { id: 999 },
          },
          error: new Error('Tag not found'),
        },
      ];

      const { result } = renderHook(() => useDeleteTag(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      await expect(result.current.deleteTag(999)).rejects.toThrow();
    });

    it('should return false when delete fails', async () => {
      const mocks = [
        {
          request: {
            query: DELETE_TAG,
            variables: { id: 1 },
          },
          result: {
            data: { deleteTag: false },
          },
        },
      ];

      const { result } = renderHook(() => useDeleteTag(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      const deleted = await result.current.deleteTag(1);
      expect(deleted).toBe(false);
    });
  });
});