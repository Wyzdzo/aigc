// src/shared/blog/markdown.tsx

import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import { LazyImage } from '@/shared/ui/LazyImage';

/**
 * Markdown 渲染组件属性
 */
export interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * 检测内容是否为 HTML（而非纯 Markdown）
 */
function isHtmlContent(content: string): boolean {
  const trimmed = content.trim();
  // 以 HTML 标签开头，或包含常见 TipTap/HTML 标签模式
  return /^\s*<[a-zA-Z]/.test(trimmed) || /<\/(h[1-6]|p|div|ul|ol|li|blockquote|pre|code|strong|em|span)>/.test(trimmed);
}

/**
 * 从 HTML 内容中提取标题（用于 TOC）
 */
function extractHtmlHeadings(html: string): { id: string; text: string; level: number }[] {
  const headingRegex = /<h([1-6])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const rawText = match[2]
      .replace(/<[^>]+>/g, '') // 去掉内嵌标签
      .trim();
    const id = rawText
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    headings.push({ id, text: rawText, level });
  }

  return headings;
}

/**
 * 为 HTML 内容中的标题添加 id 属性
 */
function addHtmlHeadingIds(html: string): string {
  return html.replace(/<h([1-6])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi, (_, level, attrs, content) => {
    const rawText = content.replace(/<[^>]+>/g, '').trim();
    const id = rawText
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const existingAttrs = attrs || '';
    // 如果已有 id 属性则不重复添加
    if (/\bid\s*=/.test(existingAttrs)) {
      return `<h${level}${existingAttrs}>${content}</h${level}>`;
    }
    return `<h${level} id="${id}"${existingAttrs}>${content}</h${level}>`;
  });
}

/**
 * 自定义 Markdown 组件
 */
const components: Components = {
  h1: ({ children }) => {
    const text = typeof children === 'string' ? children : '';
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
    return <h1 id={id} className="text-3xl font-bold mt-8 mb-4">{children}</h1>;
  },
  h2: ({ children }) => {
    const text = typeof children === 'string' ? children : '';
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
    return <h2 id={id} className="text-2xl font-bold mt-6 mb-3">{children}</h2>;
  },
  h3: ({ children }) => {
    const text = typeof children === 'string' ? children : '';
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
    return <h3 id={id} className="text-xl font-bold mt-4 mb-2">{children}</h3>;
  },
  h4: ({ children }) => {
    const text = typeof children === 'string' ? children : '';
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
    return <h4 id={id} className="text-lg font-bold mt-3 mb-2">{children}</h4>;
  },
  p: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 pl-4 my-4 italic" style={{ borderColor: 'var(--ant-color-border)', color: 'var(--ant-color-text-secondary)' }}>
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match;

    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{ background: 'var(--ant-color-fill-secondary)', color: 'var(--ant-color-text-secondary)' }}
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className={`${className} block my-4 p-4 rounded-lg overflow-x-auto`}
        style={{ background: 'var(--ant-color-fill-quaternary)', color: 'var(--ant-color-text)' }}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-4 rounded-lg overflow-hidden">{children}</pre>,
  a: ({ href, children }) => (
    <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <LazyImage
      src={src ?? ''}
      alt={alt ?? ''}
      className="my-4 max-w-full rounded-lg"
      skeleton={false}
    />
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full divide-y" style={{ borderColor: 'var(--ant-color-border-secondary)' }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead style={{ background: 'var(--ant-color-fill-quaternary)' }}>{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y" style={{ borderColor: 'var(--ant-color-border-secondary)' }}>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th className="px-3 py-2 text-left text-sm font-medium">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 text-sm">{children}</td>,
  hr: () => <hr className="my-8" style={{ borderColor: 'var(--ant-color-border-secondary)' }} />,
};

/**
 * Markdown 渲染组件
 * 自动检测内容格式：HTML 内容直接渲染，Markdown 内容通过 ReactMarkdown 解析
 */
export function Markdown({ content, className = '' }: MarkdownProps) {
  if (isHtmlContent(content)) {
    // HTML 内容（TipTap 编辑器输出）：添加标题 id 后直接渲染
    const htmlWithIds = addHtmlHeadingIds(content);
    return (
      <div
        className={`prose prose-gray max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: htmlWithIds }}
      />
    );
  }

  // Markdown 内容：通过 ReactMarkdown 解析
  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * 从内容中提取目录（自动适配 HTML / Markdown 格式）
 */
export function extractTocFromContent(content: string): { id: string; text: string; level: number }[] {
  if (isHtmlContent(content)) {
    return extractHtmlHeadings(content);
  }

  // Markdown 格式
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    toc.push({ id, text, level });
  }

  return toc;
}

export default Markdown;
