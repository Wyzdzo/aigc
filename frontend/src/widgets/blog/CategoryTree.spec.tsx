// src/widgets/blog/CategoryTree.spec.tsx

import { describe, expect, it, vi, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/client/testing/react';
import { CategoryTree } from './CategoryTree';
import { GET_CATEGORY_TREE } from '@/features/blog';

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

const mockCategories = [
  {
    id: 1,
    name: '前端技术',
    slug: 'frontend',
    description: '前端相关技术',
    parentId: null,
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    children: [
      {
        id: 3,
        name: 'React',
        slug: 'react',
        description: 'React 框架',
        parentId: 1,
        sortOrder: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        children: [],
      },
      {
        id: 4,
        name: 'Vue',
        slug: 'vue',
        description: 'Vue 框架',
        parentId: 1,
        sortOrder: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        children: [],
      },
    ],
  },
  {
    id: 2,
    name: '后端技术',
    slug: 'backend',
    description: '后端相关技术',
    parentId: null,
    sortOrder: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    children: [],
  },
];

const mocks = [
  {
    request: {
      query: GET_CATEGORY_TREE,
    },
    result: {
      data: {
        categoryTree: mockCategories,
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

describe('CategoryTree', () => {
  it('should render loading state initially', async () => {
    render(<CategoryTree onChange={() => {}} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('加载中...')).toBeDefined();
  });

  it('should render category tree after loading', async () => {
    render(<CategoryTree onChange={() => {}} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getAllByText('文章分类').length).toBeGreaterThan(0);
    });

    // Tree 组件会将文本分割，使用 getAllByText
    expect(screen.getAllByText(/前端技术/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/后端技术/).length).toBeGreaterThan(0);
  });

  it('should render tree structure with correct nodes', async () => {
    render(<CategoryTree onChange={() => {}} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getAllByText('文章分类').length).toBeGreaterThan(0);
    });

    // 验证树结构存在
    const treeNodes = document.querySelectorAll('.ant-tree-node-content-wrapper');
    expect(treeNodes.length).toBeGreaterThan(0);
  });

  it('should render nested categories correctly', async () => {
    render(<CategoryTree onChange={() => {}} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getAllByText('文章分类').length).toBeGreaterThan(0);
    });

    // 验证嵌套结构 - 前端技术下应该有子分类
    const treeNodes = document.querySelectorAll('.ant-tree-node-content-wrapper');
    expect(treeNodes.length).toBeGreaterThanOrEqual(4); // 2个顶级 + 2个子分类
  });

  it('should render empty state when no categories', async () => {
    const emptyMocks = [
      {
        request: {
          query: GET_CATEGORY_TREE,
        },
        result: {
          data: {
            categoryTree: [],
          },
        },
      },
    ];

    render(<CategoryTree onChange={() => {}} />, {
      wrapper: createWrapper(emptyMocks),
    });

    await waitFor(() => {
      // 验证标题仍然显示
      expect(screen.getAllByText('文章分类').length).toBeGreaterThan(0);
    });
  });
});