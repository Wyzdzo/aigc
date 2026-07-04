import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CREATE_LINK, UPDATE_LINK, DELETE_LINK } from '../../infrastructure/graphql/mutations';

import { useCreateLink, useUpdateLink, useDeleteLink } from './useLinkMutations';

describe('useCreateLink', () => {
  describe('happy path', () => {
    it('should call CREATE_LINK mutation and return result', async () => {
      const params = {
        title: 'My Link',
        url: 'https://example.com',
        description: 'A test link',
      };

      const mocks = [
        {
          request: {
            query: CREATE_LINK,
            variables: params,
          },
          result: {
            data: {
              createLink: {
                id: 1,
                title: params.title,
                url: params.url,
                description: params.description,
                logo: null,
                status: 'ACTIVE',
                sortOrder: 0,
                createdAt: '2024-01-20T00:00:00.000Z',
                updatedAt: '2024-01-20T00:00:00.000Z',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useCreateLink(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const created = await result.current.createLink(params);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(created?.title).toBe(params.title);
      expect(created?.url).toBe(params.url);
    });
  });

  describe('error path', () => {
    it('should handle mutation error', async () => {
      const params = {
        title: 'My Link',
        url: 'https://example.com',
      };

      const mocks = [
        {
          request: {
            query: CREATE_LINK,
            variables: params,
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useCreateLink(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      let errorThrown = false;
      try {
        await result.current.createLink(params);
      } catch {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
    });
  });
});

describe('useUpdateLink', () => {
  describe('happy path', () => {
    it('should call UPDATE_LINK mutation and return result', async () => {
      const params = {
        id: 1,
        title: 'Updated Link',
        url: 'https://updated.com',
      };

      const mocks = [
        {
          request: {
            query: UPDATE_LINK,
            variables: params,
          },
          result: {
            data: {
              updateLink: {
                id: 1,
                title: params.title,
                url: params.url,
                description: null,
                logo: null,
                status: 'ACTIVE',
                sortOrder: 0,
                createdAt: '2024-01-20T00:00:00.000Z',
                updatedAt: '2024-01-21T00:00:00.000Z',
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useUpdateLink(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      const updated = await result.current.updateLink(params);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(updated?.title).toBe(params.title);
      expect(updated?.url).toBe(params.url);
    });
  });

  describe('error path', () => {
    it('should handle mutation error', async () => {
      const params = {
        id: 1,
        title: 'Updated Link',
      };

      const mocks = [
        {
          request: {
            query: UPDATE_LINK,
            variables: params,
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useUpdateLink(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      let errorThrown = false;
      try {
        await result.current.updateLink(params);
      } catch {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
    });
  });
});

describe('useDeleteLink', () => {
  describe('happy path', () => {
    it('should call DELETE_LINK mutation', async () => {
      const mocks = [
        {
          request: {
            query: DELETE_LINK,
            variables: { id: 1 },
          },
          result: {
            data: {
              deleteLink: true,
            },
          },
        },
      ];

      const { result } = renderHook(() => useDeleteLink(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      await result.current.deleteLink(1);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('error path', () => {
    it('should handle mutation error', async () => {
      const mocks = [
        {
          request: {
            query: DELETE_LINK,
            variables: { id: 1 },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useDeleteLink(), {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      });

      let errorThrown = false;
      try {
        await result.current.deleteLink(1);
      } catch {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
    });
  });
});
