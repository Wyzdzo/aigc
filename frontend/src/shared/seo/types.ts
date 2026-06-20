// src/shared/seo/types.ts

/**
 * SEO Meta 信息
 */
export interface SeoMeta {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description: string;
  /** 关键词（可选） */
  keywords?: string;
  /** 标准URL */
  canonicalUrl?: string;
  /** 作者 */
  author?: string;
  /** 发布时间 */
  publishedTime?: string;
  /** 修改时间 */
  modifiedTime?: string;
  /** 分类 */
  category?: string;
  /** 标签 */
  tags?: string[];
}

/**
 * Open Graph 元信息
 */
export interface OpenGraphMeta {
  /** OG标题 */
  ogTitle: string;
  /** OG描述 */
  ogDescription: string;
  /** OG图片URL */
  ogImage?: string;
  /** OG类型 */
  ogType: 'website' | 'article' | 'profile';
  /** OG URL */
  ogUrl: string;
  /** 网站名称 */
  ogSiteName: string;
  /** 区域设置 */
  ogLocale: string;
}

/**
 * Twitter Card 元信息
 */
export interface TwitterCardMeta {
  /** 卡片类型 */
  twitterCard: 'summary' | 'summary_large_image';
  /** Twitter 账号 */
  twitterSite?: string;
  /** Twitter 作者 */
  twitterCreator?: string;
}

/**
 * Sitemap URL 条目
 */
export interface SitemapUrl {
  /** URL 地址 */
  loc: string;
  /** 最后修改时间 */
  lastmod?: string;
  /** 更新频率 */
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** 优先级 */
  priority: number;
}

/**
 * 文章 SEO 数据
 */
export interface ArticleSeoData {
  title: string;
  slug?: string;
  summary: string | null;
  coverImage: string | null;
  author?: string;
  publishedTime: string | Date;
  modifiedTime: string | Date;
  category?: string;
  tags?: string[];
}

/**
 * 默认 SEO 配置
 */
export const DEFAULT_SEO_CONFIG = {
  title: 'AIGC Blog',
  description: '一个基于 AI 的博客系统，分享技术见解和生活感悟',
  keywords: 'AIGC, AI, Blog, 技术博客',
  author: '',
  ogSiteName: 'AIGC Blog',
  ogLocale: 'zh_CN',
} as const;
