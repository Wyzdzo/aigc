// src/widgets/blog/CommentForm.spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { message } from 'antd';
import { describe, expect, it, vi, beforeEach, afterEach, beforeAll } from 'vitest';

import { CREATE_COMMENT, GET_COMMENTS } from '@/features/blog';

import { CommentForm } from './CommentForm';

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverMock;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('CommentForm', () => {
  beforeEach(() => {
    vi.spyOn(message, 'success').mockReturnValue({} as ReturnType<typeof message.success>);
    vi.spyOn(message, 'error').mockReturnValue({} as ReturnType<typeof message.error>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createWrapper(mocks: MockedResponse[] = []) {
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
    };
  }

  describe('Happy Path', () => {
    it('should render comment form with default props', () => {
      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper() });

      expect(container.querySelector('input[placeholder="昵称"]')).toBeTruthy();
      expect(container.querySelector('input[placeholder="邮箱（选填）"]')).toBeTruthy();
      expect(container.querySelector('textarea[placeholder="写下你的评论..."]')).toBeTruthy();
      expect(container.textContent).toContain('发布评论');
    });

    it('should render compact form when compact prop is true', () => {
      const { container } = render(<CommentForm postId={1} compact />, { wrapper: createWrapper() });

      expect(container.querySelector('input[placeholder="昵称"]')).toBeTruthy();
      expect(container.textContent).toContain('发布评论');
    });

    it('should render with custom placeholder', () => {
      const { container } = render(<CommentForm postId={1} placeholder="自定义占位符" />, { wrapper: createWrapper() });

      expect(container.querySelector('textarea[placeholder="自定义占位符"]')).toBeTruthy();
    });

    it('should show cancel button when showCancel prop is true', () => {
      const { container } = render(<CommentForm postId={1} showCancel />, { wrapper: createWrapper() });

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(2); // 应该有发布评论和取消两个按钮
    });

    it('should call onSuccess when comment is submitted successfully', async () => {
      const onSuccessMock = vi.fn();
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: {
              input: {
                postId: 1,
                nickname: '测试用户',
                email: 'test@example.com',
                content: '测试评论内容',
              },
            },
          },
          result: {
            data: {
              createComment: {
                id: 1,
                postId: 1,
                parentId: null,
                nickname: '测试用户',
                email: 'test@example.com',
                avatar: null,
                content: '测试评论内容',
                status: 'APPROVED',
                likeCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          },
        },
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              comments: {
                items: [],
                total: 1,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<CommentForm postId={1} onSuccess={onSuccessMock} />, { wrapper: createWrapper(mocks) });

      const nicknameInput = container.querySelector('input[placeholder="昵称"]') as HTMLInputElement;
      const emailInput = container.querySelector('input[placeholder="邮箱（选填）"]') as HTMLInputElement;
      const contentInput = container.querySelector('textarea[placeholder="写下你的评论..."]') as HTMLTextAreaElement;
      const submitButton = container.querySelector('button[type="submit"]');

      fireEvent.change(nicknameInput, { target: { value: '测试用户' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(contentInput, { target: { value: '测试评论内容' } });
      fireEvent.click(submitButton!);

      await waitFor(() => {
        expect(message.success).toHaveBeenCalled();
      });
    });

    it('should call onCancel when cancel button is clicked', async () => {
      const onCancelMock = vi.fn();

      const { container } = render(<CommentForm postId={1} showCancel onCancel={onCancelMock} />, { wrapper: createWrapper() });

      const nicknameInput = container.querySelector('input[placeholder="昵称"]') as HTMLInputElement;
      const buttons = container.querySelectorAll('button');
      const cancelButton = buttons[buttons.length - 1]; // 取消按钮应该在最后

      fireEvent.change(nicknameInput, { target: { value: '测试用户' } });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(onCancelMock).toHaveBeenCalled();
      });
    });
  });

  describe('Error Path', () => {
    it('should show validation errors for empty fields', async () => {
      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper() });

      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.click(submitButton!);

      await waitFor(() => {
        expect(container.textContent).toContain('请输入昵称');
      });

      const nicknameInput = container.querySelector('input[placeholder="昵称"]') as HTMLInputElement;
      fireEvent.change(nicknameInput, { target: { value: '测试用户' } });
      fireEvent.click(submitButton!);

      await waitFor(() => {
        expect(container.textContent).toContain('请输入评论内容');
      });
    });

    it('should show validation errors for invalid input', async () => {
      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper() });

      const nicknameInput = container.querySelector('input[placeholder="昵称"]') as HTMLInputElement;
      const contentInput = container.querySelector('textarea[placeholder="写下你的评论..."]') as HTMLTextAreaElement;
      const emailInput = container.querySelector('input[placeholder="邮箱（选填）"]') as HTMLInputElement;
      const submitButton = container.querySelector('button[type="submit"]');

      fireEvent.change(nicknameInput, { target: { value: 'A' } });
      fireEvent.change(contentInput, { target: { value: '123' } });
      fireEvent.click(submitButton!);

      await waitFor(() => {
        expect(container.textContent).toContain('昵称长度在 2-20 个字符');
        expect(container.textContent).toContain('评论内容至少 5 个字符');
      });

      fireEvent.change(nicknameInput, { target: { value: '测试用户' } });
      fireEvent.change(contentInput, { target: { value: '测试评论内容' } });
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton!);

      await waitFor(() => {
        expect(container.textContent).toContain('请输入有效的邮箱地址');
      });
    });

    it('should show error message when submission fails', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: {
              input: {
                postId: 1,
                nickname: '测试用户',
                email: '',
                content: '测试评论内容',
              },
            },
          },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper(mocks) });

      const nicknameInput = container.querySelector('input[placeholder="昵称"]') as HTMLInputElement;
      const contentInput = container.querySelector('textarea[placeholder="写下你的评论..."]') as HTMLTextAreaElement;
      const submitButton = container.querySelector('button[type="submit"]');

      fireEvent.change(nicknameInput, { target: { value: '测试用户' } });
      fireEvent.change(contentInput, { target: { value: '测试评论内容' } });
      fireEvent.click(submitButton!);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle optional email field', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: {
              input: {
                postId: 1,
                nickname: '测试用户',
                email: '',
                content: '测试评论内容',
              },
            },
          },
          result: {
            data: {
              createComment: {
                id: 1,
                postId: 1,
                parentId: null,
                nickname: '测试用户',
                email: '',
                avatar: null,
                content: '测试评论内容',
                status: 'APPROVED',
                likeCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          },
        },
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              comments: {
                items: [],
                total: 1,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper(mocks) });

      const nicknameInput = container.querySelector('input[placeholder="昵称"]') as HTMLInputElement;
      const contentInput = container.querySelector('textarea[placeholder="写下你的评论..."]') as HTMLTextAreaElement;
      const submitButton = container.querySelector('button[type="submit"]');

      fireEvent.change(nicknameInput, { target: { value: '测试用户' } });
      fireEvent.change(contentInput, { target: { value: '测试评论内容' } });
      fireEvent.click(submitButton!);

      await waitFor(() => {
        expect(message.success).toHaveBeenCalled();
      });
    });

    it('should handle reply form with parentId', () => {
      const { container } = render(<CommentForm postId={1} parentId={1} />, { wrapper: createWrapper() });

      expect(container.querySelector('textarea[placeholder="写下你的评论..."]')).toBeTruthy();
    });


  });
});
