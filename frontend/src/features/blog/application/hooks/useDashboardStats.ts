// src/features/blog/application/hooks/useDashboardStats.ts
import { useQuery } from '@apollo/client/react';

import { GET_DASHBOARD_STATS } from '../../infrastructure/graphql/queries';

interface PostStats {
  total: number;
  published: number;
  draft: number;
  totalViewCount: number;
  totalLikeCount: number;
}

interface CommentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface CategoryStats {
  total: number;
}

interface TagStats {
  total: number;
}

interface LinkStats {
  total: number;
}

interface DashboardStatsData {
  postStats: PostStats;
  commentStats: CommentStats;
  categoryStats: CategoryStats;
  tagStats: TagStats;
  linkStats: LinkStats;
}

export function useDashboardStats() {
  const { data, loading, error, refetch } = useQuery<DashboardStatsData>(GET_DASHBOARD_STATS, {
    fetchPolicy: 'cache-first',
  });

  return {
    postStats: data?.postStats || { total: 0, published: 0, draft: 0, totalViewCount: 0, totalLikeCount: 0 },
    commentStats: data?.commentStats || { total: 0, pending: 0, approved: 0, rejected: 0 },
    categoryStats: data?.categoryStats || { total: 0 },
    tagStats: data?.tagStats || { total: 0 },
    linkStats: data?.linkStats || { total: 0 },
    loading,
    error,
    refetch,
  };
}
