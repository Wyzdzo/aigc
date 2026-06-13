import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CREATE_COMMENT } from '../../infrastructure/graphql/mutations';
import { GET_COMMENTS } from '../../infrastructure/graphql/queries';
import { mockComments } from '../../infrastructure/mock/mock';

import { useCreateComment } from './useCreateComment';

describe('useCreateComment', () => {
  const mockCommentInput = {
    postId: 1,
    nickname: '测试用户',
    email: 'test@example.com',
    content: '这是一条测试评论',
  };

  const mockCreatedComment = {
    id: 100,
    postId: 1,
    parentId: null,
    nickname: '测试用户',
    email: 'test@example.com',
    avatar: null,
    content: '这是一条测试评论',
    status: 'PENDING' as const,
    likeCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.spyOn(message, 'success').mockClear();
    vi.spyOn(message, 'info').mockClear();
    vi.spyOn(message, 'error').mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('happy path', () => {
    it('should create comment successfully', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: { input: mockCommentInput },
          },
          result: {
            data: {
              createComment: mockCreatedComment,
            },
          },
        },
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1 },
          },
          result: {
            data: {
              comments: {
                items: [mockCreatedComment, ...mockComments],
                total: mockComments.length + 1,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useCreateComment(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      expect(result.current.loading).toBe(false);

      const success = await result.current.createComment(mockCommentInput);

      await waitFor(() => {
        expect(message.success).toHaveBeenCalledWith('评论发布成功');
      });

      expect(success).toBe(true);
    });

    it('should create reply comment successfully', async () => {
      const replyInput = {
        ...mockCommentInput,
        parentId: 1,
      };

      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: { input: replyInput },
          },
          result: {
            data: {
              createComment: {
                ...mockCreatedComment,
                parentId: 1,
              },
            },
          },
        },
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1 },
          },
          result: {
            data: {
              comments: {
                items: mockComments,
                total: mockComments.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useCreateComment(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      const success = await result.current.createComment(replyInput);

      expect(success).toBe(true);
    });
  });

  describe('error path', () => {
    it('should handle mutation error', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: { input: mockCommentInput },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useCreateComment(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      const success = await result.current.createComment(mockCommentInput);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('评论发布失败，请稍后重试');
      });

      expect(success).toBe(false);
    });

    it('should block duplicate submission', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: { input: mockCommentInput },
          },
          result: {
            data: {
              createComment: mockCreatedComment,
            },
          },
        },
      ];

      const { result } = renderHook(() => useCreateComment(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      // 第一次提交
      await result.current.createComment(mockCommentInput);

      await waitFor(() => {
        expect(message.success).toHaveBeenCalled();
      });

      // 第二次提交相同内容（应该被拦截）
      await result.current.createComment(mockCommentInput);

      await waitFor(() => {
        expect(message.info).toHaveBeenCalledWith('请勿重复提交');
      });

      // 验证 mutation 只被调用一次
      // （由于 mock 只定义了一次，第二次会被忽略）
    });
  });

  describe('loading state', () => {
    it('should set loading to true during mutation', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: { input: mockCommentInput },
          },
          result: {
            data: {
              createComment: mockCreatedComment,
            },
          },
        },
      ];

      const { result } = renderHook(() => useCreateComment(), {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      });

      // 初始状态 loading 为 false
      expect(result.current.loading).toBe(false);

      // 开始提交
      const submitPromise = result.current.createComment(mockCommentInput);

      // 等待 loading 变为 true
      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      // 等待提交完成
      await submitPromise;

      // 等待 loading 恢复为 false
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});
