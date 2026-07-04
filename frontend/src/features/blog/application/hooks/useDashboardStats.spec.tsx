// src/features/blog/application/hooks/useDashboardStats.spec.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import { describe, expect, it } from 'vitest';

import { GET_DASHBOARD_STATS } from '../../infrastructure/graphql/queries';

import { useDashboardStats } from './useDashboardStats';

const mockDashboardData = {
  postStats: { __typename: 'PostStats', total: 10, published: 8, draft: 2 },
  commentStats: { __typename: 'CommentStats', total: 30, pending: 5, approved: 20, rejected: 5 },
  categoryStats: { __typename: 'CategoryStats', total: 4 },
  tagStats: { __typename: 'TagStats', total: 12 },
  linkStats: { __typename: 'LinkStats', total: 6 },
};

describe('useDashboardStats', () => {
  it('should return dashboard stats when data loaded', async () => {
    const mocks = [
      {
        request: { query: GET_DASHBOARD_STATS },
        result: { data: mockDashboardData },
      },
    ];

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.postStats).toEqual({ __typename: 'PostStats', total: 10, published: 8, draft: 2 });
    expect(result.current.commentStats).toEqual({ __typename: 'CommentStats', total: 30, pending: 5, approved: 20, rejected: 5 });
    expect(result.current.categoryStats).toEqual({ __typename: 'CategoryStats', total: 4 });
    expect(result.current.tagStats).toEqual({ __typename: 'TagStats', total: 12 });
    expect(result.current.linkStats).toEqual({ __typename: 'LinkStats', total: 6 });
    expect(result.current.error).toBeUndefined();
  });

  it('should return zero defaults when no data', async () => {
    const mocks = [
      {
        request: { query: GET_DASHBOARD_STATS },
        result: { data: {} },
      },
    ];

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.postStats).toEqual({ total: 0, published: 0, draft: 0 });
    expect(result.current.commentStats).toEqual({ total: 0, pending: 0, approved: 0, rejected: 0 });
    expect(result.current.categoryStats).toEqual({ total: 0 });
    expect(result.current.tagStats).toEqual({ total: 0 });
    expect(result.current.linkStats).toEqual({ total: 0 });
  });

  it('should expose error when query fails', async () => {
    const mocks = [
      {
        request: { query: GET_DASHBOARD_STATS },
        error: new Error('Network error'),
      },
    ];

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    // Should still return defaults on error
    expect(result.current.postStats).toEqual({ total: 0, published: 0, draft: 0 });
  });
});
