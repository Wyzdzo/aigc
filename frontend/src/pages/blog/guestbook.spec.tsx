// src/pages/blog/guestbook.spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { GET_COMMENTS } from '@/features/blog';

import { BlogGuestbookPage } from './guestbook';

// Mock ResizeObserver and matchMedia
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

// Mock message.success
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd') as { message: { success: unknown } };
  return {
    ...actual,
    message: {
      ...actual.message,
      success: vi.fn(),
    },
  };
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

describe('BlogGuestbookPage', () => {
  describe('Happy Path', () => {
    it('should render guestbook page with header', async () => {
      const { container } = render(<BlogGuestbookPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(container.textContent).toContain('留言板');
      });
    });

    it('should render guestbook description', async () => {
      const { container } = render(<BlogGuestbookPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(container.textContent).toContain('有什么想说的');
      });
    });

    it('should render comment form', async () => {
      const { container } = render(<BlogGuestbookPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(container.textContent).toContain('写下你的留言');
      });
    });
  });

  describe('Error Path', () => {
    it('should show empty state when no comments', async () => {
      const emptyMocks: MockedResponse[] = [
        {
          request: {
            query: GET_COMMENTS,
            variables: { postId: 0, page: 1, pageSize: 50 },
          },
          result: {
            data: {
              blogComments: {
                items: [],
                total: 0,
                pageInfo: {
                  currentPage: 1,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },
      ];

      const { container } = render(<BlogGuestbookPage />, {
        wrapper: createWrapper(emptyMocks),
      });

      await waitFor(() => {
        expect(container.textContent).toContain('暂无留言');
      });
    });
  });
});
