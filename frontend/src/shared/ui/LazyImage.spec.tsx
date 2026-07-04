// src/shared/ui/LazyImage.spec.tsx

import { render, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { LazyImage } from './LazyImage';

// Mock IntersectionObserver
class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '100px';
  readonly thresholds: readonly number[] = [0.1];
  readonly scrollMargin: string = '0px';

  constructor(private callback: IntersectionObserverCallback) {}

  observe(target: Element) {
    // Immediately trigger intersection
    this.callback(
      [{
        isIntersecting: true,
        target,
        intersectionRatio: 1,
        time: 0,
        boundingClientRect: new DOMRect(0, 0, 100, 100),
        rootBounds: null,
        intersectionRect: new DOMRect(0, 0, 100, 100),
      }],
      this as unknown as IntersectionObserver
    );
  }

  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

// Mock Image
class MockImage {
  src = '';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  alt = '';

  constructor() {
    // Simulate async loading
    setTimeout(() => {
      if (this.src && this.src !== 'invalid-url') {
        this.onload?.();
      } else {
        this.onerror?.();
      }
    }, 0);
  }
}

beforeAll(() => {
  globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;
  globalThis.Image = MockImage as unknown as typeof Image;
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('LazyImage', () => {
  const testImageUrl = 'https://via.placeholder.com/400x300';
  const testAltText = 'Test Image';

  describe('Happy Path', () => {
    it('should render with skeleton placeholder initially', () => {
      const { container } = render(<LazyImage src={testImageUrl} alt={testAltText} />);

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeTruthy();
    });

    it('should render with spinner when skeleton is false', () => {
      const { container } = render(<LazyImage src={testImageUrl} alt={testAltText} skeleton={false} />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeTruthy();
    });

    it('should accept width and height props', () => {
      const { container } = render(
        <LazyImage src={testImageUrl} alt={testAltText} width={200} height={150} />
      );

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv.style.width).toBe('200px');
      expect(containerDiv.style.height).toBe('150px');
    });

    it('should accept string width and height', () => {
      const { container } = render(
        <LazyImage src={testImageUrl} alt={testAltText} width="100%" height="auto" />
      );

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv.style.width).toBe('100%');
      expect(containerDiv.style.height).toBe('auto');
    });

    it('should default to 100% width and height when not specified', () => {
      const { container } = render(<LazyImage src={testImageUrl} alt={testAltText} />);

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv.style.width).toBe('100%');
      expect(containerDiv.style.height).toBe('100%');
    });

    it('should accept className and style props', () => {
      const customClass = 'custom-image-class';
      const customStyle = { borderRadius: '8px' };
      const { container } = render(
        <LazyImage
          src={testImageUrl}
          alt={testAltText}
          className={customClass}
          style={customStyle}
        />
      );

      const containerDiv = container.querySelector(`.${customClass}`);
      expect(containerDiv).toBeTruthy();
      expect((containerDiv as HTMLElement).style.borderRadius).toBe('8px');
    });

    it('should use IntersectionObserver for lazy loading', () => {
      const observeSpy = vi.spyOn(IntersectionObserverMock.prototype, 'observe');
      render(<LazyImage src={testImageUrl} alt={testAltText} />);

      expect(observeSpy).toHaveBeenCalled();

      observeSpy.mockRestore();
    });
  });

  describe('Error Path', () => {
    it('should handle empty src gracefully', () => {
      const { container } = render(<LazyImage src="" alt={testAltText} />);

      const placeholder = container.querySelector('.animate-pulse');
      expect(placeholder).toBeTruthy();
    });

    it('should handle null src gracefully', () => {
      const { container } = render(<LazyImage src={null as unknown as string} alt={testAltText} />);

      const placeholder = container.querySelector('.animate-pulse');
      expect(placeholder).toBeTruthy();
    });

    it('should handle empty alt gracefully', () => {
      const { container } = render(<LazyImage src={testImageUrl} alt="" />);

      // Component should still render
      const wrapper = container.firstChild;
      expect(wrapper).toBeTruthy();
    });

    it('should render placeholder on error when provided', async () => {
      const placeholderUrl = 'https://via.placeholder.com/placeholder';
      const { container } = render(
        <LazyImage src="invalid-url" alt={testAltText} placeholder={placeholderUrl} />
      );

      // Wait for error handling and re-render
      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img?.getAttribute('src')).toBe(placeholderUrl);
      }, { timeout: 3000 });
    });
  });

  describe('Props Validation', () => {
    it('should render with all optional props', () => {
      const { container } = render(
        <LazyImage
          src={testImageUrl}
          alt={testAltText}
          width={300}
          height={200}
          className="test-class"
          style={{ margin: '10px' }}
          skeleton={true}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeTruthy();
      expect(wrapper.style.width).toBe('300px');
      expect(wrapper.style.height).toBe('200px');
      expect(wrapper.classList.contains('test-class')).toBeTruthy();
      expect(wrapper.style.margin).toBe('10px');
    });

    it('should render with skeleton=false', () => {
      const { container } = render(
        <LazyImage src={testImageUrl} alt={testAltText} skeleton={false} />
      );

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeTruthy();
    });
  });
});