// src/widgets/blog/CommentForm.spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';

import { CREATE_COMMENT, GET_COMMENTS } from '@/features/blog';

import { CommentForm } from './CommentForm';

// Mock App.useApp
const { mockMessageApi } = vi.hoisted(() => ({
  mockMessageApi: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    App: {
      ...((actual as Record<string, unknown>).App || {}),
      useApp: vi.fn(() => ({
        message: mockMessageApi,
        notification: {},
        modal: {},
      })),
    },
  };
});

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

  afterEach(() => {
    vi.clearAllMocks();
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
        expect(onSuccessMock).toHaveBeenCalled();
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
        // Verify the component still renders after error (form not crashed)
        expect(container.querySelector('form')).toBeTruthy();
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
        // Verify the component still renders after successful submission
        expect(container.querySelector('form')).toBeTruthy();
      });
    });

    it('should handle reply form with parentId', () => {
      const { container } = render(<CommentForm postId={1} parentId={1} />, { wrapper: createWrapper() });

      expect(container.querySelector('textarea[placeholder="写下你的评论..."]')).toBeTruthy();
    });

    it('should call messageApi.success on successful submission', async () => {
      const onSuccessMock = vi.fn();
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

      const { container } = render(<CommentForm postId={1} onSuccess={onSuccessMock} />, { wrapper: createWrapper(mocks) });

      const nicknameInput = container.querySelector('input[placeholder="昵称"]') as HTMLInputElement;
      const contentInput = container.querySelector('textarea[placeholder="写下你的评论..."]') as HTMLTextAreaElement;
      const submitButton = container.querySelector('button[type="submit"]');

      fireEvent.change(nicknameInput, { target: { value: '测试用户' } });
      fireEvent.change(contentInput, { target: { value: '测试评论内容' } });
      fireEvent.click(submitButton!);

      await waitFor(() => {
        expect(mockMessageApi.success).toHaveBeenCalledWith('评论发布成功');
      });
    });

    it('should call messageApi.error when createComment returns error', async () => {
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
        expect(mockMessageApi.error).toHaveBeenCalledWith('评论发布失败，请稍后重试');
      });
    });
  });
});
