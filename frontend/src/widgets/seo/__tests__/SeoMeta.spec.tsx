// src/widgets/seo/__tests__/SeoMeta.spec.tsx

import { render, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { SeoMeta } from '../SeoMeta';

describe('SeoMeta', () => {
  beforeEach(() => {
    document.head.innerHTML = '<title>Original Title</title>';
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Happy Path', () => {
    it('should set basic page meta tags', () => {
      render(<SeoMeta title="Test Page" description="Test description" />);

      expect(document.title).toBe('Test Page | AIGC Blog');
      const descriptionMeta = document.querySelector('meta[name="description"]');
      expect(descriptionMeta?.getAttribute('content')).toBe('Test description');
    });

    it('should set Open Graph meta tags', () => {
      render(<SeoMeta title="OG Test" description="OG description" />);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogType = document.querySelector('meta[property="og:type"]');
      const ogImage = document.querySelector('meta[property="og:image"]');

      expect(ogTitle?.getAttribute('content')).toBe('OG Test | AIGC Blog');
      expect(ogDescription?.getAttribute('content')).toBe('OG description');
      expect(ogType?.getAttribute('content')).toBe('website');
      expect(ogImage?.getAttribute('content')).toBe('https://example.com/og-default.png');
    });

    it('should set article page meta tags', () => {
      render(
        <SeoMeta
          article={{
            title: 'Article Title',
            summary: 'Article summary',
            publishedTime: '2024-01-15T00:00:00Z',
            modifiedTime: '2024-01-20T00:00:00Z',
            author: 'Test Author',
            category: 'Tech',
            tags: ['React', 'TypeScript'],
            coverImage: 'https://example.com/image.jpg',
          }}
          articleSlug="article-title"
        />,
      );

      expect(document.title).toBe('Article Title');
      const ogType = document.querySelector('meta[property="og:type"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const publishedTime = document.querySelector('meta[property="article:published_time"]');
      const modifiedTime = document.querySelector('meta[property="article:modified_time"]');
      const section = document.querySelector('meta[property="article:section"]');

      expect(ogType?.getAttribute('content')).toBe('article');
      expect(ogImage?.getAttribute('content')).toBe('https://example.com/image.jpg');
      expect(publishedTime?.getAttribute('content')).toBe('2024-01-15T00:00:00Z');
      expect(modifiedTime?.getAttribute('content')).toBe('2024-01-20T00:00:00Z');
      expect(section?.getAttribute('content')).toBe('Tech');
    });

    it('should set Twitter Card meta tags', () => {
      render(<SeoMeta title="Twitter Test" description="Twitter description" />);

      const twitterCard = document.querySelector('meta[property="twitter:card"]');
      const twitterTitle = document.querySelector('meta[property="twitter:title"]');
      const twitterDescription = document.querySelector('meta[property="twitter:description"]');

      expect(twitterCard?.getAttribute('content')).toBe('summary');
      expect(twitterTitle?.getAttribute('content')).toBe('Twitter Test | AIGC Blog');
      expect(twitterDescription?.getAttribute('content')).toBe('Twitter description');
    });

    it('should handle keywords and author', () => {
      render(
        <SeoMeta
          title="Keywords Test"
          description="Test description"
          customMeta={{ keywords: 'React, TypeScript, SEO', author: 'John Doe' }}
        />,
      );

      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      const authorMeta = document.querySelector('meta[name="author"]');

      expect(keywordsMeta?.getAttribute('content')).toBe('React, TypeScript, SEO');
      expect(authorMeta?.getAttribute('content')).toBe('John Doe');
    });
  });

  describe('Error Path', () => {
    it('should handle empty title', () => {
      render(<SeoMeta title="" description="Test description" />);

      expect(document.title).toBe('AIGC Blog');
    });

    it('should handle empty description', () => {
      render(<SeoMeta title="Test Title" description="" />);

      const descriptionMeta = document.querySelector('meta[name="description"]');
      expect(descriptionMeta?.getAttribute('content')).toBe(
        '一个基于 AI 的博客系统，分享技术见解和生活感悟',
      );
    });

    it('should handle undefined article data', () => {
      render(<SeoMeta article={undefined} articleSlug="test-slug" />);

      expect(document.title).toBe('AIGC Blog');
    });

    it('should use default image when article has no coverImage', () => {
      render(
        <SeoMeta
          article={{
            title: 'No Image Article',
            summary: 'Article without image',
            publishedTime: '2024-01-15T00:00:00Z',
            modifiedTime: '2024-01-20T00:00:00Z',
            author: 'Test Author',
            category: 'Tech',
            tags: ['React'],
            coverImage: undefined,
          }}
          articleSlug="no-image"
        />,
      );

      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage?.getAttribute('content')).toBe('https://example.com/og-default.png');
    });
  });

  describe('Edge Cases', () => {
    it('should use default values when no props provided', () => {
      render(<SeoMeta />);

      expect(document.title).toBe('AIGC Blog');
      const descriptionMeta = document.querySelector('meta[name="description"]');
      expect(descriptionMeta?.getAttribute('content')).toBe(
        '一个基于 AI 的博客系统，分享技术见解和生活感悟',
      );
    });

    it('should handle null articleSlug', () => {
      render(
        <SeoMeta
          article={{
            title: 'Test Article',
            summary: 'Test summary',
            publishedTime: '2024-01-15T00:00:00Z',
            modifiedTime: '2024-01-20T00:00:00Z',
            author: 'Test Author',
            category: 'Tech',
            tags: ['React'],
            coverImage: 'https://example.com/image.jpg',
          }}
          articleSlug={null}
        />,
      );

      expect(document.title).toBe('AIGC Blog');
    });

    it('should handle empty tags array', () => {
      render(
        <SeoMeta
          article={{
            title: 'No Tags Article',
            summary: 'Article without tags',
            publishedTime: '2024-01-15T00:00:00Z',
            modifiedTime: '2024-01-20T00:00:00Z',
            author: 'Test Author',
            category: 'Tech',
            tags: [],
            coverImage: undefined,
          }}
          articleSlug="no-tags"
        />,
      );

      expect(document.title).toBe('No Tags Article');
    });

    it('should update meta tags when props change', () => {
      const { rerender } = render(<SeoMeta title="First Title" description="First description" />);

      expect(document.title).toBe('First Title | AIGC Blog');

      rerender(<SeoMeta title="Second Title" description="Second description" />);

      expect(document.title).toBe('Second Title | AIGC Blog');
      const descriptionMeta = document.querySelector('meta[name="description"]');
      expect(descriptionMeta?.getAttribute('content')).toBe('Second description');
    });
  });
});
