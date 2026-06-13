// src/app/layout/BlogLayout.spec.tsx

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { BlogLayout } from './BlogLayout';

// Mock matchMedia
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
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('BlogLayout', () => {
  const mockChildren = <div>Test Content</div>;

  it('should render header with logo', () => {
    render(
      <MemoryRouter>
        <BlogLayout>{mockChildren}</BlogLayout>
      </MemoryRouter>
    );

    const logos = screen.getAllByText('AIGC Blog');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('should render navigation links on desktop', () => {
    render(
      <MemoryRouter>
        <BlogLayout>{mockChildren}</BlogLayout>
      </MemoryRouter>
    );

    expect(screen.getAllByText('首页').length).toBeGreaterThan(0);
    expect(screen.getAllByText('分类').length).toBeGreaterThan(0);
    expect(screen.getAllByText('标签').length).toBeGreaterThan(0);
    expect(screen.getAllByText('归档').length).toBeGreaterThan(0);
    expect(screen.getAllByText('关于').length).toBeGreaterThan(0);
  });

  it('should render footer', () => {
    render(
      <MemoryRouter>
        <BlogLayout>{mockChildren}</BlogLayout>
      </MemoryRouter>
    );

    const footers = screen.getAllByText('© 2024 AIGC Blog. All rights reserved.');
    expect(footers.length).toBeGreaterThan(0);
  });

  it('should render children content', () => {
    render(
      <MemoryRouter>
        <BlogLayout>{mockChildren}</BlogLayout>
      </MemoryRouter>
    );

    const contents = screen.getAllByText('Test Content');
    expect(contents.length).toBeGreaterThan(0);
  });
});