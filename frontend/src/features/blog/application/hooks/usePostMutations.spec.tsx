// src/features/blog/application/hooks/usePostMutations.spec.tsx
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PostStatus } from '@/entities/blog';

import {
  CREATE_POST,
  DELETE_POST,
  PUBLISH_POST,
  UNPUBLISH_POST,
  UPDATE_POST,
} from '../../infrastructure/graphql/mutations';
import { mockPosts } from '../../infrastructure/mock/mock';

import { useCreatePost } from './useCreatePost';
import { useDeletePost } from './useDeletePost';
import { usePublishPost } from './usePublishPost';
import { useUnpublishPost } from './useUnpublishPost';
import { useUpdatePost } from './useUpdatePost';

const mockPost = mockPosts[0];

describe('useCreatePost', () => {
  describe('happy path', () => {
    it('should call createPost mutation', async () => {
      const input = {
        title: 'New Post',
        slug: 'new-post',
        content: 'Content',
        categoryId: 1,
      };

      const mocks = [
        {
          request: {
            query: CREATE_POST,
            variables: { input },
          },
          result: {
            data: {
              createPost: {
                id: 100,
                title: input.title,
                slug: input.slug,
                content: input.content,
                summary: null,
                coverImage: null,
                status: PostStatus.DRAFT,
                isTop: false,
                viewCount: 0,
                likeCount: 0,
                categoryId: input.categoryId,
                createdAt: new Date('2024-01-20'),
                updatedAt: new Date('2024-01-20'),
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useCreatePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const created = await result.current.createPost(input);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(created?.title).toBe(input.title);
      expect(created?.slug).toBe(input.slug);
    });
  });

  describe('error path', () => {
    it('should handle mutation error', async () => {
      const input = {
        title: 'New Post',
        slug: 'new-post',
        content: 'Content',
      };

      const mocks = [
        {
          request: {
            query: CREATE_POST,
            variables: { input },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useCreatePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      try {
        await result.current.createPost(input);
      } catch {
        // mutation rejects on network error
      }

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });
});

describe('useUpdatePost', () => {
  describe('happy path', () => {
    it('should call updatePost mutation', async () => {
      const input = {
        title: 'Updated Title',
      };

      const mocks = [
        {
          request: {
            query: UPDATE_POST,
            variables: { id: mockPost.id, input },
          },
          result: {
            data: {
              updatePost: {
                ...mockPost,
                title: input.title,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useUpdatePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const updated = await result.current.updatePost(mockPost.id, input);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(updated?.title).toBe(input.title);
    });
  });
});

describe('useDeletePost', () => {
  describe('happy path', () => {
    it('should call deletePost mutation and return result', async () => {
      const mocks = [
        {
          request: {
            query: DELETE_POST,
            variables: { id: mockPost.id },
          },
          result: {
            data: {
              deletePost: true,
            },
          },
        },
      ];

      const { result } = renderHook(() => useDeletePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const deleted = await result.current.deletePost(mockPost.id);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(deleted).toBe(true);
    });

    it('should return loading state', async () => {
      const mocks = [
        {
          request: {
            query: DELETE_POST,
            variables: { id: mockPost.id },
          },
          result: {
            data: {
              deletePost: true,
            },
          },
          delay: 100,
        },
      ];

      const { result } = renderHook(() => useDeletePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const deletePromise = result.current.deletePost(mockPost.id);

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      }, { timeout: 2000 });

      await deletePromise;

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});

describe('usePublishPost', () => {
  describe('happy path', () => {
    it('should call publishPost mutation', async () => {
      const mocks = [
        {
          request: {
            query: PUBLISH_POST,
            variables: { id: mockPost.id },
          },
          result: {
            data: {
              publishPost: true,
            },
          },
        },
      ];

      const { result } = renderHook(() => usePublishPost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      await result.current.publishPost(mockPost.id);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});

describe('useUnpublishPost', () => {
  describe('happy path', () => {
    it('should call unpublishPost mutation', async () => {
      const mocks = [
        {
          request: {
            query: UNPUBLISH_POST,
            variables: { id: mockPost.id },
          },
          result: {
            data: {
              unpublishPost: true,
            },
          },
        },
      ];

      const { result } = renderHook(() => useUnpublishPost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      await result.current.unpublishPost(mockPost.id);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});
