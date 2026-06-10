// src/features/blog/application/hooks/usePost.ts
import { executeGraphQL } from '@/shared/graphql/request';
import { GET_POST_BY_ID, GET_POST_BY_SLUG } from '../../infrastructure/graphql/queries';
import type { BlogPost } from '@/entities/blog';

interface PostByIdResponse {
  post: BlogPost;
}

interface PostBySlugResponse {
  postBySlug: BlogPost;
}

export function usePostById(id: number) {
  const fetchPostById = async () => {
    if (!id) {
      return null;
    }

    try {
      const data = await executeGraphQL<PostByIdResponse, { id: number }>(GET_POST_BY_ID.loc?.source.body || '', {
        id,
      });

      return data?.post || null;
    } catch (error) {
      console.error('Failed to fetch post by id:', error);
      return null;
    }
  };

  return {
    fetchPostById,
  };
}

export function usePostBySlug(slug: string) {
  const fetchPostBySlug = async () => {
    if (!slug) {
      return null;
    }

    try {
      const data = await executeGraphQL<PostBySlugResponse, { slug: string }>(GET_POST_BY_SLUG.loc?.source.body || '', {
        slug,
      });

      return data?.postBySlug || null;
    } catch (error) {
      console.error('Failed to fetch post by slug:', error);
      return null;
    }
  };

  return {
    fetchPostBySlug,
  };
}