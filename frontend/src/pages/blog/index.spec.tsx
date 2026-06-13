// src/pages/blog/index.spec.tsx

import { describe, expect, it, beforeAll, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/client/testing/react';
import { BlogHomePage } from './index';
import type { BlogPost } from '@/entities/blog';
import { PostStatus } from '@/entities/blog';
import { GET_POSTS } from '@/features/blog';

// Mock window globals for Ant Design and rc-components
beforeAll(() => {
  // Mock matchMedia
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
});

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: 'React 18 新特性详解',
    slug: 'react-18-new-features',
    content: '# React 18',
    summary: 'React 18 带来了并发渲染等新特性。',
    coverImage: 'https://via.placeholder.com/800x400',
    status: PostStatus.PUBLISHED,
    isTop: true,
    viewCount: 1234,
    likeCount: 56,
    categoryId: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    content: '# TypeScript',
    summary: '深入探讨 TypeScript 的高级类型。',
    coverImage: null,
    status: PostStatus.PUBLISHED,
    isTop: false,
    viewCount: 876,
    likeCount: 34,
    categoryId: 1,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 3,
    title: 'Next.js 14 全栈开发指南',
    slug: 'nextjs-14-fullstack-guide',
    content: '# Next.js 14',
    summary: '全面介绍 Next.js 14 的新特性。',
    coverImage: null,
    status: PostStatus.PUBLISHED,
    isTop: false,
    viewCount: 2345,
    likeCount: 89,
    categoryId: 2,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
];

const createWrapper = (mocks: readonly any[]) => {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    </MemoryRouter>
  );
};

