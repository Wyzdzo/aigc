// src/shared/lib/markdownUtils.ts

/**
 * 从 Markdown 内容中提取目录
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * 检测内容是否为 HTML 格式
 */
function isHtmlContent(content: string): boolean {
  const trimmed = content.trim();
  return /^\s*<[a-zA-Z]/.test(trimmed) || /<\/(h[1-6]|p|div|ul|ol|li|blockquote|pre|code|strong|em|span)>/.test(trimmed);
}

/**
 * 从 HTML 内容中提取标题
 */
function extractHtmlHeadings(html: string): TocItem[] {
  const headingRegex = /<h([1-6])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const rawText = match[2]
      .replace(/<[^>]+>/g, '')
      .trim();
    const id = rawText
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    toc.push({ id, text: rawText, level });
  }

  return toc;
}

/**
 * 从内容中提取目录（自动适配 HTML / Markdown 格式）
 */
export function extractToc(content: string): TocItem[] {
  if (!content) return [];

  if (isHtmlContent(content)) {
    return extractHtmlHeadings(content);
  }

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
  if (!content) return content;

  if (isHtmlContent(content)) {
    return content.replace(/<h([1-6])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi, (_, level, attrs, innerContent) => {
      const rawText = innerContent.replace(/<[^>]+>/g, '').trim();
      const id = rawText
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const existingAttrs = attrs || '';
      if (/\bid\s*=/.test(existingAttrs)) {
        return `<h${level}${existingAttrs}>${innerContent}</h${level}>`;
      }
      return `<h${level} id="${id}"${existingAttrs}>${innerContent}</h${level}>`;
    });
  }

  return content.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, text) => {
    const id = text
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${hashes} ${text} {#${id}}`;
  });
}
