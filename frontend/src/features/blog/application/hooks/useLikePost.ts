// src/features/blog/application/hooks/useLikePost.ts
import { useCallback, useRef } from 'react';
import { useMutation } from '@apollo/client/react';

import { LIKE_POST } from '../../infrastructure/graphql/mutations';
import { GET_POSTS, GET_POST_BY_ID } from '../../infrastructure/graphql/queries';

/**
 * 点赞文章 Hook
 * - 使用 refetchQueries 刷新数据
 * - 防止重复点赞（基于本地状态）
 */
export function useLikePost() {
  const [likePostMutation, { loading }] = useMutation(LIKE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });
  const likedPostsRef = useRef<Set<number>>(new Set());

  const likePost = useCallback(
    async (postId: number) => {
      // 防止重复点赞
      if (likedPostsRef.current.has(postId)) {
        return 'already_liked' as const;
      }

      try {
        await likePostMutation({
          variables: { id: postId },
          refetchQueries: [
            { query: GET_POST_BY_ID, variables: { id: postId } },
          ],
        });

        // 标记已点赞
        likedPostsRef.current.add(postId);
        return 'success' as const;
      } catch {
        return 'error' as const;
      }
    },
    [likePostMutation],
  );

  return {
    likePost,
    loading,
    isLiked: (postId: number) => likedPostsRef.current.has(postId),
  };
}
