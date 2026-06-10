// src/features/blog/application/hooks/usePosts.ts
import { executeGraphQL } from '@/shared/graphql/request';
import { GET_POSTS } from '../../infrastructure/graphql/queries';
import type { BlogPost, BlogPostQueryParams } from '@/entities/blog';

interface PostsResponse {
  posts: {
    items: BlogPost[];
    total: number;
    page: number;
    pageSize: number;
  };
}

interface UsePostsParams extends BlogPostQueryParams {}

export function usePosts(params: UsePostsParams = {}) {
  const { categoryId, tagId, status, keyword, page = 1, pageSize = 10 } = params;

  const fetchPosts = async () => {
    try {
      const data = await executeGraphQL<PostsResponse, { categoryId?: number; tagId?: number; status?: string; keyword?: string; page: number; pageSize: number }>(GET_POSTS.loc?.source.body || '', {
        categoryId,
        tagId,
        status,
        keyword,
        page,
        pageSize,
      });

      return {
        posts: data?.posts?.items || [],
        total: data?.posts?.total || 0,
        currentPage: data?.posts?.page || page,
        pageSize: data?.posts?.pageSize || pageSize,
      };
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      return {
        posts: [],
        total: 0,
        currentPage: page,
        pageSize,
      };
    }
  };

  return {
    fetchPosts,
  };
}