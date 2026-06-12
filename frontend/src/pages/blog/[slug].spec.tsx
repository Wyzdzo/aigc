// src/pages/blog/[slug].spec.tsx

import { describe, expect, it, beforeAll, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Route, Routes, MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/client/testing/react';
import { BlogDetailPage } from './[slug]';
import { GET_POST_BY_SLUG } from '@/features/blog';

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
class IntersectionObserverMock {
  observe() {}
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
function createWrapper(mocks: any[], slug = 'react-18-new-features') {
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

    it('should render cover image when available', async () => {
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
        const img = container.querySelector('img');
        expect(img).toBeTruthy();
        expect(img?.src).toBe(mockPostWithToc.coverImage);
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
});
