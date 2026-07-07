// src/features/blog/application/hooks/useAdjacentPosts.ts
import { useQuery } from '@apollo/client/react';

import type { BlogPost } from '@/entities/blog';

import { GET_ADJACENT_POSTS } from '../../infrastructure/graphql/queries';

interface AdjacentPostsQueryResult {
  adjacentPosts: {
    prev: Pick<BlogPost, 'id' | 'title' | 'slug'> | null;
    next: Pick<BlogPost, 'id' | 'title' | 'slug'> | null;
  };
}

interface AdjacentPostsQueryVariables {
  slug: string;
}

export function useAdjacentPosts(slug: string | undefined) {
  const { data, loading, error } = useQuery<AdjacentPostsQueryResult, AdjacentPostsQueryVariables>(
    GET_ADJACENT_POSTS,
    {
      variables: { slug: slug ?? '' },
      skip: !slug,
      fetchPolicy: 'cache-and-network',
    },
  );

  const prev = data?.adjacentPosts?.prev ?? null;
  const next = data?.adjacentPosts?.next ?? null;

  return { prev, next, loading, error };
}
