// src/features/blog/application/hooks/useAdminComments.ts

import { useMutation, useQuery } from '@apollo/client/react';

import type { BlogComment, CommentStatus } from '@/entities/blog';

import { DELETE_COMMENT, UPDATE_COMMENT_STATUS } from '../../infrastructure/graphql/mutations';
import { GET_COMMENTS } from '../../infrastructure/graphql/queries';

export interface AdminCommentsVariables {
  status?: CommentStatus;
  page?: number;
  pageSize?: number;
}

export function useAdminComments(variables: AdminCommentsVariables = {}) {
  const { status, page = 1, pageSize = 20 } = variables;

  const { data, loading, error, refetch } = useQuery<{
    comments: {
      items: BlogComment[];
      total: number;
      page: number;
      pageSize: number;
    };
  }>(GET_COMMENTS, {
    variables: { postId: undefined, status, page, pageSize },
    fetchPolicy: 'cache-first',
  });

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

export function useUpdateCommentStatus() {
  const [updateCommentStatus, { loading }] = useMutation<
    { updateCommentStatus: BlogComment },
    { id: number; status: CommentStatus }
  >(UPDATE_COMMENT_STATUS);

  const handleUpdateStatus = async (id: number, status: CommentStatus) => {
    const result = await updateCommentStatus({
      variables: { id, status },
    });
    return result.data?.updateCommentStatus;
  };

  return {
    updateCommentStatus: handleUpdateStatus,
    loading,
  };
}

export function useDeleteComment() {
  const [deleteComment, { loading }] = useMutation<{ deleteComment: boolean }, { id: number }>(DELETE_COMMENT);

  const handleDelete = async (id: number) => {
    const result = await deleteComment({
      variables: { id },
    });
    return result.data?.deleteComment;
  };

  return {
    deleteComment: handleDelete,
    loading,
  };
}
