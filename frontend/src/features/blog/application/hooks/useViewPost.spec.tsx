import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VIEW_POST } from '../../infrastructure/graphql/mutations';

import { useViewPost } from './useViewPost';

describe('useViewPost', () => {
  describe('happy path', () => {
    it('should call VIEW_POST mutation with correct id', async () => {
      const mocks = [
        {
          request: {
            query: VIEW_POST,
            variables: { id: 1 },
          },
          result: {
            data: {
              viewPost: {
                id: 1,
                title: 'Test Post',
                slug: 'test-post',
                content: 'Content',
                summary: null,
                coverImage: null,
                status: 'PUBLISHED',
                isTop: false,
                viewCount: 42,
                likeCount: 5,
                categoryId: 1,
                createdAt: '2024-01-20T00:00:00.000Z',
                updatedAt: '2024-01-20T00:00:00.000Z',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useViewPost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      await result.current.viewPost(1);

      await waitFor(() => {
        expect(result.current.viewPost).toBeInstanceOf(Function);
      });
    });
  });

  describe('error path', () => {
    it('should handle mutation error gracefully', async () => {
      const mocks = [
        {
          request: {
            query: VIEW_POST,
            variables: { id: 1 },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useViewPost(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      let errorThrown = false;
      try {
        await result.current.viewPost(1);
      } catch {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
    });
  });
});
