// src/features/blog/application/hooks/usePosts.ts
import { useQuery } from '@apollo/client/react';
import { GET_POSTS } from '../../infrastructure/graphql/queries';
import type { BlogPost, PostStatus } from '@/entities/blog';

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

  const { data, loading, error, refetch } = useQuery<PostsQueryResult, PostsQueryVariables>(
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

  return {
    posts: data?.posts?.items || [],
    total: data?.posts?.total || 0,
    currentPage: data?.posts?.page || page,
    pageSize: data?.posts?.pageSize || pageSize,
    loading,
    error,
    refetch,
  };
}