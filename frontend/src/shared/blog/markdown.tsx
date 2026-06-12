// src/shared/blog/markdown.ts

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';

/**
 * Markdown 渲染组件属性
 */
export interface MarkdownProps {
  content: string;
  className?: string;
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
    <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match;

    if (isInline) {
      return (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }

    return <code className={`${className} block my-4 p-4 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto`}>{children}</code>;
  },
  pre: ({ children }) => <pre className="my-4 rounded-lg overflow-hidden">{children}</pre>,
  a: ({ href, children }) => (
    <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  img: ({ src, alt }) => <img src={src} alt={alt} className="my-4 max-w-full rounded-lg" />,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th className="px-3 py-2 text-left text-sm font-medium">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 text-sm">{children}</td>,
  hr: () => <hr className="my-8 border-gray-200" />,
};

/**
 * Markdown 渲染组件
 */
export function Markdown({ content, className = '' }: MarkdownProps) {
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
 * 从 Markdown 内容中提取目录
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
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

/**
 * 为 Markdown 内容中的标题添加 id
 */
export function addHeadingIds(content: string): string {
  return content.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, text) => {
    const id = text
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${hashes} ${text} {#${id}}`;
  });
}

export default Markdown;
