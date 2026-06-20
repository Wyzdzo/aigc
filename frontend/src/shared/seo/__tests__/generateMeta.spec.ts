// src/shared/seo/__tests__/generateMeta.spec.ts

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import {
  generateSeoMeta,
  generateOpenGraphMeta,
  generateTwitterCardMeta,
  generatePageMeta,
  generateArticleSeoMeta,
  generateArticleOpenGraphMeta,
  generateArticlePageMeta,
  buildUrl,
} from '../generateMeta';

describe('generateMeta', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    vi.stubEnv('VITE_PUBLIC_URL', 'https://example.com');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('buildUrl', () => {
    it('should build absolute URL from path', () => {
      expect(buildUrl('/blog/test-post')).toBe('https://example.com/blog/test-post');
    });

    it('should handle empty path', () => {
      expect(buildUrl('')).toBe('https://example.com/');
    });

    it('should handle root path', () => {
      expect(buildUrl('/')).toBe('https://example.com/');
    });

    it('should handle relative paths', () => {
      expect(buildUrl('blog/test')).toBe('https://example.com/blog/test');
    });
  });

  describe('generateSeoMeta', () => {
    it('should generate basic SEO meta', () => {
      const meta = generateSeoMeta('Test Title', 'Test description');

      expect(meta.title).toBe('Test Title | AIGC Blog');
      expect(meta.description).toBe('Test description');
      expect(meta.keywords).toBeUndefined();
    });

    it('should use custom meta when provided', () => {
      const meta = generateSeoMeta('Test Title', 'Test description', {
        keywords: 'Custom, Keywords',
        author: 'John Doe',
        canonicalUrl: 'https://example.com/page',
      });

      expect(meta.keywords).toBe('Custom, Keywords');
      expect(meta.author).toBe('John Doe');
      expect(meta.canonicalUrl).toBe('https://example.com/page');
    });

    it('should use default values when title/description not provided', () => {
      const meta = generateSeoMeta(undefined, undefined);

      expect(meta.title).toBe('AIGC Blog');
      expect(meta.description).toBe('一个基于 AI 的博客系统，分享技术见解和生活感悟');
    });

    it('should handle empty title and description', () => {
      const meta = generateSeoMeta('', '');

      expect(meta.title).toBe('AIGC Blog');
      expect(meta.description).toBe('一个基于 AI 的博客系统，分享技术见解和生活感悟');
    });
  });

  describe('generateOpenGraphMeta', () => {
    it('should generate Open Graph meta for website', () => {
      const og = generateOpenGraphMeta('Test Title', 'Test description', 'https://example.com', 'website');

      expect(og.ogTitle).toBe('Test Title');
      expect(og.ogDescription).toBe('Test description');
      expect(og.ogType).toBe('website');
      expect(og.ogUrl).toBe('https://example.com');
      expect(og.ogSiteName).toBe('AIGC Blog');
      expect(og.ogLocale).toBe('zh_CN');
      expect(og.ogImage).toBe('https://example.com/og-default.png');
    });

    it('should generate Open Graph meta for article', () => {
      const og = generateOpenGraphMeta('Article Title', 'Article description', 'https://example.com/article', 'article');

      expect(og.ogType).toBe('article');
      expect(og.ogUrl).toBe('https://example.com/article');
    });

    it('should use provided image', () => {
      const og = generateOpenGraphMeta('Title', 'Description', 'https://example.com', 'website', 'https://example.com/image.jpg');

      expect(og.ogImage).toBe('https://example.com/image.jpg');
    });

    it('should use default image when not provided', () => {
      const og = generateOpenGraphMeta('Title', 'Description', 'https://example.com', 'website');

      expect(og.ogImage).toBe('https://example.com/og-default.png');
    });
  });

  describe('generateTwitterCardMeta', () => {
    it('should generate Twitter Card meta without image', () => {
      const twitter = generateTwitterCardMeta(undefined);

      expect(twitter.twitterCard).toBe('summary');
    });

    it('should generate Twitter Card meta with image', () => {
      const twitter = generateTwitterCardMeta('https://example.com/image.jpg');

      expect(twitter.twitterCard).toBe('summary_large_image');
    });
  });

  describe('generatePageMeta', () => {
    it('should generate complete page meta', () => {
      const meta = generatePageMeta('Page Title', 'Page description');

      expect(meta.seo.title).toBe('Page Title | AIGC Blog');
      expect(meta.seo.description).toBe('Page description');
      expect(meta.og.ogType).toBe('website');
      expect(meta.twitter.twitterCard).toBe('summary');
    });

    it('should include custom ogImage when provided', () => {
      const meta = generatePageMeta('Page Title', 'Page description', { ogImage: 'https://example.com/image.jpg' });

      expect(meta.og.ogImage).toBe('https://example.com/image.jpg');
      expect(meta.twitter.twitterCard).toBe('summary_large_image');
    });

    it('should use ogType when provided', () => {
      const meta = generatePageMeta('Article Title', 'Article description', { ogType: 'article' });

      expect(meta.og.ogType).toBe('article');
    });

    it('should use canonicalUrl when provided', () => {
      const meta = generatePageMeta('Page Title', 'Page description', { canonicalUrl: 'https://example.com/canonical' });

      expect(meta.seo.canonicalUrl).toBe('https://example.com/canonical');
    });
  });

  describe('generateArticleSeoMeta', () => {
    it('should generate article SEO meta', () => {
      const article = {
        title: 'Article Title',
        summary: 'Article summary',
        publishedTime: '2024-01-15T00:00:00Z',
        modifiedTime: '2024-01-20T00:00:00Z',
        author: 'Test Author',
        category: 'Tech',
        tags: ['React', 'TypeScript'],
        coverImage: 'https://example.com/image.jpg',
      };

      const meta = generateArticleSeoMeta(article);

      expect(meta.title).toBe('Article Title');
      expect(meta.description).toBe('Article summary');
      expect(meta.author).toBe('Test Author');
      expect(meta.publishedTime).toBe('2024-01-15T00:00:00Z');
      expect(meta.modifiedTime).toBe('2024-01-20T00:00:00Z');
      expect(meta.category).toBe('Tech');
      expect(meta.tags).toEqual(['React', 'TypeScript']);
      expect(meta.keywords).toBe('React, TypeScript');
    });

    it('should handle missing optional fields', () => {
      const article = {
        title: 'Article Title',
        summary: 'Article summary',
        publishedTime: '2024-01-15T00:00:00Z',
        modifiedTime: undefined,
        author: undefined,
        category: undefined,
        tags: [],
        coverImage: undefined,
      };

      const meta = generateArticleSeoMeta(article);

      expect(meta.title).toBe('Article Title');
      expect(meta.author).toBeUndefined();
      expect(meta.keywords).toBeUndefined();
    });
  });

  describe('generateArticleOpenGraphMeta', () => {
    it('should generate article Open Graph meta', () => {
      const article = {
        title: 'Article Title',
        summary: 'Article summary',
        publishedTime: '2024-01-15T00:00:00Z',
        modifiedTime: '2024-01-20T00:00:00Z',
        author: 'Test Author',
        category: 'Tech',
        tags: ['React', 'TypeScript'],
        coverImage: 'https://example.com/image.jpg',
      };

      const og = generateArticleOpenGraphMeta(article, 'https://example.com/article');

      expect(og.ogTitle).toBe('Article Title');
      expect(og.ogDescription).toBe('Article summary');
      expect(og.ogType).toBe('article');
      expect(og.ogUrl).toBe('https://example.com/article');
      expect(og.ogImage).toBe('https://example.com/image.jpg');
    });

    it('should use default image when article has no cover image', () => {
      const article = {
        title: 'No Image Article',
        summary: 'Article without image',
        publishedTime: '2024-01-15T00:00:00Z',
        modifiedTime: '2024-01-20T00:00:00Z',
        author: 'Test Author',
        category: 'Tech',
        tags: ['React'],
        coverImage: undefined,
      };

      const og = generateArticleOpenGraphMeta(article, 'https://example.com/no-image');

      expect(og.ogImage).toBe('https://example.com/og-default.png');
    });
  });

  describe('generateArticlePageMeta', () => {
    it('should generate complete article page meta', () => {
      const article = {
        title: 'Complete Article',
        summary: 'Complete article summary',
        publishedTime: '2024-01-15T00:00:00Z',
        modifiedTime: '2024-01-20T00:00:00Z',
        author: 'Test Author',
        category: 'Tech',
        tags: ['React', 'TypeScript'],
        coverImage: 'https://example.com/image.jpg',
      };

      const meta = generateArticlePageMeta(article, 'complete-article');

      expect(meta.seo.title).toBe('Complete Article');
      expect(meta.seo.description).toBe('Complete article summary');
      expect(meta.og.ogType).toBe('article');
      expect(meta.og.ogUrl).toBe('https://example.com/blog/complete-article');
      expect(meta.og.ogImage).toBe('https://example.com/image.jpg');
      expect(meta.twitter.twitterCard).toBe('summary_large_image');
    });

    it('should use default image when article has no cover image', () => {
      const article = {
        title: 'No Cover Article',
        summary: 'Article without cover',
        publishedTime: '2024-01-15T00:00:00Z',
        modifiedTime: '2024-01-20T00:00:00Z',
        author: 'Test Author',
        category: 'Tech',
        tags: ['React'],
        coverImage: undefined,
      };

      const meta = generateArticlePageMeta(article, 'no-cover');

      expect(meta.og.ogImage).toBe('https://example.com/og-default.png');
      expect(meta.twitter.twitterCard).toBe('summary');
    });
  });
});
