import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CREATE_TAG, UPDATE_TAG } from '../../infrastructure/graphql/mutations';

import { useCreateTag } from './useCreateTag';
import { useUpdateTag } from './useUpdateTag';

describe('useCreateTag', () => {
  describe('happy path', () => {
    it('should call CREATE_TAG mutation', async () => {
      const params = { name: 'TypeScript', slug: 'typescript' };

      const mocks = [
        {
          request: {
            query: CREATE_TAG,
            variables: params,
          },
          result: {
            data: {
              createTag: {
                id: 1,
                name: params.name,
                slug: params.slug,
                createdAt: '2024-01-20T00:00:00.000Z',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useCreateTag(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const created = await result.current.createTag(params);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(created?.name).toBe(params.name);
      expect(created?.slug).toBe(params.slug);
    });
  });

  describe('error path', () => {
    it('should handle mutation error', async () => {
      const params = { name: 'TypeScript', slug: 'typescript' };

      const mocks = [
        {
          request: {
            query: CREATE_TAG,
            variables: params,
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useCreateTag(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      let errorThrown = false;
      try {
        await result.current.createTag(params);
      } catch {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
    });
  });
});

describe('useUpdateTag', () => {
  describe('happy path', () => {
    it('should call UPDATE_TAG mutation', async () => {
      const params = { id: 1, name: 'Updated Tag', slug: 'updated-tag' };

      const mocks = [
        {
          request: {
            query: UPDATE_TAG,
            variables: params,
          },
          result: {
            data: {
              updateTag: {
                id: 1,
                name: params.name,
                slug: params.slug,
                createdAt: '2024-01-20T00:00:00.000Z',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useUpdateTag(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const updated = await result.current.updateTag(params);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(updated?.name).toBe(params.name);
      expect(updated?.slug).toBe(params.slug);
    });
  });

  describe('error path', () => {
    it('should handle mutation error', async () => {
      const params = { id: 1, name: 'Updated Tag' };

      const mocks = [
        {
          request: {
            query: UPDATE_TAG,
            variables: params,
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useUpdateTag(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      let errorThrown = false;
      try {
        await result.current.updateTag(params);
      } catch {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
    });
  });
});
