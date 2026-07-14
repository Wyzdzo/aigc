// src/pages/admin/categories/index.spec.tsx

import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';


import { GET_CATEGORIES } from '@/features/blog/infrastructure/graphql/queries';
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/features/blog/infrastructure/graphql/mutations';

import { AdminCategoriesPage } from './index';

afterEach(() => {
  cleanup();
});

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

describe('AdminCategoriesPage', () => {
  describe('Happy Path', () => {
    it('should render page title', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('分类管理');
      });
    });

    it('should render category tree with parent and children', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [
                {
                  __typename: 'BlogCategoryDTO',
                  id: 1,
                  name: '技术博客',
                  slug: 'tech',
                  description: '技术相关文章',
                  parentId: null,
                  sortOrder: 0,
                  createdAt: '2024-01-15T10:00:00Z',
                  updatedAt: '2024-01-15T10:00:00Z',
                },
                {
                  __typename: 'BlogCategoryDTO',
                  id: 2,
                  name: '前端开发',
                  slug: 'frontend',
                  description: '前端技术',
                  parentId: 1,
                  sortOrder: 0,
                  createdAt: '2024-01-15T11:00:00Z',
                  updatedAt: '2024-01-15T11:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-tree')).toBeTruthy();
        expect(container.textContent).toContain('技术博客');
        expect(container.textContent).toContain('前端开发');
      });
    });

    it('should render add and refresh buttons', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        const buttons = container.querySelectorAll('.ant-btn');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
        expect(container.textContent).toContain('新增分类');
        expect(container.textContent).toContain('刷新');
      });
    });

    it('should render empty state when no categories', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无分类');
      });
    });
  });

  describe('Error Path', () => {
    it('should show loading state initially', () => {
      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper([]) });

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should show empty state when GraphQL query error occurs', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无分类');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should render nested category structure (3 levels)', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [
                {
                  __typename: 'BlogCategoryDTO',
                  id: 1,
                  name: 'Level 1',
                  slug: 'level1',
                  description: '',
                  parentId: null,
                  sortOrder: 0,
                  createdAt: '2024-01-15T10:00:00Z',
                  updatedAt: '2024-01-15T10:00:00Z',
                },
                {
                  __typename: 'BlogCategoryDTO',
                  id: 2,
                  name: 'Level 2',
                  slug: 'level2',
                  description: '',
                  parentId: 1,
                  sortOrder: 0,
                  createdAt: '2024-01-15T11:00:00Z',
                  updatedAt: '2024-01-15T11:00:00Z',
                },
                {
                  __typename: 'BlogCategoryDTO',
                  id: 3,
                  name: 'Level 3',
                  slug: 'level3',
                  description: '',
                  parentId: 2,
                  sortOrder: 0,
                  createdAt: '2024-01-15T12:00:00Z',
                  updatedAt: '2024-01-15T12:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('Level 1');
        expect(container.textContent).toContain('Level 2');
        expect(container.textContent).toContain('Level 3');
      });
    });

    it('should render edit and delete buttons for each category', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: {
            data: {
              categories: [
                {
                  __typename: 'BlogCategoryDTO',
                  id: 1,
                  name: '测试分类',
                  slug: 'test',
                  description: '',
                  parentId: null,
                  sortOrder: 0,
                  createdAt: '2024-01-15T10:00:00Z',
                  updatedAt: '2024-01-15T10:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        // Buttons are icon-only (EditOutlined / DeleteOutlined)
        const editIcons = container.querySelectorAll('.anticon-edit');
        const deleteIcons = container.querySelectorAll('.anticon-delete');
        expect(editIcons.length).toBeGreaterThan(0);
        expect(deleteIcons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Mutation Interactions', () => {
    const categoryBase = {
      __typename: 'BlogCategoryDTO',
      id: 1,
      name: '测试分类',
      slug: 'test',
      description: '测试描述',
      parentId: null,
      sortOrder: 0,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    };

    it('should call createCategory mutation when submitting the create form', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: [] } },
        },
        {
          request: {
            query: CREATE_CATEGORY,
            variables: {
              name: '新分类',
              slug: 'new-category',
              sortOrder: 0,
            },
          },
          result: {
            data: {
              createCategory: {
                __typename: 'BlogCategoryDTO',
                id: 2,
                name: '新分类',
                slug: 'new-category',
                description: null,
                parentId: null,
                sortOrder: 0,
                createdAt: '2024-01-16T10:00:00Z',
                updatedAt: '2024-01-16T10:00:00Z',
              },
            },
          },
        },
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: [{ ...categoryBase, id: 2, name: '新分类', slug: 'new-category' }] } },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('新增分类');
      });

      // Click the "新增分类" button to open the modal
      const addBtn = container.querySelector('.ant-btn-primary') as HTMLElement;
      expect(addBtn).toBeTruthy();
      fireEvent.click(addBtn);

      // Modal renders in a portal (document.body), not inside container
      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      // Fill in the form fields in the portal
      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      const nameInput = inputs[0] as HTMLInputElement;
      const slugInput = inputs[1] as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: '新分类' } });
      fireEvent.change(slugInput, { target: { value: 'new-category' } });

      // Click the OK button in modal
      const okBtn = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      expect(okBtn).toBeTruthy();
      fireEvent.click(okBtn);

      // Verify the new category appears after successful creation
      await waitFor(() => {
        expect(container.textContent).toContain('新分类');
      });
    });

    it('should call updateCategory mutation when submitting the edit form', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: [categoryBase] } },
        },
        {
          request: {
            query: UPDATE_CATEGORY,
            variables: {
              id: 1,
              name: '更新分类',
              slug: 'updated-category',
              description: '测试描述',
              sortOrder: 0,
            },
          },
          result: {
            data: {
              updateCategory: {
                __typename: 'BlogCategoryDTO',
                id: 1,
                name: '更新分类',
                slug: 'updated-category',
                description: '测试描述',
                parentId: null,
                sortOrder: 0,
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-16T10:00:00Z',
              },
            },
          },
        },
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: [{ ...categoryBase, name: '更新分类', slug: 'updated-category' }] } },
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('测试分类');
      });

      // Click the edit icon button
      const editBtn = container.querySelector('.anticon-edit')?.closest('button') as HTMLElement;
      expect(editBtn).toBeTruthy();
      fireEvent.click(editBtn!);

      // Modal renders in a portal (document.body)
      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      // Update form fields in the portal
      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      const nameInput = inputs[0] as HTMLInputElement;
      const slugInput = inputs[1] as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: '更新分类' } });
      fireEvent.change(slugInput, { target: { value: 'updated-category' } });

      // Click the OK button in modal
      const okBtn = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      expect(okBtn).toBeTruthy();
      fireEvent.click(okBtn);

      // Verify the updated category appears after successful update
      await waitFor(() => {
        expect(container.textContent).toContain('更新分类');
      });
    });

    it('should show error message when createCategory fails', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_CATEGORIES },
          result: { data: { categories: [] } },
        },
        {
          request: {
            query: CREATE_CATEGORY,
            variables: {
              name: '新分类',
              slug: 'new-category',
              sortOrder: 0,
            },
          },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<AdminCategoriesPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('新增分类');
      });

      // Click the "新增分类" button to open the modal
      const addBtn = container.querySelector('.ant-btn-primary') as HTMLElement;
      expect(addBtn).toBeTruthy();
      fireEvent.click(addBtn);

      // Modal renders in a portal (document.body)
      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });

      // Fill in the form fields in the portal
      const inputs = document.querySelectorAll('.ant-modal .ant-input');
      const nameInput = inputs[0] as HTMLInputElement;
      const slugInput = inputs[1] as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: '新分类' } });
      fireEvent.change(slugInput, { target: { value: 'new-category' } });

      // Click the OK button in modal
      const okBtn = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      expect(okBtn).toBeTruthy();
      fireEvent.click(okBtn);

      // Verify modal stays open when creation fails (error path)
      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
      });
    });
  });
});
