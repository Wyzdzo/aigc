// src/widgets/seo/SeoMeta.tsx

import { useEffect } from 'react';

import type { ArticleSeoData, SeoMeta } from '@/shared/seo/types';
import { buildUrl } from '@/shared/seo/generateMeta';
import { generateArticlePageMeta, generatePageMeta } from '@/shared/seo/generateMeta';

/**
 * SEO Meta 组件属性
 */
export interface SeoMetaProps {
  /** 页面标题 */
  title?: string;
  /** 页面描述 */
  description?: string;
  /** 自定义 Meta 数据 */
  customMeta?: Partial<SeoMeta & { ogImage?: string }>;
  /** 文章数据（用于文章详情页） */
  article?: ArticleSeoData;
  /** 文章 slug（与 article 配合使用） */
  articleSlug?: string;
}

/**
 * 设置 Meta 标签到 document.head
 */
function setMetaTags(
  seo: SeoMeta,
  og: { ogTitle: string; ogDescription: string; ogType: string; ogUrl: string; ogSiteName: string; ogLocale: string; ogImage?: string },
  twitter: { twitterCard: string; twitterSite?: string; twitterCreator?: string },
  article?: ArticleSeoData,
) {
  // 标准 Meta
  document.title = seo.title;
  setMetaProperty('description', seo.description);
  if (seo.keywords) setMetaProperty('keywords', seo.keywords);
  if (seo.author) setMetaProperty('author', seo.author);
  if (seo.canonicalUrl) setLinkTag('canonical', seo.canonicalUrl);

  // Open Graph
  setMetaProperty('og:title', og.ogTitle);
  setMetaProperty('og:description', og.ogDescription);
  setMetaProperty('og:type', og.ogType);
  setMetaProperty('og:url', og.ogUrl);
  setMetaProperty('og:site_name', og.ogSiteName);
  setMetaProperty('og:locale', og.ogLocale);
  if (og.ogImage) {
    setMetaProperty('og:image', og.ogImage);
    setMetaProperty('og:image:secure_url', og.ogImage);
    setMetaProperty('og:image:width', '1200');
    setMetaProperty('og:image:height', '630');
  }

  // Twitter Card
  setMetaProperty('twitter:card', twitter.twitterCard);
  if (twitter.twitterSite) setMetaProperty('twitter:site', twitter.twitterSite);
  if (twitter.twitterCreator) setMetaProperty('twitter:creator', twitter.twitterCreator);
  setMetaProperty('twitter:title', og.ogTitle);
  setMetaProperty('twitter:description', og.ogDescription);
  if (og.ogImage) setMetaProperty('twitter:image', og.ogImage);

  // 文章特定 Meta
  if (article?.publishedTime) {
    const publishedTimeStr = typeof article.publishedTime === 'string' 
      ? article.publishedTime 
      : article.publishedTime.toISOString();
    setMetaProperty('article:published_time', publishedTimeStr);
  }
  if (article?.modifiedTime) {
    const modifiedTimeStr = typeof article.modifiedTime === 'string' 
      ? article.modifiedTime 
      : article.modifiedTime.toISOString();
    setMetaProperty('article:modified_time', modifiedTimeStr);
  }
  if (article?.category) setMetaProperty('article:section', article.category);
}

/**
 * 设置 meta 属性
 */
function setMetaProperty(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(name.includes(':') ? 'property' : 'name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * 设置 link 标签
 */
function setLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * SEO Meta 组件
 * 用于设置页面 Meta 标签、Open Graph 和 Twitter Card
 */
export function SeoMeta({
  title,
  description,
  customMeta,
  article,
  articleSlug,
}: SeoMetaProps) {
  // 生成 Meta 数据
  const metaData = article && articleSlug
    ? generateArticlePageMeta(article, articleSlug)
    : generatePageMeta(title, description, customMeta);

  const { seo, og, twitter } = metaData;

  useEffect(() => {
    setMetaTags(seo, og, twitter, article);

    return () => {
      // 清理时恢复默认标题（可选）
      // document.title = DEFAULT_SEO_CONFIG.title;
    };
  }, [seo, og, twitter, article]);

  return null;
}

/**
 * 网站结构化数据组件
 */
export function SchemaOrg({ type, data }: { type: string; data: Record<string, unknown> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    script.id = 'schema-org-script';
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('schema-org-script');
      if (existing) existing.remove();
    };
  }, [schema]);

  return null;
}

/**
 * 文章结构化数据组件
 */
export function ArticleSchema({
  title,
  description,
  url,
  image,
  publishedTime,
  author,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime?: string;
  author?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: buildUrl(url),
    datePublished: publishedTime,
    ...(image && { image: buildUrl(image) }),
    author: {
      '@type': 'Person',
      name: author || 'Admin',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AIGC Blog',
    },
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    script.id = 'article-schema-script';
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('article-schema-script');
      if (existing) existing.remove();
    };
  }, [schema]);

  return null;
}

/**
 * 网站结构化数据组件
 */
export function WebsiteSchema({ name, description }: { name: string; description: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url: buildUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: buildUrl('/search?q={search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    },
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    script.id = 'website-schema-script';
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('website-schema-script');
      if (existing) existing.remove();
    };
  }, [schema]);

  return null;
}
