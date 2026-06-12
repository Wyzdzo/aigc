// src/widgets/blog/SearchInput.spec.tsx

import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  describe('Happy Path', () => {
    it('should render search input', () => {
      render(<SearchInput />);

      const inputs = screen.getAllByPlaceholderText('搜索文章...');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should render with custom placeholder', () => {
      render(<SearchInput placeholder="输入关键词..." />);

      const inputs = screen.getAllByPlaceholderText('输入关键词...');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should show loading state', () => {
      const { container } = render(<SearchInput loading />);

      expect(container.querySelector('.anticon-loading')).toBeTruthy();
    });

    it('should render search button', () => {
      const { container } = render(<SearchInput />);

      expect(container.querySelector('.ant-input-search-btn')).toBeTruthy();
    });

    it('should allow input change', () => {
      render(<SearchInput />);

      const inputs = screen.getAllByPlaceholderText('搜索文章...');
      const input = inputs[0];
      fireEvent.change(input, { target: { value: 'React' } });

      expect(input).toHaveProperty('value', 'React');
    });
  });

  describe('Error Path', () => {
    it('should handle missing onSearch callback without error', () => {
      render(<SearchInput />);

      const inputs = screen.getAllByPlaceholderText('搜索文章...');
      const input = inputs[0];
      fireEvent.change(input, { target: { value: 'React' } });

      // Should not throw error
      expect(input).toHaveProperty('value', 'React');
    });
  });

  describe('Edge Cases', () => {
    it('should handle allowClear from Ant Design', () => {
      const { container } = render(<SearchInput showClear />);

      // Ant Design's allowClear should be present
      expect(container.querySelector('.ant-input-clear-icon')).toBeTruthy();
    });

    it('should handle special characters in input', () => {
      render(<SearchInput />);

      const inputs = screen.getAllByPlaceholderText('搜索文章...');
      const input = inputs[0];
      fireEvent.change(input, { target: { value: 'React (18)' } });

      expect(input).toHaveProperty('value', 'React (18)');
    });

    it('should handle very long input', () => {
      const longKeyword = '这是一个非常长的搜索关键词用于测试边界情况';
      render(<SearchInput />);

      const inputs = screen.getAllByPlaceholderText('搜索文章...');
      const input = inputs[0];
      fireEvent.change(input, { target: { value: longKeyword } });

      expect(input).toHaveProperty('value', longKeyword);
    });
  });
});