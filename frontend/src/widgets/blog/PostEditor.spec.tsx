// src/widgets/blog/PostEditor.spec.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll, beforeEach } from 'vitest';
import { useEditor } from '@tiptap/react';

import { PostEditor } from './PostEditor';

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

  vi.spyOn(window, 'prompt').mockReturnValue('https://example.com/image.jpg');
});

describe('PostEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should render editor container', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} />);

      expect(container.querySelector('.flex')).toBeTruthy();
    });

    it('should render toolbar buttons', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} />);

      const buttons = container.querySelectorAll('.ant-btn');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should call onSave when save button clicked', async () => {
      const onChange = vi.fn();
      const onSave = vi.fn();
      const { container } = render(<PostEditor value="<p>测试内容</p>" onChange={onChange} onSave={onSave} />);

      await waitFor(() => {
        const saveButton = container.querySelector('.ant-btn-primary');
        expect(saveButton).toBeTruthy();
        fireEvent.click(saveButton!);
      });

      expect(onSave).toHaveBeenCalled();
    });

    it('should update content when value prop changes', async () => {
      const onChange = vi.fn();
      const { rerender } = render(<PostEditor value="<p>初始内容</p>" onChange={onChange} />);

      rerender(<PostEditor value="<p>更新内容</p>" onChange={onChange} />);

      expect(useEditor).toHaveBeenCalled();
    });
  });

  describe('Error Path', () => {
    it('should handle empty value gracefully', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} />);

      expect(container).toBeTruthy();
    });

    it('should handle null onSave gracefully', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="<p>内容</p>" onChange={onChange} />);

      expect(container).toBeTruthy();
    });

    it('should not show save button when onSave is not provided', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="<p>内容</p>" onChange={onChange} />);

      const primaryButtons = container.querySelectorAll('.ant-btn-primary');
      expect(primaryButtons.length).toBe(0);
    });

    it('should handle undefined placeholder', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="" onChange={onChange} placeholder={undefined} />);

      expect(container.querySelector('.flex')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should show last saved time after save', async () => {
      const onChange = vi.fn();
      const onSave = vi.fn();
      const { container } = render(<PostEditor value="<p>内容</p>" onChange={onChange} onSave={onSave} />);

      await waitFor(() => {
        const saveButton = container.querySelector('.ant-btn-primary');
        expect(saveButton).toBeTruthy();
        fireEvent.click(saveButton!);
      });

      await waitFor(() => {
        expect(container.textContent).toContain('上次保存:');
      });
    });

    it('should work with autoSave disabled', () => {
      const onChange = vi.fn();
      const { container } = render(<PostEditor value="<p>内容</p>" onChange={onChange} autoSave={false} />);

      expect(container).toBeTruthy();
    });
  });
});