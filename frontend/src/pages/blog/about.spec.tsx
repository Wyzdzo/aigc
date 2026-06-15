// src/pages/blog/about.spec.tsx

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { BlogAboutPage } from './about';

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

describe('BlogAboutPage', () => {
  it('should render page without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <BlogAboutPage />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });

  it('should contain main content elements', () => {
    const { container } = render(
      <MemoryRouter>
        <BlogAboutPage />
      </MemoryRouter>
    );

    // 检查页面标题（h2）
    const headings = container.querySelectorAll('h2');
    const hasAboutHeading = Array.from(headings).some(
      h => h.textContent === '关于我'
    );
    expect(hasAboutHeading).toBe(true);

    // 检查博主名称
    const h3s = container.querySelectorAll('h3');
    const hasAuthorName = Array.from(h3s).some(
      h => h.textContent === 'AIGC Blog'
    );
    expect(hasAuthorName).toBe(true);

    // 检查社交链接
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(2);

    // 检查技能标签
    const skillTags = container.querySelectorAll('.ant-tag');
    expect(skillTags.length).toBeGreaterThan(5);
  });

  it('should have social links with proper security attributes', () => {
    const { container } = render(
      <MemoryRouter>
        <BlogAboutPage />
      </MemoryRouter>
    );

    const links = container.querySelectorAll('a');
    links.forEach(link => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });
});