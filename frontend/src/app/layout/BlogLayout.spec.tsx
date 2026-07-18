// src/app/layout/BlogLayout.spec.tsx

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';

import { ThemeProvider } from '@/app/providers';
import { TOKEN_KEY, USER_KEY } from '@/shared/graphql/auth-constants';

import { BlogLayout } from './BlogLayout';

// Mock configureGraphQLRuntime since AuthProvider calls it
vi.mock('@/shared/graphql/client', () => ({
  configureGraphQLRuntime: vi.fn(),
}));

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
      <MockedProvider mocks={[]}>
        <MemoryRouter>{children}</MemoryRouter>
      </MockedProvider>
    </ThemeProvider>
  );
}

describe('BlogLayout', () => {
  const mockChildren = <div>Test Content</div>;

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

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

    const homeLinks = container.querySelectorAll('a[href="/"]');
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  it('should show login button when not authenticated', () => {
    render(<BlogLayout>{mockChildren}</BlogLayout>, { wrapper });

    expect(screen.getByText('登录')).toBeTruthy();
  });

  it('should show admin menu items for admin user', async () => {
    localStorage.setItem(TOKEN_KEY, 'fake-token');
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: 1,
      accountId: 1,
      nickname: 'Admin',
      avatarUrl: null,
      email: 'admin@test.com',
      accessGroup: ['ADMIN'],
    }));

    // Need to re-import AuthProvider dynamically to pick up localStorage changes
    const { AuthProvider } = await import('@/features/auth');
    function adminWrapper({ children }: { children: React.ReactNode }) {
      return (
        <ThemeProvider>
          <MockedProvider mocks={[]}>
            <AuthProvider>
              <MemoryRouter>{children}</MemoryRouter>
            </AuthProvider>
          </MockedProvider>
        </ThemeProvider>
      );
    }

    render(<BlogLayout>{mockChildren}</BlogLayout>, { wrapper: adminWrapper });

    // Admin should see their nickname
    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeTruthy();
    });

    // Click on avatar dropdown to open menu
    const avatarButton = screen.getByText('Admin');
    fireEvent.click(avatarButton);

    await waitFor(() => {
      expect(screen.getByText('修改博主信息')).toBeTruthy();
      expect(screen.getByText('后台管理')).toBeTruthy();
      expect(screen.queryByText('个人资料')).toBeNull();
    });
  });

  it('should show profile menu item for non-admin user', async () => {
    localStorage.setItem(TOKEN_KEY, 'fake-token');
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: 2,
      accountId: 2,
      nickname: 'Guest',
      avatarUrl: null,
      email: 'guest@test.com',
      accessGroup: ['REGISTRANT'],
    }));

    const { AuthProvider } = await import('@/features/auth');
    function guestWrapper({ children }: { children: React.ReactNode }) {
      return (
        <ThemeProvider>
          <MockedProvider mocks={[]}>
            <AuthProvider>
              <MemoryRouter>{children}</MemoryRouter>
            </AuthProvider>
          </MockedProvider>
        </ThemeProvider>
      );
    }

    render(<BlogLayout>{mockChildren}</BlogLayout>, { wrapper: guestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Guest')).toBeTruthy();
    });

    // Click on avatar dropdown to open menu
    const avatarButton = screen.getByText('Guest');
    fireEvent.click(avatarButton);

    await waitFor(() => {
      expect(screen.getByText('个人资料')).toBeTruthy();
      expect(screen.queryByText('修改博主信息')).toBeNull();
      expect(screen.queryByText('后台管理')).toBeNull();
    });
  });
});
