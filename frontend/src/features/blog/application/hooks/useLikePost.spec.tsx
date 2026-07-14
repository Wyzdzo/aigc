// src/features/blog/application/hooks/useLikePost.spec.tsx
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LIKE_POST } from '../../infrastructure/graphql/mutations';
import { mockPosts } from '../../infrastructure/mock/mock';

import { useLikePost } from './useLikePost';

describe('useLikePost', () => {
  const mockPost = mockPosts[0];

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('happy path', () => {
    it('should call mutation and return success on like', async () => {
      const mocks = [
        {
          request: {
            query: LIKE_POST,
            variables: { id: mockPost.id },
          },
          result: {
            data: {
              likePost: {
                ...mockPost,
                likeCount: mockPost.likeCount + 1,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useLikePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      expect(result.current.loading).toBe(false);

      const res = await result.current.likePost(mockPost.id);

      await waitFor(() => {
        expect(res).toBe('success');
      });
    });

    it('should return loading state while mutation is in progress', async () => {
      const mocks = [
        {
          request: {
            query: LIKE_POST,
            variables: { id: mockPost.id },
          },
          result: {
            data: {
              likePost: {
                ...mockPost,
                likeCount: mockPost.likeCount + 1,
              },
            },
          },
          delay: 100,
        },
      ];

      const { result } = renderHook(() => useLikePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      // Start mutation (don't await)
      const likePromise = result.current.likePost(mockPost.id);

      // Loading should be true while mutation is in progress
      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      }, { timeout: 2000 });

      await likePromise;

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('error path', () => {
    it('should return error on mutation failure', async () => {
      const mocks = [
        {
          request: {
            query: LIKE_POST,
            variables: { id: mockPost.id },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useLikePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const res = await result.current.likePost(mockPost.id);

      await waitFor(() => {
        expect(res).toBe('error');
      });
    });

    it('should block duplicate likes for same post', async () => {
      const mocks = [
        {
          request: {
            query: LIKE_POST,
            variables: { id: mockPost.id },
          },
          result: {
            data: {
              likePost: {
                ...mockPost,
                likeCount: mockPost.likeCount + 1,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useLikePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const firstLike = await result.current.likePost(mockPost.id);
      expect(firstLike).toBe('success');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const secondLike = await result.current.likePost(mockPost.id);
      expect(secondLike).toBe('already_liked');
    });

    it('should allow liking different posts', async () => {
      const postId1 = mockPosts[0].id;
      const postId2 = mockPosts[1].id;

      const mocks = [
        {
          request: {
            query: LIKE_POST,
            variables: { id: postId1 },
          },
          result: {
            data: {
              likePost: {
                ...mockPosts[0],
                likeCount: mockPosts[0].likeCount + 1,
              },
            },
          },
        },
        {
          request: {
            query: LIKE_POST,
            variables: { id: postId2 },
          },
          result: {
            data: {
              likePost: {
                ...mockPosts[1],
                likeCount: mockPosts[1].likeCount + 1,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useLikePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const like1 = await result.current.likePost(postId1);
      expect(like1).toBe('success');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const like2 = await result.current.likePost(postId2);
      expect(like2).toBe('success');
    });
  });

  describe('isLiked helper', () => {
    it('should return correct liked status', async () => {
      const mocks = [
        {
          request: {
            query: LIKE_POST,
            variables: { id: mockPost.id },
          },
          result: {
            data: {
              likePost: {
                ...mockPost,
                likeCount: mockPost.likeCount + 1,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useLikePost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      expect(result.current.isLiked(mockPost.id)).toBe(false);

      await result.current.likePost(mockPost.id);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isLiked(mockPost.id)).toBe(true);
      expect(result.current.isLiked(999)).toBe(false);
    });
  });
});
