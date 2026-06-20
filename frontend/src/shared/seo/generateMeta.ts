// src/shared/seo/generateMeta.ts

import { getBaseUrl } from '@/shared/env';

import type { ArticleSeoData, OpenGraphMeta, SeoMeta, TwitterCardMeta } from './types';
import { DEFAULT_SEO_CONFIG } from './types';

/**
 * 构建完整 URL
 */
export function buildUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * 生成标准 Meta 标签数据
 */
export function generateSeoMeta(
  pageTitle?: string,
  pageDescription?: string,
  customMeta?: Partial<SeoMeta>,
): SeoMeta {
  const title = pageTitle ? `${pageTitle} | ${DEFAULT_SEO_CONFIG.title}` : DEFAULT_SEO_CONFIG.title;
  const description = pageDescription || DEFAULT_SEO_CONFIG.description;

  return {
    title,
    description,
    keywords: customMeta?.keywords,
    canonicalUrl: customMeta?.canonicalUrl,
    author: customMeta?.author || DEFAULT_SEO_CONFIG.author,
    publishedTime: customMeta?.publishedTime,
    modifiedTime: customMeta?.modifiedTime,
    category: customMeta?.category,
    tags: customMeta?.tags,
  };
}

/**
 * 生成文章 SEO Meta 数据
 */
export function generateArticleSeoMeta(article: ArticleSeoData): SeoMeta {
  const publishedTimeStr = article.publishedTime
    ? (typeof article.publishedTime === 'string'
      ? article.publishedTime
      : article.publishedTime.toISOString())
    : undefined;
  const modifiedTimeStr = article.modifiedTime
    ? (typeof article.modifiedTime === 'string'
      ? article.modifiedTime
      : article.modifiedTime.toISOString())
    : undefined;

  return {
    title: article.title,
    description: article.summary || DEFAULT_SEO_CONFIG.description,
    keywords: article.tags?.join(', ') || undefined,
    author: article.author,
    publishedTime: publishedTimeStr,
    modifiedTime: modifiedTimeStr,
    category: article.category,
    tags: article.tags,
  };
}

/**
 * 生成 Open Graph Meta 数据
 */
export function generateOpenGraphMeta(
  title: string,
  description: string,
  url: string,
  type: 'website' | 'article' | 'profile' = 'website',
  image?: string,
): OpenGraphMeta {
  return {
    ogTitle: title,
    ogDescription: description,
    ogImage: image || `${getBaseUrl()}/og-default.png`,
    ogType: type,
    ogUrl: url,
    ogSiteName: DEFAULT_SEO_CONFIG.ogSiteName,
    ogLocale: DEFAULT_SEO_CONFIG.ogLocale,
  };
}

/**
 * 生成文章 Open Graph Meta 数据
 */
export function generateArticleOpenGraphMeta(
  article: ArticleSeoData,
  pageUrl: string,
): OpenGraphMeta {
  return {
    ogTitle: article.title,
    ogDescription: article.summary || DEFAULT_SEO_CONFIG.description,
    ogImage: article.coverImage || `${getBaseUrl()}/og-default.png`,
    ogType: 'article',
    ogUrl: pageUrl,
    ogSiteName: DEFAULT_SEO_CONFIG.ogSiteName,
    ogLocale: DEFAULT_SEO_CONFIG.ogLocale,
  };
}

/**
 * 生成 Twitter Card Meta 数据
 */
export function generateTwitterCardMeta(image?: string): TwitterCardMeta {
  return {
    twitterCard: image ? 'summary_large_image' : 'summary',
  };
}

/**
 * 格式化 ISO 日期字符串
 */
export function formatIsoDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * 生成页面完整的 Meta 信息
 */
export function generatePageMeta(
  title?: string,
  description?: string,
  customMeta?: Partial<SeoMeta & { ogImage?: string; ogType?: 'website' | 'article' | 'profile' }>,
) {
  const seoMeta = generateSeoMeta(title, description, customMeta);
  const pageUrl = customMeta?.canonicalUrl || getBaseUrl();
  const ogMeta = generateOpenGraphMeta(
    seoMeta.title,
    seoMeta.description,
    pageUrl,
    customMeta?.ogType || 'website',
    customMeta?.ogImage,
  );
  const twitterMeta = generateTwitterCardMeta(customMeta?.ogImage);

  return {
    seo: seoMeta,
    og: ogMeta,
    twitter: twitterMeta,
  };
}

/**
 * 生成文章页面的完整 Meta 信息
 */
export function generateArticlePageMeta(article: ArticleSeoData, slug: string) {
  const seoMeta = generateArticleSeoMeta(article);
  const pageUrl = buildUrl(`/blog/${slug}`);
  const ogMeta = generateArticleOpenGraphMeta(article, pageUrl);
  const twitterMeta = generateTwitterCardMeta(article.coverImage || undefined);

  return {
    seo: seoMeta,
    og: ogMeta,
    twitter: twitterMeta,
  };
}
