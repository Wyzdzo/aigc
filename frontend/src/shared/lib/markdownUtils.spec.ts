import { describe, it, expect } from 'vitest';
import { extractToc, addHeadingIds } from './markdownUtils';

describe('extractToc', () => {
  describe('Markdown format', () => {
    it('should extract headings with correct levels', () => {
      const content = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
      const toc = extractToc(content);

      expect(toc).toHaveLength(6);
      expect(toc[0]).toEqual({ id: 'h1', text: 'H1', level: 1 });
      expect(toc[1]).toEqual({ id: 'h2', text: 'H2', level: 2 });
      expect(toc[2]).toEqual({ id: 'h3', text: 'H3', level: 3 });
      expect(toc[3]).toEqual({ id: 'h4', text: 'H4', level: 4 });
      expect(toc[4]).toEqual({ id: 'h5', text: 'H5', level: 5 });
      expect(toc[5]).toEqual({ id: 'h6', text: 'H6', level: 6 });
    });

    it('should generate id from text', () => {
      const content = '# Hello World\n## Foo Bar Baz';
      const toc = extractToc(content);

      expect(toc[0].id).toBe('hello-world');
      expect(toc[1].id).toBe('foo-bar-baz');
    });

    it('should handle Chinese characters in id', () => {
      const content = '# 你好世界\n## 安装指南';
      const toc = extractToc(content);

      expect(toc[0].id).toBe('你好世界');
      expect(toc[1].id).toBe('安装指南');
    });

    it('should return empty array for no headings', () => {
      const content = 'Some text\nMore text\nNo headings here';
      const toc = extractToc(content);

      expect(toc).toEqual([]);
    });
  });

  describe('HTML format', () => {
    it('should extract headings from HTML content', () => {
      const content = '<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>';
      const toc = extractToc(content);

      expect(toc).toHaveLength(3);
      expect(toc[0]).toEqual({ id: 'title', text: 'Title', level: 1 });
      expect(toc[1]).toEqual({ id: 'subtitle', text: 'Subtitle', level: 2 });
      expect(toc[2]).toEqual({ id: 'section', text: 'Section', level: 3 });
    });

    it('should strip inner HTML tags from heading text', () => {
      const content = '<h2>Hello <strong>World</strong></h2>';
      const toc = extractToc(content);

      expect(toc[0].text).toBe('Hello World');
    });

    it('should return empty array for HTML without headings', () => {
      const content = '<p>Just a paragraph</p><div>Some div</div>';
      const toc = extractToc(content);

      expect(toc).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('should return empty array for empty string', () => {
      expect(extractToc('')).toEqual([]);
    });
  });
});

describe('addHeadingIds', () => {
  describe('Markdown format', () => {
    it('should add id anchors to headings', () => {
      const content = '# Title\n## Subtitle';
      const result = addHeadingIds(content);

      expect(result).toBe('# Title {#title}\n## Subtitle {#subtitle}');
    });

    it('should handle mixed content', () => {
      const content = '# Title\nSome paragraph\n## Subtitle\nMore text';
      const result = addHeadingIds(content);

      expect(result).toBe('# Title {#title}\nSome paragraph\n## Subtitle {#subtitle}\nMore text');
    });

    it('should not modify non-heading lines', () => {
      const content = 'Paragraph 1\nParagraph 2\nParagraph 3';
      const result = addHeadingIds(content);

      expect(result).toBe(content);
    });
  });

  describe('HTML format', () => {
    it('should add id attribute to HTML headings', () => {
      const content = '<h1>Title</h1><h2>Subtitle</h2>';
      const result = addHeadingIds(content);

      expect(result).toContain('id="title"');
      expect(result).toContain('id="subtitle"');
    });

    it('should not overwrite existing id attributes', () => {
      const content = '<h1 id="custom-id">Title</h1>';
      const result = addHeadingIds(content);

      expect(result).toContain('id="custom-id"');
      expect(result).not.toContain('id="title"');
    });

    it('should not modify non-heading HTML elements', () => {
      const content = '<p>Paragraph</p><div>Div</div>';
      const result = addHeadingIds(content);

      expect(result).toBe(content);
    });
  });

  describe('Edge cases', () => {
    it('should return empty string for empty input', () => {
      expect(addHeadingIds('')).toBe('');
    });
  });
});
