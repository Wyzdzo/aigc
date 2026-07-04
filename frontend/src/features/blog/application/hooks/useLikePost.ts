// src/features/blog/application/hooks/useLikePost.ts
import { useCallback, useRef } from 'react';
import { useMutation } from '@apollo/client/react';
import { message } from 'antd';

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
        message.info('您已经点过赞了');
        return false;
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
        message.success('点赞成功');
        return true;
      } catch {
        message.error('点赞失败，请稍后重试');
        return false;
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
