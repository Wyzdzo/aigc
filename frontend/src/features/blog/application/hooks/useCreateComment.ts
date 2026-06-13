import { useCallback, useRef } from 'react';
import { useMutation } from '@apollo/client/react';
import { message } from 'antd';

import type { BlogComment, CreateCommentInput } from '@/entities/blog';

import { CREATE_COMMENT } from '../../infrastructure/graphql/mutations';
import { GET_COMMENTS } from '../../infrastructure/graphql/queries';

export interface CreateCommentResult {
  createComment: BlogComment;
}

export interface CreateCommentVariables {
  input: CreateCommentInput;
}

export function useCreateComment() {
  const [createCommentMutation, { loading }] = useMutation<CreateCommentResult, CreateCommentVariables>(
    CREATE_COMMENT,
  );
  const submittedRef = useRef<Set<string>>(new Set());

  const createComment = useCallback(
    async (input: CreateCommentInput): Promise<boolean> => {
      // 生成唯一 key 用于重复提交拦截
      const key = `${input.postId}-${input.nickname}-${input.content}`;
      if (submittedRef.current.has(key)) {
        message.info('请勿重复提交');
        return false;
      }

      try {
        const result = await createCommentMutation({
          variables: { input },
          update: (cache, { data }) => {
            if (!data?.createComment) return;

            // 从缓存中获取当前评论列表
            const existingComments = cache.readQuery<{
              comments: { items: BlogComment[]; total: number };
            }>({
              query: GET_COMMENTS,
              variables: { postId: input.postId },
            });

            if (existingComments?.comments) {
              // 更新评论列表缓存
              cache.writeQuery({
                query: GET_COMMENTS,
                variables: { postId: input.postId },
                data: {
                  comments: {
                    ...existingComments.comments,
                    items: [data.createComment, ...existingComments.comments.items],
                    total: existingComments.comments.total + 1,
                  },
                },
              });
            }
          },
        });

        if (result.data?.createComment) {
          submittedRef.current.add(key);
          message.success('评论发布成功');
          return true;
        }

        return false;
      } catch {
        message.error('评论发布失败，请稍后重试');
        return false;
      }
    },
    [createCommentMutation],
  );

  return { createComment, loading };
}
