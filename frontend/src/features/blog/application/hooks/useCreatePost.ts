// src/features/blog/application/hooks/useCreatePost.ts
import { useMutation } from '@apollo/client/react';

import type { CreateBlogPostInput } from '@/entities/blog';

import { CREATE_POST } from '../../infrastructure/graphql/mutations';
import { GET_POSTS } from '../../infrastructure/graphql/queries';

export interface CreatePostMutationResult {
  createPost: {
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

export function useCreatePost() {
  const [createPost, { loading, error }] = useMutation<CreatePostMutationResult, { input: CreateBlogPostInput }>(
    CREATE_POST,
    {
      update(cache, { data }) {
        if (data?.createPost) {
          try {
            const existingPosts = cache.readQuery({ query: GET_POSTS }) as {
              posts: { items: unknown[]; total: number; page: number; pageSize: number };
            } | null;

            if (existingPosts?.posts) {
              cache.writeQuery({
                query: GET_POSTS,
                data: {
                  posts: {
                    ...existingPosts.posts,
                    total: existingPosts.posts.total + 1,
                    items: [data.createPost, ...existingPosts.posts.items],
                  },
                },
              });
            }
          } catch {
            // 缓存更新失败不影响主流程
          }
        }
      },
    },
  );

  return {
    createPost: async (input: CreateBlogPostInput) => {
      const result = await createPost({ variables: { input } });
      return result.data?.createPost;
    },
    loading,
    error,
  };
}