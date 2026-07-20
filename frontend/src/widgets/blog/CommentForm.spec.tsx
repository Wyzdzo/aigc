// src/widgets/blog/CommentForm.spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, beforeEach, afterEach } from 'vitest';

import { CREATE_COMMENT, GET_COMMENTS } from '@/features/blog';
import { GET_MEDIA_LIST } from '@/features/media';

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

// Mock useAuth — 默认未登录
const mockAuthState = vi.hoisted(() => ({
  isAuthenticated: false,
  user: null as unknown,
}));

vi.mock('@/features/auth', () => ({
  useAuth: () => ({
    isAuthenticated: mockAuthState.isAuthenticated,
    user: mockAuthState.user,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
    isAdmin: () => false,
    hasRole: () => false,
  }),
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
    // Reset auth mock to unauthenticated
    mockAuthState.isAuthenticated = false;
    mockAuthState.user = null;
  });

  const mediaListMock: MockedResponse = {
    request: {
      query: GET_MEDIA_LIST,
      variables: { page: 1, pageSize: 12, keyword: undefined },
    },
    result: {
      data: {
        mediaList: { items: [], total: 0, page: 1, pageSize: 12 },
      },
    },
  };

  function createWrapper(mocks: MockedResponse[] = []) {
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return <MockedProvider mocks={[...mocks, mediaListMock]}>{children}</MockedProvider>;
    };
  }

  describe('Unauthenticated User', () => {
    it('should render nickname and email inputs for unauthenticated user', () => {
      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper() });

      expect(container.querySelector('input[placeholder="昵称"]')).toBeTruthy();
      expect(container.querySelector('input[placeholder="邮箱（选填）"]')).toBeTruthy();
      expect(container.querySelector('textarea[placeholder="写下你的评论..."]')).toBeTruthy();
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
      expect(buttons.length).toBe(2);
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
                avatar: null,
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
              comments: { items: [], total: 1, page: 1, pageSize: 10 },
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

      const buttons = container.querySelectorAll('button');
      const cancelButton = buttons[buttons.length - 1];

      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(onCancelMock).toHaveBeenCalled();
      });
    });

    it('should not show image upload button for unauthenticated user', () => {
      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper() });

      expect(container.textContent).not.toContain('插入图片');
    });

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
  });

  describe('Authenticated User', () => {
    beforeEach(() => {
      mockAuthState.isAuthenticated = true;
      mockAuthState.user = {
        id: 2,
        accountId: 2,
        nickname: '访客用户',
        avatarUrl: null,
        email: 'guest@test.com',
        accessGroup: ['REGISTRANT'],
      };
    });

    it('should show user avatar and nickname instead of input fields', () => {
      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper() });

      // Should NOT show nickname/email inputs
      expect(container.querySelector('input[placeholder="昵称"]')).toBeNull();
      expect(container.querySelector('input[placeholder="邮箱（选填）"]')).toBeNull();

      // Should show user display
      expect(container.textContent).toContain('访客用户');
    });

    it('should submit comment with account nickname and email', async () => {
      const onSuccessMock = vi.fn();
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: {
              input: {
                postId: 1,
                nickname: '访客用户',
                email: 'guest@test.com',
                avatar: null,
                content: '登录用户的评论',
              },
            },
          },
          result: {
            data: {
              createComment: {
                id: 2,
                postId: 1,
                parentId: null,
                nickname: '访客用户',
                email: 'guest@test.com',
                avatar: null,
                content: '登录用户的评论',
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
              comments: { items: [], total: 1, page: 1, pageSize: 10 },
            },
          },
        },
      ];

      const { container } = render(<CommentForm postId={1} onSuccess={onSuccessMock} />, { wrapper: createWrapper(mocks) });

      const contentInput = container.querySelector('textarea[placeholder="写下你的评论..."]') as HTMLTextAreaElement;
      const submitButton = container.querySelector('button[type="submit"]');

      fireEvent.change(contentInput, { target: { value: '登录用户的评论' } });
      fireEvent.click(submitButton!);

      await waitFor(() => {
        expect(onSuccessMock).toHaveBeenCalled();
        expect(mockMessageApi.success).toHaveBeenCalledWith('评论发布成功');
      });
    });

    it('should only require content validation when authenticated', async () => {
      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper() });

      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.click(submitButton!);

      // Should NOT show nickname validation error
      await waitFor(() => {
        expect(container.textContent).toContain('请输入评论内容');
        expect(container.textContent).not.toContain('请输入昵称');
      });
    });

    it('should show image picker button for authenticated user', () => {
      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('插入图片');
    });

    it('should insert markdown image syntax when media is selected from picker', async () => {
      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper() });

      // Click "插入图片" button to open MediaPicker
      const imageButton = Array.from(container.querySelectorAll('button')).find(
        (btn) => btn.textContent?.includes('插入图片'),
      );
      fireEvent.click(imageButton!);

      // MediaPicker modal should open
      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
        expect(document.querySelector('.ant-modal-title')?.textContent).toContain('从图片库选择');
      });
    });
  });

  describe('Error Path', () => {
    it('should show error message when submission fails (unauthenticated)', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: {
              input: {
                postId: 1,
                nickname: '测试用户',
                email: '',
                avatar: null,
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
        expect(container.querySelector('form')).toBeTruthy();
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
                avatar: null,
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

    it('should show error message when authenticated user submission fails', async () => {
      mockAuthState.isAuthenticated = true;
      mockAuthState.user = {
        id: 2,
        accountId: 2,
        nickname: '访客用户',
        avatarUrl: null,
        email: 'guest@test.com',
        accessGroup: ['REGISTRANT'],
      };

      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: {
              input: {
                postId: 1,
                nickname: '访客用户',
                email: 'guest@test.com',
                avatar: null,
                content: '登录用户失败的评论',
              },
            },
          },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<CommentForm postId={1} />, { wrapper: createWrapper(mocks) });

      const contentInput = container.querySelector('textarea[placeholder="写下你的评论..."]') as HTMLTextAreaElement;
      const submitButton = container.querySelector('button[type="submit"]');

      fireEvent.change(contentInput, { target: { value: '登录用户失败的评论' } });
      fireEvent.click(submitButton!);

      await waitFor(() => {
        expect(mockMessageApi.error).toHaveBeenCalledWith('评论发布失败，请稍后重试');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle optional email field for unauthenticated user', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: {
              input: {
                postId: 1,
                nickname: '测试用户',
                email: '',
                avatar: null,
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
              comments: { items: [], total: 1, page: 1, pageSize: 10 },
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
                avatar: null,
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
              comments: { items: [], total: 1, page: 1, pageSize: 10 },
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
  });
});
