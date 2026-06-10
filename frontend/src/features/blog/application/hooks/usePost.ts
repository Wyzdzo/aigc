// src/features/blog/application/hooks/usePost.ts
import { useQuery } from '@apollo/client/react';
import { GET_POST_BY_ID, GET_POST_BY_SLUG } from '../../infrastructure/graphql/queries';
import type { BlogPost } from '@/entities/blog';

export interface PostByIdResult {
  post: BlogPost | null;
}

export interface PostBySlugResult {
  postBySlug: BlogPost | null;
}

export function usePostById(id: number | undefined) {
  const { data, loading, error, refetch } = useQuery<PostByIdResult, { id: number }>(
    GET_POST_BY_ID,
    {
      variables: { id: id ?? 0 },
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

export function usePostBySlug(slug: string | undefined) {
  const { data, loading, error, refetch } = useQuery<PostBySlugResult, { slug: string }>(
    GET_POST_BY_SLUG,
    {
      variables: { slug: slug ?? '' },
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