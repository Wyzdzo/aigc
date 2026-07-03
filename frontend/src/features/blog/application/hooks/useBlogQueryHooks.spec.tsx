// src/features/blog/application/hooks/useBlogQueryHooks.spec.tsx
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  GET_ACTIVE_LINKS,
  GET_CATEGORIES,
  GET_CATEGORY_TREE,
  GET_LINKS,
  GET_POST_TAGS,
  GET_TAGS,
} from '../../infrastructure/graphql/queries';

import { useCategories, useCategoryTree } from './useCategories';
import { useActiveLinks, useLinks } from './useLinks';
import { usePostTags, useTags } from './useTags';

const mockTags = [
  { __typename: 'BlogTag', id: 1, name: 'React', slug: 'react' },
  { __typename: 'BlogTag', id: 2, name: 'Vue', slug: 'vue' },
];
const mockCategories = [
  { __typename: 'BlogCategory', id: 1, name: 'Tech', slug: 'tech', parentId: null, children: [] },
];
const mockLinks = [
  { __typename: 'BlogLink', id: 1, name: 'GitHub', url: 'https://github.com', status: 'ACTIVE' },
];

describe('useTags', () => {
  it('should return tags when data loaded', async () => {
    const mocks = [
      {
        request: { query: GET_TAGS },
        result: { data: { tags: mockTags } },
      },
    ];

    const { result } = renderHook(() => useTags(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tags).toEqual(mockTags);
    expect(result.current.error).toBeUndefined();
  });

  it('should return empty array when no data', async () => {
    const mocks = [
      {
        request: { query: GET_TAGS },
        result: { data: { tags: [] } },
      },
    ];

    const { result } = renderHook(() => useTags(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tags).toEqual([]);
  });
});

describe('usePostTags', () => {
  it('should return post tags when data loaded', async () => {
    const mocks = [
      {
        request: {
          query: GET_POST_TAGS,
          variables: { postId: 1 },
        },
        result: { data: { postTags: mockTags } },
      },
    ];

    const { result } = renderHook(() => usePostTags(1), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tags).toEqual(mockTags);
    expect(result.current.error).toBeUndefined();
  });

  it('should skip query when postId is undefined', () => {
    const mocks = [
      {
        request: {
          query: GET_POST_TAGS,
          variables: { postId: 0 },
        },
        result: { data: { postTags: mockTags } },
      },
    ];

    const { result } = renderHook(() => usePostTags(undefined), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.tags).toEqual([]);
  });
});

describe('useCategories', () => {
  it('should return categories when data loaded', async () => {
    const mocks = [
      {
        request: { query: GET_CATEGORIES },
        result: { data: { categories: mockCategories } },
      },
    ];

    const { result } = renderHook(() => useCategories(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.error).toBeUndefined();
  });

  it('should return empty array when no data', async () => {
    const mocks = [
      {
        request: { query: GET_CATEGORIES },
        result: { data: { categories: [] } },
      },
    ];

    const { result } = renderHook(() => useCategories(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
  });
});

describe('useCategoryTree', () => {
  it('should return category tree when data loaded', async () => {
    const mocks = [
      {
        request: { query: GET_CATEGORY_TREE },
        result: { data: { categoryTree: mockCategories } },
      },
    ];

    const { result } = renderHook(() => useCategoryTree(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categoryTree).toEqual(mockCategories);
    expect(result.current.error).toBeUndefined();
  });

  it('should return empty array when no data', async () => {
    const mocks = [
      {
        request: { query: GET_CATEGORY_TREE },
        result: { data: { categoryTree: [] } },
      },
    ];

    const { result } = renderHook(() => useCategoryTree(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categoryTree).toEqual([]);
  });
});

describe('useLinks', () => {
  it('should return links when data loaded', async () => {
    const mocks = [
      {
        request: { query: GET_LINKS },
        result: { data: { links: mockLinks } },
      },
    ];

    const { result } = renderHook(() => useLinks(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.links).toEqual(mockLinks);
    expect(result.current.error).toBeUndefined();
  });

  it('should return empty array when no data', async () => {
    const mocks = [
      {
        request: { query: GET_LINKS },
        result: { data: { links: [] } },
      },
    ];

    const { result } = renderHook(() => useLinks(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.links).toEqual([]);
  });
});

describe('useActiveLinks', () => {
  it('should return active links when data loaded', async () => {
    const mocks = [
      {
        request: { query: GET_ACTIVE_LINKS },
        result: { data: { activeLinks: mockLinks } },
      },
    ];

    const { result } = renderHook(() => useActiveLinks(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.activeLinks).toEqual(mockLinks);
    expect(result.current.error).toBeUndefined();
  });

  it('should return empty array when no data', async () => {
    const mocks = [
      {
        request: { query: GET_ACTIVE_LINKS },
        result: { data: { activeLinks: [] } },
      },
    ];

    const { result } = renderHook(() => useActiveLinks(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.activeLinks).toEqual([]);
  });
});
