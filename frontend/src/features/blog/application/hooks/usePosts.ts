// src/features/blog/application/hooks/usePosts.ts
import { useQuery } from '@apollo/client/react';

import type { BlogPost, PostStatus } from '@/entities/blog';

import { GET_POSTS } from '../../infrastructure/graphql/queries';

export interface PostsQueryResult {
  posts: {
    items: BlogPost[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface PostsQueryVariables {
  categoryId?: number;
  tagId?: number;
  status?: PostStatus;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export function usePosts(variables: PostsQueryVariables = {}) {
  const { categoryId, tagId, status, keyword, page = 1, pageSize = 10 } = variables;

  const { data, loading, error, refetch, fetchMore } = useQuery<PostsQueryResult, PostsQueryVariables>(
    GET_POSTS,
    {
      variables: {
        categoryId,
        tagId,
        status,
        keyword,
        page,
        pageSize,
      },
      fetchPolicy: 'cache-first',
    },
  );

  const posts = data?.posts?.items || [];
  const total = data?.posts?.total || 0;
  const hasMore = posts.length < total;

  const loadMore = async () => {
    if (!hasMore) return;
    await fetchMore({
      variables: { page: Math.floor(posts.length / pageSize) + 1 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          posts: {
            ...fetchMoreResult.posts,
            items: [...prev.posts.items, ...fetchMoreResult.posts.items],
          },
        };
      },
    });
  };

  return {
    posts,
    total,
    currentPage: data?.posts?.page || page,
    pageSize: data?.posts?.pageSize || pageSize,
    loading,
    error,
    refetch,
    hasMore,
    loadMore,
  };
}
