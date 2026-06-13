// src/shared/blog/markdown.spec.ts

import { describe, expect, it } from 'vitest';

import { addHeadingIds, extractToc } from '@/shared/lib/markdownUtils';

describe('markdown utilities', () => {
  describe('extractToc', () => {
    describe('Happy Path', () => {
      it('should extract h1 heading', () => {
        const content = '# 标题一';
        const result = extractToc(content);

        expect(result).toEqual([{ id: '标题一', text: '标题一', level: 1 }]);
      });

      it('should extract multiple headings', () => {
        const content = `# 标题一\n## 标题二\n### 标题三`;
        const result = extractToc(content);

        expect(result).toEqual([
          { id: '标题一', text: '标题一', level: 1 },
          { id: '标题二', text: '标题二', level: 2 },
          { id: '标题三', text: '标题三', level: 3 },
        ]);
      });

      it('should extract English headings', () => {
        const content = `# Hello World\n## Getting Started`;
        const result = extractToc(content);

        expect(result).toEqual([
          { id: 'hello-world', text: 'Hello World', level: 1 },
          { id: 'getting-started', text: 'Getting Started', level: 2 },
        ]);
      });

      it('should extract mixed Chinese and English headings', () => {
        const content = `# React 入门\n## 什么是 React\n### useState Hook`;
        const result = extractToc(content);

        expect(result).toEqual([
          { id: 'react-入门', text: 'React 入门', level: 1 },
          { id: '什么是-react', text: '什么是 React', level: 2 },
          { id: 'usestate-hook', text: 'useState Hook', level: 3 },
        ]);
      });

      it('should handle headings with special characters', () => {
        const content = `# 测试 (1)\n## 特殊!@#$%字符`;
        const result = extractToc(content);

        expect(result).toEqual([
          { id: '测试-1', text: '测试 (1)', level: 1 },
          { id: '特殊-字符', text: '特殊!@#$%字符', level: 2 },
        ]);
      });
    });

    describe('Error Path', () => {
      it('should return empty array for empty content', () => {
        const result = extractToc('');
        expect(result).toEqual([]);
      });

      it('should return empty array for content without headings', () => {
        const content = `这是一段普通文本\n没有标题`;
        const result = extractToc(content);
        expect(result).toEqual([]);
      });

      it('should handle undefined content', () => {
        const result = extractToc(undefined as unknown as string);
        expect(result).toEqual([]);
      });

      it('should handle null content', () => {
        const result = extractToc(null as unknown as string);
        expect(result).toEqual([]);
      });
    });

    describe('Edge Cases', () => {
      it('should handle h6 headings', () => {
        const content = `###### 六级标题`;
        const result = extractToc(content);

        expect(result).toEqual([{ id: '六级标题', text: '六级标题', level: 6 }]);
      });

      it('should handle headings with leading/trailing spaces', () => {
        const content = `#   带空格的标题   `;
        const result = extractToc(content);

        expect(result).toEqual([{ id: '带空格的标题', text: '带空格的标题', level: 1 }]);
      });

      it('should handle duplicate headings', () => {
        const content = `# 相同标题\n## 相同标题`;
        const result = extractToc(content);

        expect(result).toEqual([
          { id: '相同标题', text: '相同标题', level: 1 },
          { id: '相同标题', text: '相同标题', level: 2 },
        ]);
      });

      it('should extract headings even inside code blocks (current behavior)', () => {
        const content = `\`\`\`\n# 这是代码中的标题\n\`\`\`\n\n# 真正的标题`;
        const result = extractToc(content);

        expect(result).toEqual([
          { id: '这是代码中的标题', text: '这是代码中的标题', level: 1 },
          { id: '真正的标题', text: '真正的标题', level: 1 },
        ]);
      });

      it('should not extract headings inside inline code', () => {
        const content = `\`# 这是内联代码\`\n\n# 真正的标题`;
        const result = extractToc(content);

        expect(result).toEqual([{ id: '真正的标题', text: '真正的标题', level: 1 }]);
      });
    });
  });

  describe('addHeadingIds', () => {
    describe('Happy Path', () => {
      it('should add id to heading', () => {
        const content = '# 标题一';
        const result = addHeadingIds(content);

        expect(result).toBe('# 标题一 {#标题一}');
      });

      it('should add ids to multiple headings', () => {
        const content = `# 标题一\n## 标题二`;
        const result = addHeadingIds(content);

        expect(result).toBe('# 标题一 {#标题一}\n## 标题二 {#标题二}');
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty content', () => {
        const result = addHeadingIds('');
        expect(result).toBe('');
      });

      it('should handle content without headings', () => {
        const content = '普通文本';
        const result = addHeadingIds(content);
        expect(result).toBe('普通文本');
      });
    });
  });
});