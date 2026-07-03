// src/features/blog/application/hooks/usePost.spec.tsx
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GET_POST_BY_ID, GET_POST_BY_SLUG } from '../../infrastructure/graphql/queries';
import { mockPosts } from '../../infrastructure/mock/mock';

import { usePost, usePostById, usePostBySlug } from './usePost';

describe('usePost', () => {
  const mockPost = mockPosts[0];

  describe('happy path', () => {
    it('should return post when data is loaded', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_ID,
            variables: { id: mockPost.id },
          },
          result: {
            data: {
              post: mockPost,
            },
          },
        },
      ];

      const { result } = renderHook(() => usePost(mockPost.id), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.post).toEqual(mockPost);
      expect(result.current.error).toBeUndefined();
    });

    it('should skip query when id is undefined', () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_ID,
            variables: { id: 0 },
          },
          result: {
            data: {
              post: mockPost,
            },
          },
        },
      ];

      const { result } = renderHook(() => usePost(undefined), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.post).toBeUndefined();
    });
  });
});

describe('usePostById', () => {
  const mockPost = mockPosts[0];

  describe('happy path', () => {
    it('should return null when no data', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_ID,
            variables: { id: mockPost.id },
          },
          result: {
            data: {
              post: null,
            },
          },
        },
      ];

      const { result } = renderHook(() => usePostById(mockPost.id), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.post).toBeNull();
    });
  });
});

describe('usePostBySlug', () => {
  const mockPost = mockPosts[0];

  describe('happy path', () => {
    it('should return post by slug', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: mockPost.slug },
          },
          result: {
            data: {
              postBySlug: mockPost,
            },
          },
        },
      ];

      const { result } = renderHook(() => usePostBySlug(mockPost.slug), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.post).toEqual(mockPost);
      expect(result.current.error).toBeUndefined();
    });

    it('should skip query when slug is undefined', () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: '' },
          },
          result: {
            data: {
              postBySlug: mockPost,
            },
          },
        },
      ];

      const { result } = renderHook(() => usePostBySlug(undefined), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.post).toBeNull();
    });
  });
});
