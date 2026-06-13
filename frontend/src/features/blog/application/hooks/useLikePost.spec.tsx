// src/features/blog/application/hooks/useLikePost.spec.tsx
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LIKE_POST } from '../../infrastructure/graphql/mutations';
import { mockPosts } from '../../infrastructure/mock/mock';

import { useLikePost } from './useLikePost';

describe('useLikePost', () => {
  const mockPost = mockPosts[0];

  beforeEach(() => {
    vi.spyOn(message, 'success').mockClear();
    vi.spyOn(message, 'info').mockClear();
    vi.spyOn(message, 'error').mockClear();
  });

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

      const success = await result.current.likePost(mockPost.id);

      await waitFor(() => {
        expect(success).toBe(true);
      });

      expect(message.success).toHaveBeenCalledWith('点赞成功');
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
    it('should return false and show error message on mutation failure', async () => {
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

      const success = await result.current.likePost(mockPost.id);

      await waitFor(() => {
        expect(success).toBe(false);
      });

      expect(message.error).toHaveBeenCalledWith('点赞失败，请稍后重试');
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
      expect(firstLike).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const secondLike = await result.current.likePost(mockPost.id);
      expect(secondLike).toBe(false);

      expect(message.info).toHaveBeenCalledWith('您已经点过赞了');
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
      expect(like1).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const like2 = await result.current.likePost(postId2);
      expect(like2).toBe(true);
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