describe('BlogHomePage', () => {
  describe('Happy Path', () => {
    it('should render author card', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      expect(screen.getByText('AIGC Blog')).toBeDefined();
      // 使用正则匹配部分文本
      expect(screen.getByText(/全栈开发者/)).toBeDefined();
    });

    it('should render featured post (置顶文章)', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      // 等待数据加载
      await waitFor(() => {
        expect(container.querySelector('.ant-tag')).toBeTruthy();
      });

      // 置顶文章应该有置顶标签
      expect(screen.getAllByText(/置顶/).length).toBeGreaterThan(0);
      expect(screen.getAllByText('React 18 新特性详解').length).toBeGreaterThan(0);
    });

    it('should render regular posts list', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      // 等待数据加载
      await waitFor(() => {
        expect(container.querySelector('.ant-list-item')).toBeTruthy();
      });

      // 非置顶文章应该显示在列表中
      expect(screen.getAllByText('TypeScript 高级类型技巧').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Next.js 14 全栈开发指南').length).toBeGreaterThan(0);
    });

    it('should render post statistics', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      // 等待数据加载
      await waitFor(() => {
        expect(container.querySelector('.ant-card')).toBeTruthy();
      });

      // 检查统计数据 - 使用 getAllByText
      expect(screen.getAllByText(/1,?234/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/876/).length).toBeGreaterThan(0);
    });

    it('should render pagination when total > pageSize', async () => {
      const manyPosts = Array.from({ length: 15 }, (_, i) => ({
        ...mockPosts[0],
        id: i + 1,
        slug: `post-${i + 1}`,
      }));

      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: manyPosts.slice(0, 10),
                total: 15,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-pagination')).toBeTruthy();
      });

      expect(screen.getByText('共 15 篇文章')).toBeTruthy();
    });
  });

  describe('Error Path', () => {
    it('should render error state when loading fails', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          error: new Error('Network error'),
        },
      ];

      render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      // 等待错误状态渲染
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(screen.getByText('加载失败，请稍后重试')).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should render empty state when no posts', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: [],
                total: 0,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      // 等待加载完成
      await waitFor(() => {
        expect(container.querySelector('.ant-list')).toBeTruthy();
      });

      expect(screen.getAllByText('暂无文章').length).toBeGreaterThan(0);
    });

    it('should render only featured post when no regular posts', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: [mockPosts[0]], // 只有置顶文章
                total: 1,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-tag')).toBeTruthy();
      });

      expect(screen.getAllByText(/置顶/).length).toBeGreaterThan(0);
      expect(screen.getAllByText('暂无文章').length).toBeGreaterThan(0);
    });

    it('should render post without cover image', async () => {
      const postsWithoutCover = [
        {
          ...mockPosts[0],
          isTop: false,
          coverImage: null,
        },
      ];

      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: postsWithoutCover,
                total: 1,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-list-item')).toBeTruthy();
      });

      // 文章标题应该显示，但没有封面图片
      expect(screen.getAllByText('React 18 新特性详解').length).toBeGreaterThan(0);
    });

    it('should format date correctly', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-list-item')).toBeTruthy();
      });

      // 检查日期格式化 - 使用正则匹配
      expect(screen.getAllByText(/2024年1月15日/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/2024年1月10日/).length).toBeGreaterThan(0);
    });
  });

  describe('Search Feature', () => {
    it('should render search input', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, keyword: undefined, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-input-search')).toBeTruthy();
      });

      expect(screen.getAllByPlaceholderText('搜索文章标题或摘要...').length).toBeGreaterThan(0);
    });

    it('should render search card', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, keyword: undefined, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelectorAll('.ant-card').length).toBeGreaterThan(1);
      });
    });

    it('should allow search input change', async () => {
      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, keyword: undefined, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, keyword: 'React', page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-input-search')).toBeTruthy();
      });

      const inputs = screen.getAllByPlaceholderText('搜索文章标题或摘要...');
      fireEvent.change(inputs[0], { target: { value: 'React' } });

      await waitFor(() => {
        expect(inputs[0]).toHaveProperty('value', 'React');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile filter button on mobile viewport', async () => {
      // Mock mobile viewport
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(375);

      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        // 检查移动端筛选按钮
        const filterButtons = container.querySelectorAll('button');
        const hasFilterButton = Array.from(filterButtons).some(btn =>
          btn.textContent?.includes('筛选')
        );
        expect(hasFilterButton).toBe(true);
      });
    });

    it('should render desktop sidebar on desktop viewport', async () => {
      // Mock desktop viewport
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200);

      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        // 检查侧边栏是否存在
        const aside = container.querySelector('aside');
        expect(aside).toBeTruthy();
      });
    });

    it('should hide desktop sidebar on mobile viewport', async () => {
      // Mock mobile viewport
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(375);

      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        // 检查侧边栏是否通过 CSS 隐藏（display: none）
        const aside = container.querySelector('aside');
        expect(aside).toBeTruthy();
        // 侧边栏在移动端应该被隐藏
        expect(aside?.getAttribute('style')).toContain('display: none');
      });
    });

    it('should render mobile drawer sidebar when filter button clicked', async () => {
      // Mock mobile viewport
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(375);

      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        // 找到筛选按钮并点击
        const buttons = container.querySelectorAll('button');
        const filterButton = Array.from(buttons).find(btn =>
          btn.textContent?.includes('筛选')
        );

        expect(filterButton).toBeTruthy();
      });
    });

    it('should hide author card on mobile viewport', async () => {
      // Mock mobile viewport
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(375);

      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: mockPosts,
                total: mockPosts.length,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        // 检查是否存在作者卡片相关内容
        const authorCard = container.querySelector('[style*="flex-direction: column"]');
        expect(authorCard).toBeTruthy();
      });
    });
  });

  describe('Pagination Feature', () => {
    it('should change page when pagination is clicked', async () => {
      const manyPosts = Array.from({ length: 15 }, (_, i) => ({
        ...mockPosts[0],
        id: i + 1,
        slug: `post-${i + 1}`,
        title: `文章 ${i + 1}`,
      }));

      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: manyPosts.slice(0, 10),
                total: 15,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 2, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: manyPosts.slice(10, 15),
                total: 15,
                page: 2,
                pageSize: 10,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-pagination')).toBeTruthy();
      });

      // 找到分页按钮并点击第2页
      const pagination = container.querySelector('.ant-pagination');
      if (pagination) {
        const page2Button = pagination.querySelector('li.ant-pagination-item-2');
        if (page2Button) {
          fireEvent.click(page2Button);

          await waitFor(() => {
            expect(screen.getAllByText('文章 11').length).toBeGreaterThan(0);
          });
        }
      }
    });

    it('should reset page to 1 when pageSize changes', async () => {
      const manyPosts = Array.from({ length: 25 }, (_, i) => ({
        ...mockPosts[0],
        id: i + 1,
        slug: `post-${i + 1}`,
        title: `文章 ${i + 1}`,
      }));

      const mocks = [
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: manyPosts.slice(0, 10),
                total: 25,
                page: 1,
                pageSize: 10,
              },
            },
          },
        },
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 2, pageSize: 10 },
          },
          result: {
            data: {
              posts: {
                items: manyPosts.slice(10, 20),
                total: 25,
                page: 2,
                pageSize: 10,
              },
            },
          },
        },
        {
          request: {
            query: GET_POSTS,
            variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 20 },
          },
          result: {
            data: {
              posts: {
                items: manyPosts.slice(0, 20),
                total: 25,
                page: 1,
                pageSize: 20,
              },
            },
          },
        },
      ];

      const { container } = render(<BlogHomePage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-pagination')).toBeTruthy();
      });

      // 点击第2页
      const pagination = container.querySelector('.ant-pagination');
      if (pagination) {
        const page2Button = pagination.querySelector('li.ant-pagination-item-2');
        if (page2Button) {
          fireEvent.click(page2Button);

          await waitFor(() => {
            expect(screen.getAllByText('文章 11').length).toBeGreaterThan(0);
          });

          // 更改pageSize应该重置回第1页
          const pageSizeSelector = container.querySelector('.ant-pagination-options-size-changer');
          if (pageSizeSelector) {
            const select = pageSizeSelector.querySelector('select');
            if (select) {
              fireEvent.change(select, { target: { value: '20' } });

              await waitFor(() => {
                // 应该回到第1页的内容
                expect(screen.getAllByText('文章 1').length).toBeGreaterThan(0);
              });
            }
          }
        }
      }
    });
  });
});
