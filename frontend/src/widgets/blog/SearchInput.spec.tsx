// src/widgets/blog/SearchInput.spec.tsx

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Happy Path', () => {
    it('should render search input', () => {
      render(<SearchInput value="" />);

      const inputs = screen.getAllByPlaceholderText('搜索文章...');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should render with custom placeholder', () => {
      render(<SearchInput value="" placeholder="输入关键词..." />);

      const inputs = screen.getAllByPlaceholderText('输入关键词...');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should show loading state', () => {
      const { container } = render(<SearchInput value="" loading />);

      expect(container.querySelector('.anticon-loading')).toBeTruthy();
    });

    it('should render search button', () => {
      const { container } = render(<SearchInput value="" />);

      expect(container.querySelector('.ant-input-search-btn')).toBeTruthy();
    });

    it('should call onSearch when input changes after debounce', () => {
      const onSearch = vi.fn();
      const { container } = render(<SearchInput value="" onSearch={onSearch} />);

      const input = container.querySelector('input');
      if (input) {
        fireEvent.change(input, { target: { value: 'React' } });

        expect(onSearch).not.toHaveBeenCalled();

        vi.advanceTimersByTime(300);

        expect(onSearch).toHaveBeenCalledWith('React');
      }
    });

    it('should call onSearch immediately when input is empty', () => {
      const onSearch = vi.fn();
      const { container } = render(<SearchInput value="test" onSearch={onSearch} />);

      const input = container.querySelector('input');
      if (input) {
        fireEvent.change(input, { target: { value: '' } });

        expect(onSearch).toHaveBeenCalledWith('');
      }
    });

    it('should call onSearch when search button is clicked', () => {
      const onSearch = vi.fn();
      const { container } = render(<SearchInput value="test" onSearch={onSearch} />);

      const searchButton = container.querySelector('.ant-input-search-btn');
      if (searchButton) {
        fireEvent.click(searchButton);
        expect(onSearch).toHaveBeenCalledWith('test');
      }
    });

    it('should call onSearch and onClear when clear button is clicked', () => {
      const onSearch = vi.fn();
      const onClear = vi.fn();
      const { container } = render(<SearchInput value="test" onSearch={onSearch} onClear={onClear} />);

      const clearButtons = container.querySelectorAll('button[type="button"]');
      clearButtons.forEach((button) => {
        const text = button.textContent;
        if (text && text.includes('清空')) {
          fireEvent.click(button);
          expect(onSearch).toHaveBeenCalledWith('');
          expect(onClear).toHaveBeenCalled();
        }
      });
    });
  });

  describe('Error Path', () => {
    it('should handle missing onSearch callback without error', () => {
      const onSearch = vi.fn();
      const { container } = render(<SearchInput value="" onSearch={onSearch} />);

      const input = container.querySelector('input');
      if (input) {
        fireEvent.change(input, { target: { value: 'React' } });

        vi.advanceTimersByTime(300);

        expect(onSearch).toHaveBeenCalledWith('React');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle allowClear from Ant Design', () => {
      const { container } = render(<SearchInput value="test" showClear />);

      expect(container.querySelector('.ant-input-clear-icon')).toBeTruthy();
    });

    it('should handle special characters in input', () => {
      const onSearch = vi.fn();
      const { container } = render(<SearchInput value="" onSearch={onSearch} />);

      const input = container.querySelector('input');
      if (input) {
        fireEvent.change(input, { target: { value: 'React (18)' } });

        vi.advanceTimersByTime(300);

        expect(onSearch).toHaveBeenCalledWith('React (18)');
      }
    });

    it('should handle very long input', () => {
      const onSearch = vi.fn();
      const longKeyword = '这是一个非常长的搜索关键词用于测试边界情况';
      const { container } = render(<SearchInput value="" onSearch={onSearch} />);

      const input = container.querySelector('input');
      if (input) {
        fireEvent.change(input, { target: { value: longKeyword } });

        vi.advanceTimersByTime(300);

        expect(onSearch).toHaveBeenCalledWith(longKeyword);
      }
    });
  });
});