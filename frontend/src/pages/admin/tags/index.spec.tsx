// src/pages/admin/tags/index.spec.tsx

import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';
import { message } from 'antd';

import { GET_TAGS } from '@/features/blog/infrastructure/graphql/queries';
import { CREATE_TAG, UPDATE_TAG } from '@/features/blog/infrastructure/graphql/mutations';

import { AdminTagsPage } from './index';

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

describe('AdminTagsPage', () => {
  describe('Happy Path', () => {
    it('should render page title', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('标签管理');
      });
    });

    it('should render tags table with columns', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [
                {
                  __typename: 'BlogTagDTO',
                  id: 1,
                  name: 'React',
                  slug: 'react',
                  createdAt: '2024-01-15T10:00:00Z',
                },
                {
                  __typename: 'BlogTagDTO',
                  id: 2,
                  name: 'TypeScript',
                  slug: 'typescript',
                  createdAt: '2024-01-15T11:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-table')).toBeTruthy();
        expect(container.textContent).toContain('React');
        expect(container.textContent).toContain('TypeScript');
        expect(container.textContent).toContain('标签名称');
        expect(container.textContent).toContain('标签别名');
        expect(container.textContent).toContain('创建时间');
        expect(container.textContent).toContain('操作');
      });
    });

    it('should render add and refresh buttons', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        const buttons = container.querySelectorAll('.ant-btn');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
        expect(container.textContent).toContain('新增标签');
        expect(container.textContent).toContain('刷新');
      });
    });

    it('should render empty state when no tags', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无标签');
      });
    });
  });

  describe('Error Path', () => {
    it('should show loading state initially', () => {
      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper([]) });

      expect(container.querySelector('.ant-spin')).toBeTruthy();
    });

    it('should show empty state when GraphQL query error occurs', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无标签');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should render edit and delete buttons for each tag', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [
                {
                  __typename: 'BlogTagDTO',
                  id: 1,
                  name: '测试标签',
                  slug: 'test-tag',
                  createdAt: '2024-01-15T10:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('编辑');
        expect(container.textContent).toContain('删除');
      });
    });

    it('should handle special characters in tag names', async () => {
      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: {
            data: {
              tags: [
                {
                  __typename: 'BlogTagDTO',
                  id: 1,
                  name: 'AI & Machine Learning',
                  slug: 'ai-ml',
                  createdAt: '2024-01-15T10:00:00Z',
                },
                {
                  __typename: 'BlogTagDTO',
                  id: 2,
                  name: 'Web 前端开发',
                  slug: 'web-frontend',
                  createdAt: '2024-01-15T11:00:00Z',
                },
              ],
            },
          },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('AI & Machine Learning');
        expect(container.textContent).toContain('Web 前端开发');
      });
    });
  });

  describe('Mutation Interactions', () => {
    const tagBase = {
      __typename: 'BlogTagDTO',
      id: 1,
      name: '测试标签',
      slug: 'test-tag',
      createdAt: '2024-01-15T10:00:00Z',
    };

    it('should call createTag mutation when submitting the create form', async () => {
      vi.spyOn(message, 'success').mockReturnValue({} as ReturnType<typeof message.success>);

      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: { data: { tags: [] } },
        },
        {
          request: {
            query: CREATE_TAG,
            variables: { name: '新标签', slug: 'new-tag' },
          },
          result: {
            data: {
              createTag: {
                __typename: 'BlogTagDTO',
                id: 2,
                name: '新标签',
                slug: 'new-tag',
                createdAt: '2024-01-16T10:00:00Z',
              },
            },
          },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: [{ ...tagBase, id: 2, name: '新标签', slug: 'new-tag' }] } },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('新增标签');
      });

      // Click the "新增标签" button to open the modal
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

      fireEvent.change(nameInput, { target: { value: '新标签' } });
      fireEvent.change(slugInput, { target: { value: 'new-tag' } });

      // Click the OK button in modal
      const okBtn = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      expect(okBtn).toBeTruthy();
      fireEvent.click(okBtn);

      await waitFor(() => {
        expect(message.success).toHaveBeenCalledWith('创建成功');
      });

      vi.restoreAllMocks();
    });

    it('should call updateTag mutation when submitting the edit form', async () => {
      vi.spyOn(message, 'success').mockReturnValue({} as ReturnType<typeof message.success>);

      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: { data: { tags: [tagBase] } },
        },
        {
          request: {
            query: UPDATE_TAG,
            variables: { id: 1, name: '更新标签', slug: 'updated-tag' },
          },
          result: {
            data: {
              updateTag: {
                __typename: 'BlogTagDTO',
                id: 1,
                name: '更新标签',
                slug: 'updated-tag',
                createdAt: '2024-01-15T10:00:00Z',
              },
            },
          },
        },
        {
          request: { query: GET_TAGS },
          result: { data: { tags: [{ ...tagBase, name: '更新标签', slug: 'updated-tag' }] } },
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('测试标签');
      });

      // Click the "编辑" button
      const editBtns = container.querySelectorAll('button');
      const editBtn = Array.from(editBtns).find((btn) => btn.textContent?.includes('编辑'));
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

      fireEvent.change(nameInput, { target: { value: '更新标签' } });
      fireEvent.change(slugInput, { target: { value: 'updated-tag' } });

      // Click the OK button in modal
      const okBtn = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      expect(okBtn).toBeTruthy();
      fireEvent.click(okBtn);

      await waitFor(() => {
        expect(message.success).toHaveBeenCalledWith('更新成功');
      });

      vi.restoreAllMocks();
    });

    it('should show error message when createTag fails', async () => {
      vi.spyOn(message, 'error').mockReturnValue({} as ReturnType<typeof message.error>);

      const mocks: MockedResponse[] = [
        {
          request: { query: GET_TAGS },
          result: { data: { tags: [] } },
        },
        {
          request: {
            query: CREATE_TAG,
            variables: { name: '新标签', slug: 'new-tag' },
          },
          error: new Error('Network error'),
        },
      ];

      const { container } = render(<AdminTagsPage />, { wrapper: createWrapper(mocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('新增标签');
      });

      // Click the "新增标签" button to open the modal
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

      fireEvent.change(nameInput, { target: { value: '新标签' } });
      fireEvent.change(slugInput, { target: { value: 'new-tag' } });

      // Click the OK button in modal
      const okBtn = document.querySelector('.ant-modal .ant-btn-primary') as HTMLElement;
      expect(okBtn).toBeTruthy();
      fireEvent.click(okBtn);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('操作失败，请重试');
      });

      vi.restoreAllMocks();
    });
  });
});
