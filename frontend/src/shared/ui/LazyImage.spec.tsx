// src/shared/ui/LazyImage.spec.tsx

import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { LazyImage } from './LazyImage';

// Mock IntersectionObserver - 立即触发回调
beforeAll(() => {
  class IntersectionObserverMock implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '0px';
    readonly thresholds: readonly number[] = [0];
    readonly scrollMargin: string = '0px';
    constructor(private callback: IntersectionObserverCallback) {}
    observe(target: Element) {
      // 同步触发回调，表示元素已进入视口
      this.callback([{
        isIntersecting: true,
        target,
        intersectionRatio: 1,
        time: 0,
        boundingClientRect: new DOMRect(0, 0, 100, 100),
        rootBounds: null,
        intersectionRect: new DOMRect(0, 0, 100, 100),
      }], this);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;
});

describe('LazyImage', () => {
  const testImageUrl = 'https://via.placeholder.com/400x300';
  const testAltText = 'Test Image';

  describe('Happy Path', () => {
    it('should render with placeholder initially', () => {
      const { container } = render(<LazyImage src={testImageUrl} alt={testAltText} />);

      const placeholder = container.firstChild as HTMLElement;
      expect(placeholder).toBeTruthy();
      expect(placeholder.classList.contains('bg-gray-100')).toBe(true);
    });

    it('should accept className prop', () => {
      const customClass = 'custom-image-class';
      const { container } = render(
        <LazyImage
          src={testImageUrl}
          alt={testAltText}
          className={customClass}
        />
      );

      const containerDiv = container.querySelector(`.${customClass}`);
      expect(containerDiv).toBeTruthy();
    });

    it('should accept style prop', () => {
      const customStyle = { width: '200px', height: '150px' };
      const { container } = render(
        <LazyImage
          src={testImageUrl}
          alt={testAltText}
          style={customStyle}
        />
      );

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toBeTruthy();
    });

    it('should accept alt prop for accessibility', () => {
      const { container } = render(<LazyImage src={testImageUrl} alt={testAltText} />);

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeTruthy();
    });
  });

  describe('Error Path', () => {
    it('should handle image load error gracefully', async () => {
      const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')?.set;

      vi.spyOn(HTMLImageElement.prototype, 'src', 'set').mockImplementation(function(this: HTMLImageElement, value: string) {
        if (originalSrcSetter) {
          originalSrcSetter.call(this, value);
        }
        setTimeout(() => {
          this.onerror?.(new Event('error'));
        }, 0);
      });

      const { container } = render(<LazyImage src={testImageUrl} alt={testAltText} />);

      await new Promise(resolve => setTimeout(resolve, 100));

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeTruthy();

      vi.restoreAllMocks();
    });

    it('should handle empty src gracefully', () => {
      const { container } = render(<LazyImage src="" alt={testAltText} />);

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeTruthy();
    });

    it('should handle empty alt gracefully', () => {
      const { container } = render(<LazyImage src={testImageUrl} alt="" />);

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large image URL', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(1000) + '.png';
      const { container } = render(<LazyImage src={longUrl} alt={testAltText} />);

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeTruthy();
    });

    it('should handle special characters in alt text', () => {
      const specialAlt = 'Image with special chars: <>&"\'';
      const { container } = render(<LazyImage src={testImageUrl} alt={specialAlt} />);

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeTruthy();
    });
  });
});
