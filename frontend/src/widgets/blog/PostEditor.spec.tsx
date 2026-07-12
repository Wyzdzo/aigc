// src/widgets/blog/PostEditor.spec.tsx

import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, beforeEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';

import { GET_MEDIA_LIST } from '@/features/media';

import { PostEditor } from './PostEditor';

const mediaListMock = {
  request: {
    query: GET_MEDIA_LIST,
    variables: { page: 1, pageSize: 12 },
  },
  result: {
    data: {
      mediaList: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 12,
      },
    },
  },
};

function createWrapper(mocks = [mediaListMock]) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

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

describe('PostEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should render textarea with initial value', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="# Hello" onChange={onChange} />, { wrapper: createWrapper() });

      const textarea = container.querySelector('textarea');
      expect(textarea).toBeTruthy();
      expect(textarea?.value).toBe('# Hello');
    });

    it('should call onChange when typing in textarea', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} />, { wrapper: createWrapper() });

      const textarea = container.querySelector('textarea');
      fireEvent.change(textarea!, { target: { value: '# New Content' } });

      expect(onChange).toHaveBeenCalledWith('# New Content');
    });

    it('should call onSave when save button clicked', async () => {
      const onChange = vi.fn();
      const onSave = vi.fn();
      const { container } = render(<PostEditor value="测试内容" onChange={onChange} onSave={onSave} />, { wrapper: createWrapper() });

      await waitFor(() => {
        const saveButton = container.querySelector('.ant-btn-primary');
        expect(saveButton).toBeTruthy();
        fireEvent.click(saveButton!);
      });

      expect(onSave).toHaveBeenCalled();
    });

    it('should show last saved time after save', async () => {
      const onChange = vi.fn();
      const onSave = vi.fn();
      const { container } = render(<PostEditor value="内容" onChange={onChange} onSave={onSave} />, { wrapper: createWrapper() });

      await waitFor(() => {
        const saveButton = container.querySelector('.ant-btn-primary');
        expect(saveButton).toBeTruthy();
        fireEvent.click(saveButton!);
      });

      await waitFor(() => {
        expect(container.textContent).toContain('上次保存:');
      });
    });

    it('should render split view by default', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="# Hello World" onChange={onChange} />, { wrapper: createWrapper() });

      // Should have both textarea and preview area
      expect(container.querySelector('textarea')).toBeTruthy();
      // Preview area should exist
      expect(container.querySelector('.md-editor-preview')).toBeTruthy();
    });

    it('should show view mode selector', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} />, { wrapper: createWrapper() });

      const select = container.querySelector('.ant-select');
      expect(select).toBeTruthy();
    });

    it('should render toolbar buttons', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} />, { wrapper: createWrapper() });

      // Check for key toolbar buttons
      expect(container.textContent).toContain('H1');
      expect(container.textContent).toContain('H2');
      expect(container.textContent).toContain('H3');
    });

    it('should insert bold syntax when bold button clicked', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="Hello" onChange={onChange} />, { wrapper: createWrapper() });

      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      // Select some text
      textarea.selectionStart = 0;
      textarea.selectionEnd = 5;

      // Find bold button (first button with BoldOutlined icon)
      const boldButton = container.querySelector('.anticon-bold')?.closest('button') as HTMLElement;
      expect(boldButton).toBeTruthy();
      fireEvent.click(boldButton);

      expect(onChange).toHaveBeenCalledWith('**Hello**');
    });

    it('should insert heading syntax when H1 button clicked', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="Hello" onChange={onChange} />, { wrapper: createWrapper() });

      // Find H1 button
      const buttons = container.querySelectorAll('.ant-btn');
      const h1Button = Array.from(buttons).find((btn) => btn.textContent === 'H1');
      expect(h1Button).toBeTruthy();
      fireEvent.click(h1Button!);

      expect(onChange).toHaveBeenCalledWith('# Hello');
    });

    it('should handle Ctrl+S keyboard shortcut', () => {
      const onChange = vi.fn();
      const onSave = vi.fn();
      const { container } = render(<PostEditor value="内容" onChange={onChange} onSave={onSave} />, { wrapper: createWrapper() });

      const textarea = container.querySelector('textarea')!;
      fireEvent.keyDown(textarea, { key: 's', ctrlKey: true });

      expect(onSave).toHaveBeenCalled();
    });

    it('should handle Ctrl+B keyboard shortcut for bold', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="Hello" onChange={onChange} />, { wrapper: createWrapper() });

      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      textarea.selectionStart = 0;
      textarea.selectionEnd = 5;

      fireEvent.keyDown(textarea, { key: 'b', ctrlKey: true });

      expect(onChange).toHaveBeenCalledWith('**Hello**');
    });

    it('should handle Ctrl+I keyboard shortcut for italic', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="Hello" onChange={onChange} />, { wrapper: createWrapper() });

      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      textarea.selectionStart = 0;
      textarea.selectionEnd = 5;

      fireEvent.keyDown(textarea, { key: 'i', ctrlKey: true });

      expect(onChange).toHaveBeenCalledWith('*Hello*');
    });

    it('should render "从图片库选择" button in toolbar', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} />, { wrapper: createWrapper() });

      // The toolbar should contain a FolderOpenOutlined icon button
      // Ant Design icons render as <span> with role="img" and aria-label
      const iconSpans = container.querySelectorAll('[role="img"]');
      const folderIcon = Array.from(iconSpans).find(
        span => span.getAttribute('aria-label') === 'folder-open'
      );
      expect(folderIcon).toBeTruthy();
    });

    it('should open MediaPicker modal when clicking folder button', async () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} />, { wrapper: createWrapper() });

      const iconSpans = container.querySelectorAll('[role="img"]');
      const folderIcon = Array.from(iconSpans).find(
        span => span.getAttribute('aria-label') === 'folder-open'
      );
      expect(folderIcon).toBeTruthy();

      const folderButton = folderIcon!.closest('button') as HTMLElement;
      fireEvent.click(folderButton);

      // MediaPicker uses Ant Design Modal, which renders to document.body via portal
      await waitFor(() => {
        const modalTitle = document.querySelector('.ant-modal-title');
        expect(modalTitle?.textContent).toBe('从图片库选择');
      });
    });

    it('should render syntax highlight overlay', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="# Title" onChange={onChange} />, { wrapper: createWrapper() });

      // Highlight layer should exist
      const pre = container.querySelector('pre[aria-hidden="true"]');
      expect(pre).toBeTruthy();
    });
  });

  describe('Error Path', () => {
    it('should not show save button when onSave is not provided', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="内容" onChange={onChange} />, { wrapper: createWrapper() });

      const primaryButtons = container.querySelectorAll('.ant-btn-primary');
      expect(primaryButtons.length).toBe(0);
    });

    it('should show placeholder text when value is empty', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} placeholder="开始编写..." />, { wrapper: createWrapper() });

      const textarea = container.querySelector('textarea');
      expect(textarea?.placeholder).toBe('开始编写...');
    });

    it('should not render preview content when value is empty', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} />, { wrapper: createWrapper() });

      const previewArea = container.querySelector('.md-editor-preview');
      // Preview area exists but has no rendered Markdown content
      expect(previewArea?.children.length).toBe(0);
    });

    it('should not render MediaPicker modal initially', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} />, { wrapper: createWrapper() });

      expect(container.querySelector('.ant-modal-wrap')).toBeFalsy();
    });
  });
});
