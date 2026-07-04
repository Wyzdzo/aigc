import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CREATE_CATEGORY, UPDATE_CATEGORY } from '../../infrastructure/graphql/mutations';

import { useCreateCategory } from './useCreateCategory';
import { useUpdateCategory } from './useUpdateCategory';

describe('useCreateCategory', () => {
  describe('happy path', () => {
    it('should call CREATE_CATEGORY mutation with all fields', async () => {
      const params = {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech articles',
        sortOrder: 1,
      };

      const mocks = [
        {
          request: {
            query: CREATE_CATEGORY,
            variables: params,
          },
          result: {
            data: {
              createCategory: {
                id: 1,
                name: params.name,
                slug: params.slug,
                description: params.description,
                parentId: undefined,
                sortOrder: params.sortOrder,
                createdAt: '2024-01-20T00:00:00.000Z',
                updatedAt: '2024-01-20T00:00:00.000Z',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useCreateCategory(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const created = await result.current.createCategory(params);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(created?.name).toBe(params.name);
      expect(created?.slug).toBe(params.slug);
    });
  });

  describe('error path', () => {
    it('should handle mutation error', async () => {
      const params = {
        name: 'Technology',
        slug: 'technology',
      };

      const mocks = [
        {
          request: {
            query: CREATE_CATEGORY,
            variables: params,
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useCreateCategory(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      let errorThrown = false;
      try {
        await result.current.createCategory(params);
      } catch {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
    });
  });
});

describe('useUpdateCategory', () => {
  describe('happy path', () => {
    it('should call UPDATE_CATEGORY mutation with id and fields', async () => {
      const params = {
        id: 1,
        name: 'Updated Category',
        slug: 'updated-category',
        description: 'Updated description',
      };

      const mocks = [
        {
          request: {
            query: UPDATE_CATEGORY,
            variables: params,
          },
          result: {
            data: {
              updateCategory: {
                id: 1,
                name: params.name,
                slug: params.slug,
                description: params.description,
                parentId: null,
                sortOrder: 0,
                createdAt: '2024-01-20T00:00:00.000Z',
                updatedAt: '2024-01-21T00:00:00.000Z',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useUpdateCategory(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const updated = await result.current.updateCategory(params);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(updated?.name).toBe(params.name);
      expect(updated?.slug).toBe(params.slug);
    });
  });

  describe('error path', () => {
    it('should handle mutation error', async () => {
      const params = {
        id: 1,
        name: 'Updated Category',
      };

      const mocks = [
        {
          request: {
            query: UPDATE_CATEGORY,
            variables: params,
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useUpdateCategory(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      let errorThrown = false;
      try {
        await result.current.updateCategory(params);
      } catch {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
    });
  });
});
