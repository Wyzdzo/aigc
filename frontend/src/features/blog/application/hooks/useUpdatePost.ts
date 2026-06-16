// src/features/blog/application/hooks/useUpdatePost.ts
import { useMutation } from '@apollo/client/react';

import type { UpdateBlogPostInput } from '@/entities/blog';

import { UPDATE_POST } from '../../infrastructure/graphql/mutations';

export interface UpdatePostMutationResult {
  updatePost: {
    id: number;
    title: string;
    slug: string;
    content: string;
    summary: string | null;
    coverImage: string | null;
    status: string;
    isTop: boolean;
    viewCount: number;
    likeCount: number;
    categoryId: number | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function useUpdatePost() {
  const [updatePost, { loading, error }] = useMutation<UpdatePostMutationResult, { id: number; input: UpdateBlogPostInput }>(
    UPDATE_POST,
  );

  return {
    updatePost: async (id: number, input: UpdateBlogPostInput) => {
      const result = await updatePost({ variables: { id, input } });
      return result.data?.updatePost;
    },
    loading,
    error,
  };
}