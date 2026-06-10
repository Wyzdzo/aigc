// src/features/blog/application/hooks/useComments.ts
import { executeGraphQL } from '@/shared/graphql/request';
import { GET_COMMENTS, GET_COMMENT_STATS } from '../../infrastructure/graphql/queries';
import type { BlogComment } from '@/entities/blog';

interface CommentsResponse {
  comments: {
    items: BlogComment[];
    total: number;
    page: number;
    pageSize: number;
  };
}

interface CommentStatsResponse {
  commentStats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export function useComments(postId: number, status?: string, page = 1, pageSize = 10) {
  const fetchComments = async () => {
    if (!postId) {
      return {
        items: [],
        total: 0,
        page,
        pageSize,
      };
    }

    try {
      const data = await executeGraphQL<CommentsResponse, { postId: number; status?: string; page: number; pageSize: number }>(GET_COMMENTS.loc?.source.body || '', {
        postId,
        status,
        page,
        pageSize,
      });

      return {
        items: data?.comments?.items || [],
        total: data?.comments?.total || 0,
        page: data?.comments?.page || page,
        pageSize: data?.comments?.pageSize || pageSize,
      };
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      return {
        items: [],
        total: 0,
        page,
        pageSize,
      };
    }
  };

  return {
    fetchComments,
  };
}

export function useCommentStats(postId: number) {
  const fetchCommentStats = async () => {
    if (!postId) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      };
    }

    try {
      const data = await executeGraphQL<CommentStatsResponse, { postId: number }>(GET_COMMENT_STATS.loc?.source.body || '', {
        postId,
      });

      return data?.commentStats || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      };
    } catch (error) {
      console.error('Failed to fetch comment stats:', error);
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      };
    }
  };

  return {
    fetchCommentStats,
  };
}