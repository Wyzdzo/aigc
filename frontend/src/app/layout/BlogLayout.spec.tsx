// src/app/layout/BlogLayout.spec.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@/app/providers';

import { BlogLayout } from './BlogLayout';

// Mock matchMedia & ResizeObserver (required by Ant Design components)
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  globalThis.ResizeObserver = class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </ThemeProvider>
  );
}

describe('BlogLayout', () => {
  const mockChildren = <div>Test Content</div>;

  it('should render header with logo', () => {
    render(<BlogLayout>{mockChildren}</BlogLayout>, { wrapper });

    const logos = screen.getAllByText('AIGC Blog');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('should render navigation links on desktop', () => {
    render(<BlogLayout>{mockChildren}</BlogLayout>, { wrapper });

    expect(screen.getAllByText('首页').length).toBeGreaterThan(0);
    expect(screen.getAllByText('分类').length).toBeGreaterThan(0);
    expect(screen.getAllByText('标签').length).toBeGreaterThan(0);
    expect(screen.getAllByText('归档').length).toBeGreaterThan(0);
    expect(screen.getAllByText('关于').length).toBeGreaterThan(0);
  });

  it('should render footer', () => {
    render(<BlogLayout>{mockChildren}</BlogLayout>, { wrapper });

    const footers = screen.getAllByText(/© \d{4} AIGC Blog\. All rights reserved\./);
    expect(footers.length).toBeGreaterThan(0);
  });

  it('should render children content', () => {
    render(<BlogLayout>{mockChildren}</BlogLayout>, { wrapper });

    const contents = screen.getAllByText('Test Content');
    expect(contents.length).toBeGreaterThan(0);
  });

  it('should render a link that navigates to home page "/"', () => {
    const { container } = render(<BlogLayout>{mockChildren}</BlogLayout>, { wrapper });

    // The HomeOutlined button is inside a Link to "/"
    const homeLinks = container.querySelectorAll('a[href="/"]');
    expect(homeLinks.length).toBeGreaterThan(0);
  });
});
