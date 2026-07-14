// src/widgets/blog/GuestbookList.spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { fireEvent,render, waitFor } from '@testing-library/react';
import { beforeAll,describe, expect, it, vi } from 'vitest';

import type { BlogComment } from '@/entities/blog';
import { CommentStatus } from '@/entities/blog';

import { GUESTBOOK_POST_ID,GuestbookList } from './GuestbookList';

// Mock ResizeObserver and matchMedia
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

function createWrapper(mocks: MockedResponse[] = []) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

const mockGuestbookComments: BlogComment[] = [
  {
    id: 1,
    postId: 0,
    parentId: null,
    nickname: '张三',
    email: 'zhangsan@example.com',
    avatar: null,
    content: '博主写得真好！',
    status: CommentStatus.APPROVED,
    likeCount: 10,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    postId: 0,
    parentId: 1,
    nickname: '博主',
    email: 'admin@example.com',
    avatar: null,
    content: '感谢支持！',
    status: CommentStatus.APPROVED,
    likeCount: 5,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 3,
    postId: 0,
    parentId: null,
    nickname: '李四',
    email: 'lisi@example.com',
    avatar: null,
    content: '请问有计划支持 RSS 订阅吗？',
    status: CommentStatus.APPROVED,
    likeCount: 8,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
];

describe('GuestbookList', () => {
  describe('Happy Path', () => {
    it('should render guestbook list with comments', () => {
      const { container } = render(<GuestbookList comments={mockGuestbookComments} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('张三');
      expect(container.textContent).toContain('博主写得真好！');
      expect(container.textContent).toContain('博主');
      expect(container.textContent).toContain('感谢支持！');
      expect(container.textContent).toContain('李四');
    });

    it('should show empty state when no comments', () => {
      const { container } = render(<GuestbookList comments={[]} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('暂无留言');
    });

    it('should show loading state', () => {
      const { container } = render(<GuestbookList comments={[]} loading />, { wrapper: createWrapper() });

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should toggle reply form when reply button is clicked', async () => {
      const onReplySuccessMock = vi.fn();
      const { container } = render(<GuestbookList comments={mockGuestbookComments} onReplySuccess={onReplySuccessMock} />, { wrapper: createWrapper() });

      const replyButtons = container.querySelectorAll('button');
      const firstReplyButton = Array.from(replyButtons).find(btn => btn.textContent === '回复');

      if (firstReplyButton) {
        fireEvent.click(firstReplyButton);
      }

      // 点击回复按钮后应显示回复表单，而不是触发 onReplySuccess
      await waitFor(() => {
        expect(container.querySelector('textarea')).toBeTruthy();
      });
      expect(onReplySuccessMock).not.toHaveBeenCalled();
    });

    it('should render nested replies under parent comment', () => {
      const { container } = render(<GuestbookList comments={mockGuestbookComments} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('感谢支持！');
    });
  });

  describe('Error Path', () => {
    it('should handle empty comments array', () => {
      const { container } = render(<GuestbookList comments={[]} />, { wrapper: createWrapper() });

      expect(container.querySelector('.ant-empty')).toBeTruthy();
    });

    it('should handle comments with only child comments (orphan comments)', () => {
      const orphanComments: BlogComment[] = [
        {
          id: 4,
          postId: 0,
          parentId: 999,
          nickname: '孤儿留言',
          email: 'orphan@example.com',
          avatar: null,
          content: '这条留言没有父留言',
          status: CommentStatus.APPROVED,
          likeCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const { container } = render(<GuestbookList comments={orphanComments} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('孤儿留言');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single comment without replies', () => {
      const singleComment: BlogComment[] = [{
        id: 1,
        postId: 0,
        parentId: null,
        nickname: '唯一用户',
        email: 'only@example.com',
        avatar: null,
        content: '唯一的留言',
        status: CommentStatus.APPROVED,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }];

      const { container } = render(<GuestbookList comments={singleComment} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('唯一用户');
      expect(container.textContent).toContain('唯一的留言');
    });

    it('should handle comment with null email', () => {
      const commentWithNullEmail: BlogComment[] = [
        {
          id: 1,
          postId: 0,
          parentId: null,
          nickname: '匿名用户',
          email: '',
          avatar: null,
          content: '没有邮箱的留言',
          status: CommentStatus.APPROVED,
          likeCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const { container } = render(<GuestbookList comments={commentWithNullEmail} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('匿名用户');
      expect(container.textContent).toContain('没有邮箱的留言');
    });

    it('should show avatar fallback with nickname initial', () => {
      const commentWithEmail: BlogComment[] = [
        {
          id: 1,
          postId: 0,
          parentId: null,
          nickname: '测试用户',
          email: 'test@example.com',
          avatar: null,
          content: '测试内容',
          status: CommentStatus.APPROVED,
          likeCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const { container } = render(<GuestbookList comments={commentWithEmail} />, { wrapper: createWrapper() });

      const avatars = container.querySelectorAll('.ant-avatar');
      expect(avatars.length).toBeGreaterThan(0);
      // Avatar 使用 nickname 首字作为 fallback 文字
      expect(avatars[0].textContent).toBe('测');
    });
  });
});

describe('GUESTBOOK_POST_ID', () => {
  it('should be 0', () => {
    expect(GUESTBOOK_POST_ID).toBe(0);
  });
});
