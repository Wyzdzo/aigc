// src/features/blog/application/hooks/usePost.ts
import { useQuery } from '@apollo/client/react';

import type { BlogPost } from '@/entities/blog';

import { GET_POST_BY_ID, GET_POST_BY_SLUG } from '../../infrastructure/graphql/queries';

export interface PostQueryResult {
  post: BlogPost;
}

export interface PostBySlugQueryResult {
  postBySlug: BlogPost;
}

export function usePost(id?: number) {
  const { data, loading, error, refetch } = useQuery<PostQueryResult, { id: number }>(
    GET_POST_BY_ID,
    {
      variables: { id: id || 0 },
      skip: !id,
      fetchPolicy: 'cache-first',
    },
  );

  return {
    post: data?.post,
    loading,
    error,
    refetch,
  };
}

export function usePostById(id?: number) {
  const { data, loading, error, refetch } = useQuery<PostQueryResult, { id: number }>(
    GET_POST_BY_ID,
    {
      variables: { id: id || 0 },
      skip: !id,
      fetchPolicy: 'cache-first',
    },
  );

  return {
    post: data?.post || null,
    loading,
    error,
    refetch,
  };
}

export function usePostBySlug(slug?: string) {
  const { data, loading, error, refetch } = useQuery<PostBySlugQueryResult, { slug: string }>(
    GET_POST_BY_SLUG,
    {
      variables: { slug: slug || '' },
      skip: !slug,
      fetchPolicy: 'cache-first',
    },
  );

  return {
    post: data?.postBySlug || null,
    loading,
    error,
    refetch,
  };
}