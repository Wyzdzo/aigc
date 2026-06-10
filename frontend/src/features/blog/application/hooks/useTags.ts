// src/features/blog/application/hooks/useTags.ts
import { executeGraphQL } from '@/shared/graphql/request';
import { GET_TAGS, GET_POST_TAGS } from '../../infrastructure/graphql/queries';
import type { BlogTag } from '@/entities/blog';

interface TagsResponse {
  tags: BlogTag[];
}

interface PostTagsResponse {
  postTags: BlogTag[];
}

export function useTags() {
  const fetchTags = async () => {
    try {
      const data = await executeGraphQL<TagsResponse, Record<string, never>>(GET_TAGS.loc?.source.body || '', {});

      return data?.tags || [];
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      return [];
    }
  };

  return {
    fetchTags,
  };
}

export function usePostTags(postId: number) {
  const fetchPostTags = async () => {
    if (!postId) {
      return [];
    }

    try {
      const data = await executeGraphQL<PostTagsResponse, { postId: number }>(GET_POST_TAGS.loc?.source.body || '', {
        postId,
      });

      return data?.postTags || [];
    } catch (error) {
      console.error('Failed to fetch post tags:', error);
      return [];
    }
  };

  return {
    fetchPostTags,
  };
}