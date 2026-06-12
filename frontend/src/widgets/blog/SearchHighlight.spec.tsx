// src/widgets/blog/SearchHighlight.spec.tsx

import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { SearchHighlight } from './SearchHighlight';

describe('SearchHighlight', () => {
  describe('Happy Path', () => {
    it('should highlight matching keyword', () => {
      const { container } = render(
        <SearchHighlight text="React 18 新特性详解" keyword="React" />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements.length).toBe(1);
      expect(markElements[0].textContent).toBe('React');
    });

    it('should highlight keyword case-insensitively', () => {
      const { container } = render(
        <SearchHighlight text="React 18 新特性详解" keyword="react" />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements.length).toBe(1);
      expect(markElements[0].textContent).toBe('React');
    });

    it('should highlight multiple occurrences', () => {
      const { container } = render(
        <SearchHighlight text="React React React" keyword="React" />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements.length).toBe(3);
    });

    it('should highlight keyword in middle of text', () => {
      const { container } = render(
        <SearchHighlight text="学习 React 很有趣" keyword="React" />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements.length).toBe(1);
      expect(markElements[0].textContent).toBe('React');
    });

    it('should render text without keyword unchanged', () => {
      const { container } = render(
        <SearchHighlight text="TypeScript 高级类型" keyword="" />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements.length).toBe(0);
      expect(container.textContent).toBe('TypeScript 高级类型');
    });
  });

  describe('Error Path', () => {
    it('should handle empty text', () => {
      const { container } = render(
        <SearchHighlight text="" keyword="React" />
      );

      expect(container.textContent).toBe('');
    });

    it('should handle empty keyword', () => {
      const { container } = render(
        <SearchHighlight text="React 18" keyword="" />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements.length).toBe(0);
    });

    it('should handle null keyword', () => {
      const { container } = render(
        <SearchHighlight text="React 18" keyword={null as unknown as string} />
      );

      expect(container.textContent).toBe('React 18');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special regex characters in keyword', () => {
      const { container } = render(
        <SearchHighlight text="test (pattern) here" keyword="(pattern)" />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements.length).toBe(1);
      expect(markElements[0].textContent).toBe('(pattern)');
    });

    it('should handle Chinese characters', () => {
      const { container } = render(
        <SearchHighlight text="React 新特性详解" keyword="新特性" />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements.length).toBe(1);
      expect(markElements[0].textContent).toBe('新特性');
    });

    it('should handle mixed Chinese and English', () => {
      const { container } = render(
        <SearchHighlight text="学习React很有趣" keyword="React" />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements.length).toBe(1);
    });

    it('should not highlight when keyword not found', () => {
      const { container } = render(
        <SearchHighlight text="TypeScript 高级类型" keyword="React" />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements.length).toBe(0);
      expect(container.textContent).toBe('TypeScript 高级类型');
    });

    it('should use custom highlight className', () => {
      const { container } = render(
        <SearchHighlight
          text="React 18"
          keyword="React"
          highlightClassName="custom-highlight"
        />
      );

      const markElements = container.querySelectorAll('mark');
      expect(markElements[0].classList.contains('custom-highlight')).toBe(true);
    });
  });
});