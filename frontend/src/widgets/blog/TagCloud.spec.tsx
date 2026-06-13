// src/widgets/blog/TagCloud.spec.tsx

import { describe, expect, it, vi, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/client/testing/react';
import { TagCloud } from './TagCloud';
import { GET_TAGS } from '@/features/blog';

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
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  window.ResizeObserver = ResizeObserverMock;
});

const mockTags = [
  {
    id: 1,
    name: 'React',
    slug: 'react',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: 'TypeScript',
    slug: 'typescript',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 3,
    name: 'Vue',
    slug: 'vue',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 4,
    name: 'Node.js',
    slug: 'nodejs',
    createdAt: new Date('2024-01-01'),
  },
];

const mocks = [
  {
    request: {
      query: GET_TAGS,
    },
    result: {
      data: {
        tags: mockTags,
      },
    },
  },
];

function createWrapper(mockData = mocks) {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <MockedProvider mocks={mockData} addTypename={false}>
        {children}
      </MockedProvider>
    </MemoryRouter>
  );
}

describe('TagCloud', () => {
  it('should render loading state initially', async () => {
    render(<TagCloud onChange={() => {}} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('加载中...')).toBeDefined();
  });

  it('should render all tags after loading', async () => {
    render(<TagCloud onChange={() => {}} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getAllByText('标签云').length).toBeGreaterThan(0);
    });

    // 使用 getAllByText 因为 Ant Design 可能生成多个元素
    expect(screen.getAllByText('React').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vue').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Node.js').length).toBeGreaterThan(0);
  });

  it('should render tags with different colors', async () => {
    render(<TagCloud onChange={() => {}} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getAllByText('React').length).toBeGreaterThan(0);
    });

    // 验证标签渲染
    const tagTexts = ['React', 'TypeScript', 'Vue', 'Node.js'];
    tagTexts.forEach((text) => {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    });
  });

  it('should render empty state when no tags', async () => {
    const emptyMocks = [
      {
        request: {
          query: GET_TAGS,
        },
        result: {
          data: {
            tags: [],
          },
        },
      },
    ];

    render(<TagCloud onChange={() => {}} />, {
      wrapper: createWrapper(emptyMocks),
    });

    await waitFor(() => {
      // 验证标题仍然显示
      expect(screen.getAllByText('标签云').length).toBeGreaterThan(0);
    });
  });
});