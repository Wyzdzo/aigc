// src/pages/blog/[slug].spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { CommentStatus, GET_COMMENTS, GET_POST_BY_SLUG, LIKE_POST } from '@/features/blog';

import { BlogDetailPage } from './[slug]';

// Mock matchMedia
beforeAll(() => {
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

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

// Mock IntersectionObserver
class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: readonly number[] = [0];
  readonly scrollMargin: string = '0px';
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    // 立即触发回调，表示元素已进入视口
    this.callback([{
      isIntersecting: true,
      target,
      intersectionRatio: 1,
      time: 0,
      boundingClientRect: target.getBoundingClientRect(),
      rootBounds: null,
      intersectionRect: target.getBoundingClientRect(),
    }], this);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

/**
 * 创建测试包装器
 */
function createWrapper(mocks: MockedResponse[], slug = 'react-18-new-features') {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={[`/blog/${slug}`]}>
          <Routes>
            <Route path="/blog/:slug" element={children} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );
  };
}

/**
 * 带目录的 Markdown 内容
 */
const mockPostWithToc = {
  id: 1,
  title: 'React 18 新特性详解',
  slug: 'react-18-new-features',
  content: `# React 18 新特性详解

React 18 带来了许多令人兴奋的新特性。

## 并发渲染

并发渲染是 React 18 最重要的新特性之一。

## Suspense 改进

Suspense 在 React 18 中得到了显著改进。
`,
  summary: 'React 18 带来了并发渲染、自动批处理、Suspense 改进等重要特性。',
  coverImage: 'https://via.placeholder.com/800x400',
  status: 'PUBLISHED' as const,
  isTop: true,
  viewCount: 1234,
  likeCount: 56,
  categoryId: 1,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

/**
 * Mock 评论数据
 */
const mockComments = [
  {
    id: 1,
    postId: 1,
    parentId: null,
    nickname: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://ui-avatars.com/api/?name=张三&background=random',
    content: '文章写得很棒，学到了很多！',
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
    avatar: 'https://ui-avatars.com/api/?name=李四&background=random',
    content: '同意楼上的观点，React 18 的并发渲染确实很强大。',
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
    content: '写得不错，期待更多类似的内容。',
    status: CommentStatus.APPROVED,
    likeCount: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

/**
 * Mock 评论列表响应
 */
const mockCommentsResponse = {
  comments: {
    items: mockComments,
    total: 3,
    page: 1,
    pageSize: 10,
  },
};

/**
 * 不带目录的 Markdown 内容
 */
const mockPostWithoutToc = {
  id: 2,
  title: 'TypeScript 高级类型技巧',
  slug: 'typescript-advanced-types',
  content: `这是一篇没有标题的 Markdown 内容。

这里有一些段落内容，没有使用标题。
`,
  summary: '深入探讨 TypeScript 的高级类型。',
  coverImage: 'https://via.placeholder.com/800x400',
  status: 'PUBLISHED' as const,
  isTop: false,
  viewCount: 876,
  likeCount: 34,
  categoryId: 1,
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-10'),
};

describe('BlogDetailPage', () => {
  describe('Happy Path', () => {
    it('should render article title', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
      ];

      render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText('React 18 新特性详解').length).toBeGreaterThan(0);
      });
    });

    it('should render article meta information', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.anticon-eye')).toBeTruthy();
        expect(container.querySelector('.anticon-like')).toBeTruthy();
        expect(container.querySelector('.anticon-calendar')).toBeTruthy();
      });
    });

    it('should render article content with markdown', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
      ];

      render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText('并发渲染').length).toBeGreaterThan(0);
      });
    });

    it('should render TOC navigation when article has headings', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
      ];

      render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText('目录').length).toBeGreaterThan(0);
      });
    });

    it('should render top tag for featured post', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
      ];

      render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText(/置顶/).length).toBeGreaterThan(0);
      });
    });

    it('should not break when cover image is available', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        // 确保页面正常渲染，没有报错
        expect(container.querySelector('.ant-card')).toBeTruthy();
      });
    });

    it('should render breadcrumb navigation', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-breadcrumb')).toBeTruthy();
      });
    });
  });

  describe('Error Path', () => {
    it('should render loading state', () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: null },
          },
          delay: 10000, // 延迟返回，模拟加载状态
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should render error state when post not found', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'non-existent-post' },
          },
          result: {
            data: { postBySlug: null },
          },
        },
      ];

      render(<BlogDetailPage />, { wrapper: createWrapper(mocks, 'non-existent-post') });

      await waitFor(() => {
        expect(screen.getAllByText('文章不存在或加载失败').length).toBeGreaterThan(0);
        expect(screen.getAllByText('返回首页').length).toBeGreaterThan(0);
      });
    });

    it('should render error state when GraphQL error occurs', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          error: new Error('Network error'),
        },
      ];

      render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText('文章不存在或加载失败').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should render article without cover image', async () => {
      const postWithoutCover = {
        ...mockPostWithoutToc,
        coverImage: null,
      };

      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'typescript-advanced-types' },
          },
          result: {
            data: { postBySlug: postWithoutCover },
          },
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks, 'typescript-advanced-types') });

      await waitFor(() => {
        expect(screen.getAllByText('TypeScript 高级类型技巧').length).toBeGreaterThan(0);
        expect(container.querySelector('img')).toBeNull();
      });
    });

    it('should not render TOC when article has no headings', async () => {
      const postWithPlainContent = {
        ...mockPostWithoutToc,
        content: '这是一篇普通文章，没有任何标题。',
      };

      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'typescript-advanced-types' },
          },
          result: {
            data: { postBySlug: postWithPlainContent },
          },
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks, 'typescript-advanced-types') });

      await waitFor(() => {
        expect(container.querySelector('.ant-card-head-title')).toBeNull();
      });
    });

    it('should handle post without isTop flag', async () => {
      const postNotTop = {
        ...mockPostWithoutToc,
        isTop: false,
        content: '这是一篇普通文章，没有任何标题。',
      };

      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'typescript-advanced-types' },
          },
          result: {
            data: { postBySlug: postNotTop },
          },
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks, 'typescript-advanced-types') });

      await waitFor(() => {
        expect(container.querySelector('.ant-tag')).toBeNull();
      });
    });
  });

  describe('Like Button', () => {
    beforeAll(() => {
      vi.spyOn(message, 'success').mockReturnValue({} as ReturnType<typeof message.success>);
      vi.spyOn(message, 'info').mockReturnValue({} as ReturnType<typeof message.info>);
      vi.spyOn(message, 'error').mockReturnValue({} as ReturnType<typeof message.error>);
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    it('should render like button with initial count', async () => {
      const mocks = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        const likeButton = container.querySelector('button:has(.anticon-like)');
        expect(likeButton).toBeTruthy();
      });

      const likeButton = container.querySelector('button:has(.anticon-like)');
      expect(likeButton?.textContent).toContain('56');
    });

    it('should call likePost mutation when like button is clicked', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
        {
          request: {
            query: LIKE_POST,
            variables: { id: mockPostWithToc.id },
          },
          result: {
            data: {
              likePost: {
                ...mockPostWithToc,
                likeCount: mockPostWithToc.likeCount + 1,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        const likeButton = container.querySelector('button:has(.anticon-like)');
        expect(likeButton).toBeTruthy();
      });

      const likeButton = container.querySelector('button:has(.anticon-like)');
      if (likeButton) {
        fireEvent.click(likeButton);
      }

      await waitFor(() => {
        expect(message.success).toHaveBeenCalledWith('点赞成功');
      });
    });

    it('should show error message when like mutation fails', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
        {
          request: {
            query: LIKE_POST,
            variables: { id: mockPostWithToc.id },
          },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        const likeButton = container.querySelector('button:has(.anticon-like)');
        expect(likeButton).toBeTruthy();
      });

      const likeButton = container.querySelector('button:has(.anticon-like)');
      if (likeButton) {
        fireEvent.click(likeButton);
      }

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('点赞失败，请稍后重试');
      });
    });
  });

  describe('Comment Section', () => {
    it('should render comment section with form', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 1, pageSize: 10 },
          },
          result: {
            data: mockCommentsResponse,
          },
        },
      ];

      render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText(/评论/).length).toBeGreaterThan(0);
      });
    });

    it('should render comment count in section title', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 1, pageSize: 10 },
          },
          result: {
            data: mockCommentsResponse,
          },
        },
      ];

      render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText('评论 (3)').length).toBeGreaterThan(0);
      });
    });

    it('should render comment form with nickname and content fields', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 1, pageSize: 10 },
          },
          result: {
            data: mockCommentsResponse,
          },
        },
      ];

      const { container } = render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        const nicknameInput = container.querySelector('input[placeholder="昵称"]');
        const contentTextarea = container.querySelector('textarea[placeholder="写下你的评论..."]');
        expect(nicknameInput).toBeTruthy();
        expect(contentTextarea).toBeTruthy();
      });
    });

    it('should render nested comments with reply indicators', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
          },
        },
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 1, page: 1, pageSize: 10 },
          },
          result: {
            data: mockCommentsResponse,
          },
        },
      ];

      render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        // 验证根评论显示
        expect(screen.getAllByText('张三').length).toBeGreaterThan(0);
        expect(screen.getAllByText('王五').length).toBeGreaterThan(0);
      });

      // 验证回复评论（嵌套评论）也显示
      expect(screen.getAllByText('李四').length).toBeGreaterThan(0);
    });

    it('should show empty state when no comments', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_POST_BY_SLUG,
            variables: { slug: 'react-18-new-features' },
          },
          result: {
            data: { postBySlug: mockPostWithToc },
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
                total: 0,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      render(<BlogDetailPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(screen.getAllByText(/暂无评论/).length).toBeGreaterThan(0);
      });
    });
  });
});
