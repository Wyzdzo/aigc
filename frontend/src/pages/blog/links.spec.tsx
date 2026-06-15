// src/pages/blog/links.spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { GET_ACTIVE_LINKS } from '@/features/blog/infrastructure/graphql/queries';

import { BlogLinksPage } from './links';

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

function createWrapper(mocks: MockedResponse[] = []) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockedProvider mocks={mocks}>
        <BrowserRouter>{children}</BrowserRouter>
      </MockedProvider>
    );
  };
}

// Mock link data
const mockLinks = [
  {
    id: 1,
    title: 'React 官方文档',
    url: 'https://react.dev',
    description: 'React 官方文档',
    logo: 'https://via.placeholder.com/64',
    status: 'ACTIVE',
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    title: 'Vue 官方文档',
    url: 'https://vuejs.org',
    description: 'Vue 官方文档',
    logo: 'https://via.placeholder.com/64',
    status: 'ACTIVE',
    sortOrder: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const successMocks: MockedResponse[] = [
  {
    request: { query: GET_ACTIVE_LINKS },
    result: {
      data: {
        activeLinks: mockLinks,
      },
    },
  },
];

const emptyMocks: MockedResponse[] = [
  {
    request: { query: GET_ACTIVE_LINKS },
    result: {
      data: {
        activeLinks: [],
      },
    },
  },
];

describe('BlogLinksPage', () => {
  describe('Happy Path', () => {
    it('should render page without crashing', () => {
      const { container } = render(<BlogLinksPage />, { wrapper: createWrapper(successMocks) });
      expect(container).toBeTruthy();
    });

    it('should contain main content elements', () => {
      const { container } = render(<BlogLinksPage />, { wrapper: createWrapper(successMocks) });

      // 检查页面标题
      const headings = container.querySelectorAll('h2');
      const hasLinksHeading = Array.from(headings).some(
        h => h.textContent === '友情链接'
      );
      expect(hasLinksHeading).toBe(true);

      // 检查申请友链按钮
      const buttons = container.querySelectorAll('button');
      const hasApplyButton = Array.from(buttons).some(
        b => b.textContent === '申请友链'
      );
      expect(hasApplyButton).toBe(true);
    });

    it('should display link cards with proper security attributes', async () => {
      const { container } = render(<BlogLinksPage />, { wrapper: createWrapper(successMocks) });

      // 等待数据加载
      await new Promise(resolve => setTimeout(resolve, 100));

      // 检查链接卡片
      const links = container.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);

      // 检查安全属性
      links.forEach(link => {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      });
    });

    it('should have apply link button', () => {
      const { getAllByText } = render(<BlogLinksPage />, { wrapper: createWrapper(successMocks) });

      // 检查申请友链按钮存在
      const applyButtons = getAllByText('申请友链');
      expect(applyButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Error Path', () => {
    it('should display empty state when no links available', async () => {
      const { container } = render(<BlogLinksPage />, { wrapper: createWrapper(emptyMocks) });

      // 等待数据加载
      await new Promise(resolve => setTimeout(resolve, 100));

      // 检查空状态
      const emptyElement = container.querySelector('.ant-empty');
      expect(emptyElement).not.toBeNull();
    });
  });
});