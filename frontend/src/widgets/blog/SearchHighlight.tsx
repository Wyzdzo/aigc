// src/widgets/blog/SearchHighlight.tsx

/**
 * 搜索结果高亮组件属性
 */
export interface SearchHighlightProps {
  /**
   * 原始文本
   */
  text: string;

  /**
   * 搜索关键词
   */
  keyword: string;

  /**
   * 高亮样式类名
   */
  highlightClassName?: string;
}

/**
 * 搜索结果高亮组件
 *
 * 将匹配的关键词高亮显示
 */
export function SearchHighlight({
  text,
  keyword,
  highlightClassName = 'bg-yellow-100 text-yellow-900 px-0.5 rounded',
}: SearchHighlightProps) {
  if (!keyword || !text) {
    return <span>{text}</span>;
  }

  // 转义正则特殊字符
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 创建正则表达式（不区分大小写）
  const regex = new RegExp(`(${escapedKeyword})`, 'gi');

  // 分割文本
  const parts = text.split(regex);

  // 如果没有匹配，返回原始文本
  if (parts.length === 1) {
    return <span>{text}</span>;
  }

  // 渲染高亮文本
  return (
    <span>
      {parts.map((part, index) => {
        // 检查是否是匹配的关键词
        const isMatch = part.toLowerCase() === keyword.toLowerCase();

        if (isMatch) {
          return (
            <mark key={index} className={highlightClassName}>
              {part}
            </mark>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

export default SearchHighlight;