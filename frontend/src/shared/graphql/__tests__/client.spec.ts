// src/shared/graphql/__tests__/client.spec.ts

import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  configureGraphQLRuntime,
  getGraphQLClient,
  getGraphQLRuntimeConfig,
  resetGraphQLCache,
} from '../client';

describe('GraphQL Client', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000');
    vi.stubEnv('VITE_PUBLIC_URL', 'http://localhost:3000');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('configureGraphQLRuntime', () => {
    it('should configure runtime config', () => {
      const getAccessToken = vi.fn().mockReturnValue('test-token');
      const refreshSession = vi.fn();
      const onAuthFailure = vi.fn();

      configureGraphQLRuntime({
        getAccessToken,
        refreshSession,
        onAuthFailure,
      });

      const config = getGraphQLRuntimeConfig();
      expect(config.getAccessToken).toBe(getAccessToken);
      expect(config.refreshSession).toBe(refreshSession);
      expect(config.onAuthFailure).toBe(onAuthFailure);
    });

    it('should merge with existing config', () => {
      const getAccessToken = vi.fn().mockReturnValue('test-token');
      configureGraphQLRuntime({ getAccessToken });

      const refreshSession = vi.fn();
      configureGraphQLRuntime({ refreshSession });

      const config = getGraphQLRuntimeConfig();
      expect(config.getAccessToken).toBe(getAccessToken);
      expect(config.refreshSession).toBe(refreshSession);
    });

    it('should handle undefined config values', () => {
      configureGraphQLRuntime({
        getAccessToken: undefined,
      });

      const config = getGraphQLRuntimeConfig();
      // Should not throw and should keep existing config
      expect(config).toBeDefined();
    });
  });

  describe('getGraphQLClient', () => {
    it('should return singleton client', () => {
      const client1 = getGraphQLClient();
      const client2 = getGraphQLClient();

      expect(client1).toBe(client2);
      expect(client1).toBeInstanceOf(ApolloClient);
    });

    it('should have cache-first fetch policy by default', () => {
      const client = getGraphQLClient();
      expect(client.defaultOptions.watchQuery?.fetchPolicy).toBe('cache-first');
      expect(client.defaultOptions.query?.fetchPolicy).toBe('cache-first');
    });

    it('should have InMemoryCache', () => {
      const client = getGraphQLClient();
      expect(client.cache).toBeInstanceOf(InMemoryCache);
    });
  });

  describe('resetGraphQLCache', () => {
    it('should reset store when client exists', async () => {
      const client = getGraphQLClient();
      const resetStoreSpy = vi.spyOn(client, 'resetStore').mockResolvedValue(undefined as never);

      resetGraphQLCache();

      expect(resetStoreSpy).toHaveBeenCalled();

      resetStoreSpy.mockRestore();
    });
  });

  describe('Cache Behavior', () => {
    it('should cache query results', async () => {
      const client = getGraphQLClient();

      // Mock a query response
      const mockData = {
        posts: {
          items: [
            { id: 1, title: 'Test Post', __typename: 'BlogPostDTO' },
          ],
          total: 1,
          page: 1,
          pageSize: 10,
          __typename: 'PaginatedPosts',
        },
      };

      // Write directly to cache
      client.writeQuery({
        query: gql`
          query GetPosts {
            posts {
              items {
                id
                title
              }
              total
              page
              pageSize
            }
          }
        `,
        data: mockData,
      });

      // Read from cache
      const cachedData = client.readQuery({
        query: gql`
          query GetPosts {
            posts {
              items {
                id
                title
              }
              total
              page
              pageSize
            }
          }
        `,
      });

      expect(cachedData).toEqual(mockData);
    });

    it('should normalize entities by id', () => {
      const client = getGraphQLClient();
      const cache = client.cache as InMemoryCache;

      // Write a post to cache
      const post = { id: 1, title: 'Test Post', __typename: 'BlogPostDTO' };
      const cacheId = cache.identify(post);

      // Cache ID format includes the key fields
      expect(cacheId).toContain('BlogPostDTO');
    });

    it('should normalize category by id', () => {
      const client = getGraphQLClient();
      const cache = client.cache as InMemoryCache;

      const category = { id: 1, name: 'Test Category', __typename: 'BlogCategoryDTO' };
      const cacheId = cache.identify(category);

      expect(cacheId).toContain('BlogCategoryDTO');
    });

    it('should normalize tag by id', () => {
      const client = getGraphQLClient();
      const cache = client.cache as InMemoryCache;

      const tag = { id: 1, name: 'Test Tag', __typename: 'BlogTagDTO' };
      const cacheId = cache.identify(tag);

      expect(cacheId).toContain('BlogTagDTO');
    });

    it('should normalize comment by id', () => {
      const client = getGraphQLClient();
      const cache = client.cache as InMemoryCache;

      const comment = { id: 1, content: 'Test Comment', __typename: 'BlogCommentDTO' };
      const cacheId = cache.identify(comment);

      expect(cacheId).toContain('BlogCommentDTO');
    });

    it('should normalize link by id', () => {
      const client = getGraphQLClient();
      const cache = client.cache as InMemoryCache;

      const link = { id: 1, title: 'Test Link', __typename: 'BlogLinkDTO' };
      const cacheId = cache.identify(link);

      expect(cacheId).toContain('BlogLinkDTO');
    });

    it('should return undefined for entity without typename', () => {
      const client = getGraphQLClient();
      const cache = client.cache as InMemoryCache;

      const entity = { id: 1, title: 'Test' };
      const cacheId = cache.identify(entity);

      expect(cacheId).toBeUndefined();
    });

    it('should handle paginated posts merge', () => {
      const client = getGraphQLClient();

      // First page
      const page1 = {
        posts: {
          items: [
            { id: 1, title: 'Post 1', __typename: 'BlogPostDTO' },
            { id: 2, title: 'Post 2', __typename: 'BlogPostDTO' },
          ],
          total: 4,
          page: 1,
          pageSize: 2,
          __typename: 'PaginatedPosts',
        },
      };

      // Write first page
      client.writeQuery({
        query: gql`
          query GetPosts($page: Int) {
            posts(page: $page) {
              items {
                id
                title
              }
              total
              page
              pageSize
            }
          }
        `,
        data: page1,
        variables: { page: 1 },
      });

      // Read from cache
      const cachedPage1 = client.readQuery<{
        posts: { items: { id: number; title: string }[]; total: number; page: number; pageSize: number };
      }>({
        query: gql`
          query GetPosts($page: Int) {
            posts(page: $page) {
              items {
                id
                title
              }
              total
              page
              pageSize
            }
          }
        `,
        variables: { page: 1 },
      });

      expect(cachedPage1?.posts?.items).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty query data', () => {
      const client = getGraphQLClient();

      const cachedData = client.readQuery<{ empty: unknown }>({
        query: gql`
          query GetEmpty {
            empty
          }
        `,
      });

      // Apollo Client returns null for missing data
      expect(cachedData).toBeNull();
    });

    it('should handle null data in cache', () => {
      const client = getGraphQLClient();

      // Write null to cache
      client.writeQuery<{ nullField: unknown }>({
        query: gql`
          query GetNull {
            nullField
          }
        `,
        data: { nullField: null },
      });

      const cachedData = client.readQuery<{ nullField: unknown }>({
        query: gql`
          query GetNull {
            nullField
          }
        `,
      });

      expect(cachedData?.nullField).toBeNull();
    });
  });
});