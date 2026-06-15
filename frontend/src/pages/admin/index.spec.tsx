// src/pages/admin/index.spec.tsx

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AdminDashboardPage } from './index';

// Mock window globals for Ant Design
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

// Mock Apollo useQuery hook - 静态 mock
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

      // 验证统计卡片包含数值
      const statValues = container.querySelectorAll('.ant-statistic-content-value');
      expect(statValues.length).toBeGreaterThan(0);
    });
  });
});