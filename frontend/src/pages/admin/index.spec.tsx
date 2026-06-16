// src/pages/admin/index.spec.tsx

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { useQuery } from '@apollo/client/react';

import { AdminDashboardPage } from './index';

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

  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverMock;
});

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(() => ({
    data: {
      postStats: { total: 10, published: 8, draft: 2 },
      commentStats: { total: 50, pending: 3, approved: 45, rejected: 2 },
      categoryStats: { total: 5 },
      tagStats: { total: 20 },
      linkStats: { total: 15 },
    },
    loading: false,
    error: null,
  })),
}));

const mockedUseQuery = vi.mocked(useQuery);

describe('AdminDashboardPage', () => {
  describe('Happy Path', () => {
    it('should render page without crashing', () => {
      const { container } = render(
        <BrowserRouter>
          <AdminDashboardPage />
        </BrowserRouter>
      );
      expect(container).toBeTruthy();
    });

    it('should display dashboard title', () => {
      const headings = screen.getAllByText('仪表盘');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should display page subtitle', () => {
      const subtitles = screen.getAllByText(/欢迎回来/);
      expect(subtitles.length).toBeGreaterThan(0);
    });

    it('should display stat cards', () => {
      const { container } = render(
        <BrowserRouter>
          <AdminDashboardPage />
        </BrowserRouter>
      );
      const statCards = container.querySelectorAll('.ant-card');
      expect(statCards.length).toBeGreaterThan(0);
    });

    it('should display stat card titles', () => {
      const statTitles = [
        '文章总数',
        '评论总数',
        '分类数量',
        '标签数量',
        '友链数量',
        '已发布',
        '待审核评论',
        '草稿',
      ];

      statTitles.forEach(title => {
        const elements = screen.getAllByText(title);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it('should display quick actions section', () => {
      const { container } = render(
        <BrowserRouter>
          <AdminDashboardPage />
        </BrowserRouter>
      );
      expect(container.textContent).toContain('快捷操作');
    });

    it('should display quick action buttons', () => {
      const quickActions = [
        '写文章',
        '管理评论',
        '分类管理',
        '标签管理',
        '友链管理',
        '系统设置',
      ];

      quickActions.forEach(action => {
        const elements = screen.getAllByText(action);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it('should display recent activities section', () => {
      const sections = screen.getAllByText('最近动态');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('should display statistics from query', () => {
      const { container } = render(
        <BrowserRouter>
          <AdminDashboardPage />
        </BrowserRouter>
      );

      const statValues = container.querySelectorAll('.ant-statistic-content-value');
      expect(statValues.length).toBeGreaterThan(0);
    });
  });

  describe('Error Path', () => {
    it('should display loading state when data is loading', async () => {
      mockedUseQuery.mockReturnValue({
        data: null,
        loading: true,
        error: undefined,
        client: {} as any,
        observable: {} as any,
        networkStatus: 1,
        startPolling: vi.fn(),
        stopPolling: vi.fn(),
        refetch: vi.fn(),
        fetchMore: vi.fn(),
        updateQuery: vi.fn(),
        variables: {},
        subscribeToMore: vi.fn(),
        dataState: 'complete' as const,
      });

      const { container } = render(
        <BrowserRouter>
          <AdminDashboardPage />
        </BrowserRouter>
      );

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should display error state when query fails', async () => {
      mockedUseQuery.mockReturnValue({
        data: null,
        loading: false,
        error: new Error('Network error'),
        client: {} as any,
        observable: {} as any,
        networkStatus: 7,
        startPolling: vi.fn(),
        stopPolling: vi.fn(),
        refetch: vi.fn(),
        fetchMore: vi.fn(),
        updateQuery: vi.fn(),
        variables: {},
        subscribeToMore: vi.fn(),
        dataState: 'complete' as const,
      });

      const { container } = render(
        <BrowserRouter>
          <AdminDashboardPage />
        </BrowserRouter>
      );

      expect(container.textContent).toContain('加载失败');
    });
  });
});