// src/features/blog/application/hooks/useLikePost.ts
import { useCallback, useRef } from 'react';
import { useMutation } from '@apollo/client/react';
import { message } from 'antd';

import type { BlogPost } from '@/entities/blog';

import { LIKE_POST } from '../../infrastructure/graphql/mutations';
import { GET_POST_BY_ID, GET_POST_BY_SLUG, GET_POSTS } from '../../infrastructure/graphql/queries';

interface LikePostResult {
  likePost: BlogPost;
}

interface LikePostVariables {
  id: number;
}

/**
 * 点赞文章 Hook
 * - 使用 Apollo Cache 更新点赞数量
 * - 防止重复点赞（基于本地状态）
 */
export function useLikePost() {
  const [likePostMutation, { loading }] = useMutation<LikePostResult, LikePostVariables>(LIKE_POST);
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
          // 更新 Apollo Cache
          update: (cache, { data }) => {
            if (!data?.likePost) return;

            // 获取文章 slug 用于更新其他缓存
            const existingPostById = cache.readQuery<{ post: BlogPost | null }, { id: number }>({
              query: GET_POST_BY_ID,
              variables: { id: postId },
            });
            const slug = existingPostById?.post?.slug ?? data.likePost.slug;

            // 更新 GET_POST_BY_ID 缓存
            if (existingPostById?.post) {
              cache.writeQuery({
                query: GET_POST_BY_ID,
                variables: { id: postId },
                data: {
                  post: {
                    ...existingPostById.post,
                    likeCount: data.likePost.likeCount,
                  },
                },
              });
            }

            // 更新 GET_POST_BY_SLUG 缓存（文章详情页）
            if (slug) {
              const existingPostBySlug = cache.readQuery<{ postBySlug: BlogPost | null }, { slug: string }>({
                query: GET_POST_BY_SLUG,
                variables: { slug },
              });
              if (existingPostBySlug?.postBySlug) {
                cache.writeQuery({
                  query: GET_POST_BY_SLUG,
                  variables: { slug },
                  data: {
                    postBySlug: {
                      ...existingPostBySlug.postBySlug,
                      likeCount: data.likePost.likeCount,
                    },
                  },
                });
              }
            }

            // 更新 GET_POSTS 缓存（文章列表）
            const existingPosts = cache.readQuery<{ posts: { items: BlogPost[] } }>({
              query: GET_POSTS,
            });
            if (existingPosts?.posts?.items) {
              const updatedItems = existingPosts.posts.items.map((item) =>
                item.id === postId ? { ...item, likeCount: data.likePost.likeCount } : item,
              );
              cache.writeQuery({
                query: GET_POSTS,
                data: {
                  posts: {
                    ...existingPosts.posts,
                    items: updatedItems,
                  },
                },
              });
            }
          },
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
