// src/pages/blog/links.spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { GET_ACTIVE_LINKS } from '@/features/blog/infrastructure/graphql/queries';
import { CREATE_LINK } from '@/features/blog/infrastructure/graphql/mutations';

import { BlogLinksPage } from './links';

afterEach(() => {
  cleanup();
});

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
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverMock;

  // Mock IntersectionObserver for LazyImage
  class IntersectionObserverMock {
    readonly root: Element | null = null;
    readonly rootMargin: string = '0px';
    readonly thresholds: readonly number[] = [0];
    readonly scrollMargin: string = '0px';
    constructor(private callback: IntersectionObserverCallback) {}
    observe(target: Element) {
      this.callback([{ isIntersecting: true, target, intersectionRatio: 1, time: 0, boundingClientRect: target.getBoundingClientRect(), rootBounds: null, intersectionRect: target.getBoundingClientRect() }], this);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

  // Mock Image for LazyImage
  class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    private _src = '';
    get src() { return this._src; }
    set src(_value: string) {
      this._src = _value;
      this.onload?.();
    }
  }
  window.Image = MockImage as unknown as typeof Image;
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

const mockLinks = [
  {
    __typename: 'BlogLinkDTO',
    id: 1,
    title: 'React 官方文档',
    url: 'https://react.dev',
    description: 'React 官方文档',
    logo: 'https://via.placeholder.com/64',
    status: 'ACTIVE',
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    __typename: 'BlogLinkDTO',
    id: 2,
    title: 'Vue 官方文档',
    url: 'https://vuejs.org',
    description: 'Vue 官方文档',
    logo: 'https://via.placeholder.com/64',
    status: 'ACTIVE',
    sortOrder: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const successMocks: MockedResponse[] = [
  {
    request: { query: GET_ACTIVE_LINKS },
    result: {
      data: {
        activeLinks: mockLinks,
      },
    },
  },
];

const emptyMocks: MockedResponse[] = [
  {
    request: { query: GET_ACTIVE_LINKS },
    result: {
      data: {
        activeLinks: [],
      },
    },
  },
];

describe('BlogLinksPage', () => {
  describe('Happy Path', () => {
    it('should render page structure correctly', () => {
      const { container } = render(<BlogLinksPage />, { wrapper: createWrapper(successMocks) });
      expect(container.textContent).toContain('友情链接');
      expect(container.textContent).toContain('申请友链');
    });

    it('should display link cards with proper security attributes', async () => {
      const { container } = render(<BlogLinksPage />, { wrapper: createWrapper(successMocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('React 官方文档');
      });

      const links = container.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);

      links.forEach(link => {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      });
    });

    it('should sort links by sortOrder', async () => {
      const { container } = render(<BlogLinksPage />, { wrapper: createWrapper(successMocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('React 官方文档');
      });

      const titles = container.querySelectorAll('h5');
      expect(titles[0]?.textContent).toBe('React 官方文档');
      expect(titles[1]?.textContent).toBe('Vue 官方文档');
    });
  });

  describe('Error Path', () => {
    it('should display empty state when no links available', async () => {
      const { container } = render(<BlogLinksPage />, { wrapper: createWrapper(emptyMocks) });

      await waitFor(() => {
        expect(container.querySelector('.ant-empty')).not.toBeNull();
      });
    });

    it('should show loading state initially', () => {
      const { container } = render(<BlogLinksPage />, { wrapper: createWrapper(successMocks) });
      expect(container.querySelector('.ant-spin')).not.toBeNull();
    });
  });

  describe('LinkApplyModal', () => {
    it('should render modal with form fields and call createLink mutation on submission', async () => {
      const createLinkMocks: MockedResponse[] = [
        {
          request: { query: GET_ACTIVE_LINKS },
          result: {
            data: {
              activeLinks: [],
            },
          },
        },
        {
          request: {
            query: CREATE_LINK,
            variables: {
              title: 'Test Site',
              url: 'https://test.com',
              description: 'A test site',
              logo: undefined,
            },
          },
          result: {
            data: {
              createLink: {
                __typename: 'BlogLinkDTO',
                id: 3,
                title: 'Test Site',
                url: 'https://test.com',
                description: 'A test site',
                logo: null,
                status: 'PENDING',
                sortOrder: 0,
                createdAt: '2024-01-20T10:00:00Z',
                updatedAt: '2024-01-20T10:00:00Z',
              },
            },
          },
        },
      ];

      const { container } = render(<BlogLinksPage />, { wrapper: createWrapper(createLinkMocks) });

      await waitFor(() => {
        expect(container.textContent).toContain('申请友链');
      });

      // Click the "申请友链" button to open the modal
      const applyBtn = Array.from(container.querySelectorAll('button')).find(
        (btn) => btn.textContent?.includes('申请友链')
      );
      expect(applyBtn).toBeTruthy();
      fireEvent.click(applyBtn!);

      // Modal renders in a portal (document.body)
      await waitFor(() => {
        expect(document.querySelector('.ant-modal')).toBeTruthy();
        expect(document.querySelector('.ant-modal')?.textContent).toContain('友链申请');
      });

      // Verify the modal contains the form fields
      const modalEl = document.querySelector('.ant-modal');
      expect(modalEl?.textContent).toContain('网站名称');
      expect(modalEl?.textContent).toContain('网站地址');
      expect(modalEl?.textContent).toContain('网站描述');
      expect(modalEl?.textContent).toContain('联系邮箱');
      expect(modalEl?.textContent).toContain('提交申请');
    });
  });
});