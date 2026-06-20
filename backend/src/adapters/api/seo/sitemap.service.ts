// src/adapters/api/seo/sitemap.service.ts

import { Injectable } from '@nestjs/common';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import { ConfigService } from '@nestjs/config';
import { ChangeFreq } from '@app-types/common/seo.types';
import { PostStatus } from '@app-types/models/blog/blog.types';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: ChangeFreq;
  priority: number;
}

export interface SitemapData {
  baseUrl: string;
  staticPages: SitemapUrl[];
  blogPosts: SitemapUrl[];
  categories: SitemapUrl[];
  tags: SitemapUrl[];
}

@Injectable()
export class SitemapService {
  constructor(
    private readonly blogQueryService: BlogQueryService,
    private readonly configService: ConfigService,
  ) {}

  private getBaseUrl(): string {
    const host = this.configService.get<string>('app.host', 'http://localhost');
    const port = this.configService.get<number>('app.port', 3000);
    const publicUrl = this.configService.get<string>('app.publicUrl');
    return publicUrl || `${host}:${port}`;
  }

  private getStaticPages(): SitemapUrl[] {
    const baseUrl = this.getBaseUrl();
    return [
      { loc: `${baseUrl}/blog`, changefreq: ChangeFreq.HOURLY, priority: 1.0 },
      { loc: `${baseUrl}/blog/archives`, changefreq: ChangeFreq.DAILY, priority: 0.8 },
      { loc: `${baseUrl}/blog/categories`, changefreq: ChangeFreq.WEEKLY, priority: 0.7 },
      { loc: `${baseUrl}/blog/tags`, changefreq: ChangeFreq.WEEKLY, priority: 0.7 },
      { loc: `${baseUrl}/blog/about`, changefreq: ChangeFreq.MONTHLY, priority: 0.6 },
      { loc: `${baseUrl}/blog/links`, changefreq: ChangeFreq.MONTHLY, priority: 0.6 },
      { loc: `${baseUrl}/blog/guestbook`, changefreq: ChangeFreq.MONTHLY, priority: 0.5 },
    ];
  }

  private async getBlogPosts(): Promise<SitemapUrl[]> {
    const baseUrl = this.getBaseUrl();
    const result = await this.blogQueryService.getPosts({
      options: { status: PostStatus.PUBLISHED, page: 1, pageSize: 1000 },
    });

    return result.items.map((post) => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : undefined,
      changefreq: post.isTop ? ChangeFreq.DAILY : ChangeFreq.WEEKLY,
      priority: post.isTop ? 0.9 : 0.7,
    }));
  }

  private async getCategories(): Promise<SitemapUrl[]> {
    const baseUrl = this.getBaseUrl();
    const categories = await this.blogQueryService.getAllCategories({});

    return categories.map((category) => ({
      loc: `${baseUrl}/blog/category/${category.id}`,
      changefreq: ChangeFreq.WEEKLY,
      priority: 0.6,
    }));
  }

  private async getTags(): Promise<SitemapUrl[]> {
    const baseUrl = this.getBaseUrl();
    const tags = await this.blogQueryService.getAllTags({});

    return tags.map((tag) => ({
      loc: `${baseUrl}/blog/tags?tag=${tag.slug}`,
      changefreq: ChangeFreq.WEEKLY,
      priority: 0.5,
    }));
  }

  async getSitemapData(): Promise<SitemapData> {
    const baseUrl = this.getBaseUrl();

    const [blogPosts, categories, tags] = await Promise.all([
      this.getBlogPosts(),
      this.getCategories(),
      this.getTags(),
    ]);

    return {
      baseUrl,
      staticPages: this.getStaticPages(),
      blogPosts,
      categories,
      tags,
    };
  }

  async generateSitemapXml(): Promise<string> {
    const data = await this.getSitemapData();
    const urls = [...data.staticPages, ...data.blogPosts, ...data.categories, ...data.tags];

    const urlEntries = urls
      .map((url) => {
        const lastmod = url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : '';
        return `  <url>\n    <loc>${url.loc}</loc>${lastmod}\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority.toFixed(1)}</priority>\n  </url>`;
      })
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
  }
}
