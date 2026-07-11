// src/shared/lib/htmlToMarkdown.ts

import TurndownService from 'turndown';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// 自定义规则：保留任务列表
turndown.addRule('taskListItems', {
  filter: (node) => {
    return node.nodeName === 'LI' && node.getAttribute('data-type') === 'taskItem';
  },
  replacement: (content, node) => {
    const checkbox = node.querySelector('input[type="checkbox"]');
    const checked = checkbox ? checkbox.hasAttribute('checked') : false;
    return `- [${checked ? 'x' : ' '}] ${content.trim()}\n`;
  },
});

/**
 * 将 HTML 内容转换为 Markdown
 * 如果内容已经是 Markdown 格式，则原样返回
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';

  // 检测是否已经是 Markdown 格式（不是以 HTML 标签开头）
  const trimmed = html.trim();
  if (!/^\s*<[a-zA-Z]/.test(trimmed) && !/<\/(h[1-6]|p|div|ul|ol|li|blockquote|pre|code|strong|em|span)>/.test(trimmed)) {
    return html;
  }

  try {
    return turndown.turndown(html);
  } catch {
    // 转换失败则返回原始内容
    return html;
  }
}
