// src/widgets/blog/CommentList.spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';

import type { BlogComment } from '@/entities/blog';
import { CommentStatus } from '@/entities/blog';
import { CREATE_COMMENT } from '@/features/blog';

import { CommentList } from './CommentList';

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
  const defaultMocks: MockedResponse[] = [
    {
      request: {
        query: CREATE_COMMENT,
        variables: { input: { postId: 1, parentId: 1, nickname: 'test', email: '', content: 'test' } },
      },
      result: { data: { createComment: { id: 999, status: 'PENDING' } } },
    },
  ];
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={[...defaultMocks, ...mocks]}>{children}</MockedProvider>;
  };
}

const mockComments: BlogComment[] = [
  {
    id: 1,
    postId: 1,
    parentId: null,
    nickname: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://ui-avatars.com/api/?name=张三',
    content: '文章写得很棒！',
    status: CommentStatus.APPROVED,
    likeCount: 12,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 2,
    postId: 1,
    parentId: 1,
    nickname: '李四',
    email: 'lisi@example.com',
    avatar: 'https://ui-avatars.com/api/?name=李四',
    content: '同意楼上的观点',
    status: CommentStatus.APPROVED,
    likeCount: 5,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 3,
    postId: 1,
    parentId: null,
    nickname: '王五',
    email: 'wangwu@example.com',
    avatar: null,
    content: '期待更多文章！',
    status: CommentStatus.APPROVED,
    likeCount: 8,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
];

describe('CommentList', () => {
  describe('Happy Path', () => {
    it('should render comment list with comments', () => {
      const { container } = render(<CommentList comments={mockComments} postId={1} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('张三');
      expect(container.textContent).toContain('文章写得很棒！');
      expect(container.textContent).toContain('李四');
      expect(container.textContent).toContain('同意楼上的观点');
    });

    it('should show empty state when no comments', () => {
      const { container } = render(<CommentList comments={[]} postId={1} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('暂无评论');
    });

    it('should show loading state', () => {
      const { container } = render(<CommentList comments={[]} postId={1} loading />, { wrapper: createWrapper() });

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should render reply buttons on all comments including child comments', () => {
      const { container } = render(<CommentList comments={mockComments} postId={1} />, { wrapper: createWrapper() });

      // 所有评论都应该有回复按钮（支持楼中楼）
      const replyButtons = Array.from(container.querySelectorAll('button')).filter(
        btn => btn.textContent === '回复',
      );
      // 3条评论（张三、李四、王五）各有1个回复按钮
      expect(replyButtons.length).toBe(3);
    });
  });

  describe('Error Path', () => {
    it('should handle comments with null avatar', () => {
      const commentsWithNullAvatar: BlogComment[] = [
        {
          id: 1,
          postId: 1,
          parentId: null,
          nickname: '测试用户',
          email: 'test@example.com',
          avatar: null,
          content: '测试评论',
          status: CommentStatus.APPROVED,
          likeCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const { container } = render(<CommentList comments={commentsWithNullAvatar} postId={1} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('测试用户');
    });
  });

  describe('Edge Cases', () => {
    it('should handle comments with only child comments', () => {
      const onlyChildComments: BlogComment[] = [
        {
          id: 2,
          postId: 1,
          parentId: 999,
          nickname: '孤儿评论',
          email: 'orphan@example.com',
          avatar: null,
          content: '这条评论没有父评论',
          status: CommentStatus.APPROVED,
          likeCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const { container } = render(<CommentList comments={onlyChildComments} postId={1} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('孤儿评论');
    });

    it('should handle single comment', () => {
      const singleComment: BlogComment[] = [{
        id: 1,
        postId: 1,
        parentId: null,
        nickname: '单个用户',
        email: 'single@example.com',
        avatar: null,
        content: '单个评论',
        status: CommentStatus.APPROVED,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }];

      const { container } = render(<CommentList comments={singleComment} postId={1} />, { wrapper: createWrapper() });

      expect(container.textContent).toContain('单个用户');
      expect(container.textContent).toContain('单个评论');
    });
  });
});
