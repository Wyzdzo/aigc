// src/features/blog/application/hooks/useComments.ts
import { useQuery } from '@apollo/client/react';

import { CommentStatus } from '@/entities/blog';
import type { BlogComment } from '@/entities/blog';

import { GET_COMMENT_STATS,GET_COMMENTS } from '../../infrastructure/graphql/queries';

export interface CommentsResult {
  comments: {
    items: BlogComment[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface CommentStatsResult {
  commentStats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface CommentsVariables {
  postId?: number;
  status?: CommentStatus;
  page?: number;
  pageSize?: number;
}

export function useComments(variables: CommentsVariables = {}) {
  const { postId, status = CommentStatus.APPROVED, page = 1, pageSize = 10 } = variables;

  const { data, loading, error, refetch } = useQuery<CommentsResult, CommentsVariables>(
    GET_COMMENTS,
    {
      variables: { postId, status, page, pageSize },
      skip: !postId,
      fetchPolicy: 'cache-first',
    },
  );

  return {
    items: data?.comments?.items || [],
    total: data?.comments?.total || 0,
    currentPage: data?.comments?.page || page,
    pageSize: data?.comments?.pageSize || pageSize,
    loading,
    error,
    refetch,
  };
}

export function useCommentStats(postId: number | undefined) {
  const { data, loading, error, refetch } = useQuery<CommentStatsResult, { postId: number }>(
    GET_COMMENT_STATS,
    {
      variables: { postId: postId ?? 0 },
      skip: !postId,
      fetchPolicy: 'cache-first',
    },
  );

  return {
    stats: data?.commentStats || { total: 0, pending: 0, approved: 0, rejected: 0 },
    loading,
    error,
    refetch,
  };
}