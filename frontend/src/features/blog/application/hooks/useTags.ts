// src/features/blog/application/hooks/useTags.ts
import { useQuery } from '@apollo/client/react';
import { GET_TAGS, GET_POST_TAGS } from '../../infrastructure/graphql/queries';
import type { BlogTag } from '@/entities/blog';

export interface TagsResult {
  tags: BlogTag[];
}

export interface PostTagsResult {
  postTags: BlogTag[];
}

export function useTags() {
  const { data, loading, error, refetch } = useQuery<TagsResult>(GET_TAGS, {
    fetchPolicy: 'cache-first',
  });

  return {
    tags: data?.tags || [],
    loading,
    error,
    refetch,
  };
}

export function usePostTags(postId: number | undefined) {
  const { data, loading, error, refetch } = useQuery<PostTagsResult, { postId: number }>(
    GET_POST_TAGS,
    {
      variables: { postId: postId ?? 0 },
      skip: !postId,
      fetchPolicy: 'cache-first',
    },
  );

  return {
    tags: data?.postTags || [],
    loading,
    error,
    refetch,
  };
}