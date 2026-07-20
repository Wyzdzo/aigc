// src/widgets/blog/CommentList.spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';

import type { BlogComment } from '@/entities/blog';
import { CommentStatus } from '@/entities/blog';
import { CREATE_COMMENT, LIKE_COMMENT } from '@/features/blog';
import { GET_MEDIA_LIST } from '@/features/media';

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
  const defaultMocks: MockedResponse[] = [
    {
      request: {
        query: CREATE_COMMENT,
        variables: { input: { postId: 1, parentId: 1, nickname: 'test', email: '', avatar: null, content: 'test' } },
      },
      result: { data: { createComment: { id: 999, status: 'PENDING' } } },
    },
  ];
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={[...defaultMocks, ...mocks, mediaListMock]}>{children}</MockedProvider>;
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
  afterEach(() => {
    vi.clearAllMocks();
  });

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

      const replyButtons = Array.from(container.querySelectorAll('button')).filter(
        btn => btn.textContent === '回复',
      );
      expect(replyButtons.length).toBe(3);
    });

    it('should render like buttons with like count', () => {
      const { container } = render(<CommentList comments={mockComments} postId={1} />, { wrapper: createWrapper() });

      // 每条评论都应有点赞按钮（包含 SVG 图标的按钮）
      const allButtons = container.querySelectorAll('button');
      // 点赞按钮包含 SVG，不是"回复"和"收起"按钮
      const likeButtons = Array.from(allButtons).filter(
        (btn) => btn.querySelector('svg') && !btn.textContent?.includes('回复') && !btn.textContent?.includes('收起') && !btn.textContent?.includes('展开'),
      );
      expect(likeButtons.length).toBeGreaterThanOrEqual(3);

      // 点赞按钮应显示 likeCount 数字
      const likeCounts = likeButtons.map((btn) => btn.textContent);
      expect(likeCounts.some((text) => text?.includes('12'))).toBe(true);
      expect(likeCounts.some((text) => text?.includes('5'))).toBe(true);
      expect(likeCounts.some((text) => text?.includes('8'))).toBe(true);
    });

    it('should like a comment on click', async () => {
      const likeMock: MockedResponse = {
        request: {
          query: LIKE_COMMENT,
          variables: { id: 1 },
        },
        result: {
          data: { likeComment: true },
        },
      };

      const { container } = render(<CommentList comments={[mockComments[0]]} postId={1} />, { wrapper: createWrapper([likeMock]) });

      // 找到点赞按钮（包含 SVG 的非文字按钮）
      const allButtons = container.querySelectorAll('button');
      const likeButton = Array.from(allButtons).find(
        (btn) => btn.querySelector('svg') && !btn.textContent?.includes('回复') && !btn.textContent?.includes('收起'),
      );
      expect(likeButton).toBeTruthy();
      fireEvent.click(likeButton!);

      await waitFor(() => {
        // After like, count should increase
        expect(likeButton!.textContent).toContain('13');
      });
    });
  });

  describe('Image Rendering', () => {
    it('should render markdown image syntax as img element', () => {
      const commentWithImage: BlogComment[] = [
        {
          id: 10,
          postId: 1,
          parentId: null,
          nickname: '图片用户',
          email: 'img@example.com',
          avatar: null,
          content: '看这张图 ![截图](https://example.com/screenshot.png) 很酷吧',
          status: CommentStatus.APPROVED,
          likeCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const { container } = render(<CommentList comments={commentWithImage} postId={1} />, { wrapper: createWrapper() });

      const img = container.querySelector('img[src="https://example.com/screenshot.png"]');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('alt')).toBe('截图');
      expect(container.textContent).toContain('看这张图');
      expect(container.textContent).toContain('很酷吧');
    });

    it('should render plain text comment without img element', () => {
      const { container } = render(<CommentList comments={[mockComments[0]]} postId={1} />, { wrapper: createWrapper() });

      // Should not have any <img> tags in the content area (Avatar is also an img, so check context)
      const contentImgs = container.querySelectorAll('.mt-1\\.5 img');
      expect(contentImgs.length).toBe(0);
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

    it('should not change like state when like mutation fails', async () => {
      const likeErrorMock: MockedResponse = {
        request: {
          query: LIKE_COMMENT,
          variables: { id: 1 },
        },
        error: new Error('Network error'),
      };

      const { container } = render(<CommentList comments={[mockComments[0]]} postId={1} />, { wrapper: createWrapper([likeErrorMock]) });

      const allButtons = container.querySelectorAll('button');
      const likeButton = Array.from(allButtons).find(
        (btn) => btn.querySelector('svg') && !btn.textContent?.includes('回复') && !btn.textContent?.includes('收起'),
      );
      fireEvent.click(likeButton!);

      await waitFor(() => {
        // Count should NOT change on error
        expect(likeButton!.textContent).toContain('12');
      });
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
