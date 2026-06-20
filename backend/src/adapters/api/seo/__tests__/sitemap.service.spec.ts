// src/adapters/api/seo/__tests__/sitemap.service.spec.ts

import { SitemapService } from '../sitemap.service';
import { ChangeFreq } from '@app-types/common/seo.types';
import { PostStatus } from '@app-types/models/blog/blog.types';

describe('SitemapService', () => {
  const createMockBlogQueryService = () => ({
    getPosts: jest.fn(),
    getAllCategories: jest.fn(),
    getAllTags: jest.fn(),
  });

  const createMockConfigService = (config: Record<string, any>) => ({
    get: jest.fn((key: string, defaultValue?: any) => config[key] ?? defaultValue),
  });

  const setup = (config: Record<string, any> = {}) => {
    const blogQueryService = createMockBlogQueryService();
    const configService = createMockConfigService({
      'app.host': 'http://localhost',
      'app.port': 3000,
      'app.publicUrl': undefined,
      ...config,
    });
    const service = new SitemapService(blogQueryService as any, configService as any);
    return { service, blogQueryService, configService };
  };

  describe('getBaseUrl', () => {
    it('should return default base URL when publicUrl is not set', () => {
      const { service } = setup();
      const url = (service as any).getBaseUrl();
      expect(url).toBe('http://localhost:3000');
    });

    it('should return publicUrl when set', () => {
      const { service } = setup({ 'app.publicUrl': 'https://example.com' });
      const url = (service as any).getBaseUrl();
      expect(url).toBe('https://example.com');
    });
  });

  describe('getStaticPages', () => {
    it('should return static pages with correct URLs', () => {
      const { service } = setup();
      const pages = (service as any).getStaticPages();

      expect(pages.length).toBe(7);
      expect(pages[0].loc).toBe('http://localhost:3000/blog');
      expect(pages[0].changefreq).toBe(ChangeFreq.HOURLY);
      expect(pages[0].priority).toBe(1.0);

      expect(pages[1].loc).toBe('http://localhost:3000/blog/archives');
      expect(pages[1].changefreq).toBe(ChangeFreq.DAILY);
      expect(pages[1].priority).toBe(0.8);

      expect(pages[2].loc).toBe('http://localhost:3000/blog/categories');
      expect(pages[2].changefreq).toBe(ChangeFreq.WEEKLY);
      expect(pages[2].priority).toBe(0.7);

      expect(pages[3].loc).toBe('http://localhost:3000/blog/tags');
      expect(pages[3].changefreq).toBe(ChangeFreq.WEEKLY);
      expect(pages[3].priority).toBe(0.7);

      expect(pages[4].loc).toBe('http://localhost:3000/blog/about');
      expect(pages[4].changefreq).toBe(ChangeFreq.MONTHLY);
      expect(pages[4].priority).toBe(0.6);
    });
  });

  describe('getBlogPosts', () => {
    it('should return blog post URLs with correct format', async () => {
      const { service, blogQueryService } = setup();
      const mockPosts = [
        {
          id: 1,
          slug: 'test-post-1',
          title: 'Test Post 1',
          isTop: true,
          status: PostStatus.PUBLISHED,
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: 2,
          slug: 'test-post-2',
          title: 'Test Post 2',
          isTop: false,
          status: PostStatus.PUBLISHED,
          updatedAt: new Date('2024-01-10'),
        },
      ];

      blogQueryService.getPosts.mockResolvedValue({ items: mockPosts, total: 2 });

      const posts = await (service as any).getBlogPosts();

      expect(posts.length).toBe(2);
      expect(posts[0].loc).toBe('http://localhost:3000/blog/test-post-1');
      expect(posts[0].lastmod).toBe('2024-01-15');
      expect(posts[0].changefreq).toBe(ChangeFreq.DAILY);
      expect(posts[0].priority).toBe(0.9);

      expect(posts[1].loc).toBe('http://localhost:3000/blog/test-post-2');
      expect(posts[1].lastmod).toBe('2024-01-10');
      expect(posts[1].changefreq).toBe(ChangeFreq.WEEKLY);
      expect(posts[1].priority).toBe(0.7);
    });

    it('should handle empty posts', async () => {
      const { service, blogQueryService } = setup();
      blogQueryService.getPosts.mockResolvedValue({ items: [], total: 0 });

      const posts = await (service as any).getBlogPosts();

      expect(posts.length).toBe(0);
    });

    it('should handle posts without updatedAt', async () => {
      const { service, blogQueryService } = setup();
      blogQueryService.getPosts.mockResolvedValue({
        items: [{ id: 1, slug: 'no-date', isTop: false, status: PostStatus.PUBLISHED }],
        total: 1,
      });

      const posts = await (service as any).getBlogPosts();

      expect(posts[0].lastmod).toBeUndefined();
    });
  });

  describe('getCategories', () => {
    it('should return category URLs', async () => {
      const { service, blogQueryService } = setup();
      blogQueryService.getAllCategories.mockResolvedValue([
        { id: 1, name: 'Category 1', slug: 'category-1' },
        { id: 2, name: 'Category 2', slug: 'category-2' },
      ]);

      const categories = await (service as any).getCategories();

      expect(categories.length).toBe(2);
      expect(categories[0].loc).toBe('http://localhost:3000/blog/category/1');
      expect(categories[0].changefreq).toBe(ChangeFreq.WEEKLY);
      expect(categories[0].priority).toBe(0.6);
    });

    it('should handle empty categories', async () => {
      const { service, blogQueryService } = setup();
      blogQueryService.getAllCategories.mockResolvedValue([]);

      const categories = await (service as any).getCategories();

      expect(categories.length).toBe(0);
    });
  });

  describe('getTags', () => {
    it('should return tag URLs', async () => {
      const { service, blogQueryService } = setup();
      blogQueryService.getAllTags.mockResolvedValue([
        { id: 1, name: 'Tag 1', slug: 'tag-1' },
        { id: 2, name: 'Tag 2', slug: 'tag-2' },
      ]);

      const tags = await (service as any).getTags();

      expect(tags.length).toBe(2);
      expect(tags[0].loc).toBe('http://localhost:3000/blog/tags?tag=tag-1');
      expect(tags[0].changefreq).toBe(ChangeFreq.WEEKLY);
      expect(tags[0].priority).toBe(0.5);
    });

    it('should handle empty tags', async () => {
      const { service, blogQueryService } = setup();
      blogQueryService.getAllTags.mockResolvedValue([]);

      const tags = await (service as any).getTags();

      expect(tags.length).toBe(0);
    });
  });

  describe('getSitemapData', () => {
    it('should return complete sitemap data', async () => {
      const { service, blogQueryService } = setup();

      blogQueryService.getPosts.mockResolvedValue({
        items: [{ id: 1, slug: 'test-post', isTop: false, status: PostStatus.PUBLISHED }],
        total: 1,
      });
      blogQueryService.getAllCategories.mockResolvedValue([{ id: 1, name: 'Cat', slug: 'cat' }]);
      blogQueryService.getAllTags.mockResolvedValue([{ id: 1, name: 'Tag', slug: 'tag' }]);

      const data = await service.getSitemapData();

      expect(data.baseUrl).toBe('http://localhost:3000');
      expect(data.staticPages.length).toBe(7);
      expect(data.blogPosts.length).toBe(1);
      expect(data.categories.length).toBe(1);
      expect(data.tags.length).toBe(1);
    });
  });

  describe('generateSitemapXml', () => {
    it('should generate valid XML', async () => {
      const { service, blogQueryService } = setup();

      blogQueryService.getPosts.mockResolvedValue({
        items: [{ id: 1, slug: 'test-post', isTop: false, status: PostStatus.PUBLISHED }],
        total: 1,
      });
      blogQueryService.getAllCategories.mockResolvedValue([{ id: 1, name: 'Cat', slug: 'cat' }]);
      blogQueryService.getAllTags.mockResolvedValue([{ id: 1, name: 'Tag', slug: 'tag' }]);

      const xml = await service.generateSitemapXml();

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>http://localhost:3000/blog/test-post</loc>');
      expect(xml).toContain('<changefreq>weekly</changefreq>');
      expect(xml).toContain('<priority>0.7</priority>');
      expect(xml).toContain('</urlset>');
    });

    it('should generate XML with lastmod when available', async () => {
      const { service, blogQueryService } = setup();

      blogQueryService.getPosts.mockResolvedValue({
        items: [
          {
            id: 1,
            slug: 'test-post',
            isTop: false,
            status: PostStatus.PUBLISHED,
            updatedAt: new Date('2024-01-15'),
          },
        ],
        total: 1,
      });
      blogQueryService.getAllCategories.mockResolvedValue([]);
      blogQueryService.getAllTags.mockResolvedValue([]);

      const xml = await service.generateSitemapXml();

      expect(xml).toContain('<lastmod>2024-01-15</lastmod>');
    });
  });
});
