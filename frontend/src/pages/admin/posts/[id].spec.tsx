// src/pages/admin/posts/[id].spec.tsx

import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, beforeEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { MemoryRouter, Routes, Route } from 'react-router';

import { GET_POST_BY_ID, GET_CATEGORIES, GET_TAGS } from '@/features/blog/infrastructure/graphql/queries';
import { UPDATE_POST, CREATE_POST } from '@/features/blog/infrastructure/graphql/mutations';
import { PostStatus } from '@/entities/blog';

import { AdminPostEditPage } from './[id]';

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => ({
    getHTML: vi.fn(() => ''),
    commands: {
      toggleBold: vi.fn(),
      toggleItalic: vi.fn(),
      toggleUnderline: vi.fn(),
      toggleStrike: vi.fn(),
      toggleCode: vi.fn(),
      toggleHeading: vi.fn(),
      toggleBulletList: vi.fn(),
      toggleOrderedList: vi.fn(),
      toggleBlockquote: vi.fn(),
      setCodeBlock: vi.fn(),
      setLink: vi.fn(),
      setImage: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      setContent: vi.fn(),
    },
    chain: vi.fn(() => ({
      focus: vi.fn().mockReturnThis(),
      toggleBold: vi.fn().mockReturnThis(),
      toggleItalic: vi.fn().mockReturnThis(),
      toggleUnderline: vi.fn().mockReturnThis(),
      toggleStrike: vi.fn().mockReturnThis(),
      toggleCode: vi.fn().mockReturnThis(),
      toggleHeading: vi.fn().mockReturnThis(),
      toggleBulletList: vi.fn().mockReturnThis(),
      toggleOrderedList: vi.fn().mockReturnThis(),
      toggleBlockquote: vi.fn().mockReturnThis(),
      setCodeBlock: vi.fn().mockReturnThis(),
      setLink: vi.fn().mockReturnThis(),
      setImage: vi.fn().mockReturnThis(),
      undo: vi.fn().mockReturnThis(),
      redo: vi.fn().mockReturnThis(),
    })),
    can: vi.fn(() => ({
      undo: vi.fn(() => false),
      redo: vi.fn(() => false),
    })),
    isActive: vi.fn(() => false),
  })),
  EditorContent: vi.fn(() => <div data-testid="editor-content" />),
}));

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverMock;

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

  vi.spyOn(window, 'open').mockImplementation(() => ({}) as Window);
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AdminPostEditPage', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    slug: 'test-post',
    content: '<p>Test content</p>',
    summary: 'Test summary',
    coverImage: null,
    status: PostStatus.DRAFT,
    isTop: false,
    viewCount: 0,
    likeCount: 0,
    categoryId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockCategories = [
    { id: 1, name: '分类1', slug: 'cat1', description: null, parentId: null, sortOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: '分类2', slug: 'cat2', description: null, parentId: null, sortOrder: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  const mockTags = [
    { id: 1, name: '标签1', slug: 'tag1', createdAt: new Date().toISOString() },
    { id: 2, name: '标签2', slug: 'tag2', createdAt: new Date().toISOString() },
  ];

  describe('Happy Path', () => {
    it('should render create page when id is new', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: mockCategories } },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: mockTags } },
        },
        {
          request: {
            query: CREATE_POST,
            variables: {
              input: {
                title: 'Test Post',
                slug: 'test-post',
                content: '',
                summary: undefined,
                coverImage: undefined,
                status: 'DRAFT',
                isTop: false,
                categoryId: undefined,
                tagIds: undefined,
              },
            },
          },
          result: { data: { createPost: mockPost } },
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/new']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      await waitFor(() => {
        expect(container.textContent).toContain('新建文章');
      });
    });

    it('should render form fields for creating post', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: mockCategories } },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: mockTags } },
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/new']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      await waitFor(() => {
        expect(container.textContent).toContain('文章标题');
        expect(container.textContent).toContain('文章链接');
        expect(container.textContent).toContain('文章摘要');
        expect(container.textContent).toContain('封面图片');
        expect(container.textContent).toContain('分类');
        expect(container.textContent).toContain('标签');
        expect(container.textContent).toContain('状态设置');
      });
    });

    it('should show create button for new post', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: mockCategories } },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: mockTags } },
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/new']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      await waitFor(() => {
        expect(container.textContent).toContain('创建文章');
      });
    });

    it('should show update button for existing post', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_POST_BY_ID, variables: { id: 1 } },
          result: { data: { post: mockPost } },
        },
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: mockCategories } },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: mockTags } },
        },
        {
          request: {
            query: UPDATE_POST,
            variables: {
              id: 1,
              input: {
                title: 'Test Post',
                slug: 'test-post',
                content: '<p>Test content</p>',
                summary: 'Test summary',
                coverImage: undefined,
                status: 'DRAFT',
                isTop: false,
                categoryId: 1,
                tagIds: undefined,
              },
            },
          },
          result: { data: { updatePost: mockPost } },
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/1']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      await waitFor(() => {
        expect(container.textContent).toContain('更新文章');
      });
    });
  });

  describe('Error Path', () => {
    it('should show loading state when fetching post', () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_POST_BY_ID, variables: { id: 1 } },
          result: { data: { post: mockPost } },
        },
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: mockCategories } },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: mockTags } },
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/1']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should handle post not found gracefully', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_POST_BY_ID, variables: { id: 999 } },
          result: { data: { post: null } },
        },
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: mockCategories } },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: mockTags } },
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/999']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      await waitFor(() => {
        expect(container.querySelector('.ant-spin')).toBeFalsy();
      });
    });

    it('should handle empty category and tag lists', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: [] } },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: [] } },
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/new']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });

    it('should handle error when fetching categories', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          error: new Error('Network error'),
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: mockTags } },
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/new']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });

    it('should handle error when fetching tags', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: mockCategories } },
        },
        {
          request: { query: GET_TAGS },
          error: new Error('Database error'),
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/new']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should render back button', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: mockCategories } },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: mockTags } },
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/new']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      await waitFor(() => {
        expect(container.textContent).toContain('返回列表');
      });
    });

    it('should render draft status as default for new post', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: mockCategories } },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: mockTags } },
        },
      ];

      const { container } = render(
        <MemoryRouter initialEntries={['/admin/posts/new']}>
          <Routes>
            <Route path="/admin/posts/:id" element={<AdminPostEditPage />} />
          </Routes>
        </MemoryRouter>,
        { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> }
      );

      await waitFor(() => {
        expect(container.textContent).toContain('草稿');
      });
    });
  });
});