// src/pages/blog/archives.spec.tsx

import { describe, expect, it, vi, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import { MemoryRouter } from 'react-router';
import { ArchivesPage } from './archives';
import { GET_POSTS } from '@/features/blog';
import { PostStatus } from '@/entities/blog';

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

const mockPosts = [
  {
    id: 1,
    title: 'React 18 新特性详解',
    slug: 'react-18-features',
    summary: 'React 18 的新特性介绍',
    coverImage: '',
    status: PostStatus.PUBLISHED,
    isTop: false,
    viewCount: 100,
    likeCount: 10,
    categoryId: 1,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
];

const mocks = [
  {
    request: {
      query: GET_POSTS,
      variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 1000 },
    },
    result: {
      data: {
        posts: {
          items: mockPosts,
          total: mockPosts.length,
          page: 1,
          pageSize: 1000,
        },
      },
    },
  },
];

const errorMocks = [
  {
    request: {
      query: GET_POSTS,
      variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 1000 },
    },
    error: new Error('Network error'),
  },
];

const emptyMocks = [
  {
    request: {
      query: GET_POSTS,
      variables: { status: PostStatus.PUBLISHED, page: 1, pageSize: 1000 },
    },
    result: {
      data: {
        posts: {
          items: [],
          total: 0,
          page: 1,
          pageSize: 1000,
        },
      },
    },
  },
];

function createWrapper(mockData = mocks) {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <MockedProvider mocks={mockData}>
        {children}
      </MockedProvider>
    </MemoryRouter>
  );
}

describe('ArchivesPage', () => {
  it('should display page title when loaded', async () => {
    render(<ArchivesPage />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('时间归档')).toBeDefined();
    });
  });

  it('should show empty state when no posts', async () => {
    render(<ArchivesPage />, {
      wrapper: createWrapper(emptyMocks),
    });

    await waitFor(() => {
      expect(screen.getByText('暂无文章')).toBeDefined();
    });
  });

  it('should show error state when loading fails', async () => {
    render(<ArchivesPage />, {
      wrapper: createWrapper(errorMocks),
    });

    await waitFor(() => {
      expect(screen.getByText('加载失败')).toBeDefined();
    });
  });

  it('should display year-month groups', async () => {
    render(<ArchivesPage />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const elements = screen.getAllByText(/2024年1月/);
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});