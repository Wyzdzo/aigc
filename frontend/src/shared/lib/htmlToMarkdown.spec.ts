// src/shared/lib/htmlToMarkdown.spec.ts

import { describe, it, expect } from 'vitest';
import { htmlToMarkdown } from './htmlToMarkdown';

describe('htmlToMarkdown', () => {
  describe('Happy Path', () => {
    it('should convert HTML headings to Markdown', () => {
      const result = htmlToMarkdown('<h1>Title</h1><h2>Subtitle</h2>');
      expect(result).toContain('# Title');
      expect(result).toContain('## Subtitle');
    });

    it('should convert HTML paragraphs to Markdown', () => {
      const result = htmlToMarkdown('<p>Hello world</p>');
      expect(result).toContain('Hello world');
    });

    it('should convert HTML bold to Markdown', () => {
      const result = htmlToMarkdown('<strong>bold</strong>');
      expect(result).toContain('**bold**');
    });

    it('should convert HTML italic to Markdown', () => {
      const result = htmlToMarkdown('<em>italic</em>');
      expect(result).toContain('italic');
      expect(result).toMatch(/[*_]italic[*_]/);
    });

    it('should convert HTML code blocks to Markdown', () => {
      const result = htmlToMarkdown('<pre><code>const x = 1;</code></pre>');
      expect(result).toContain('```');
      expect(result).toContain('const x = 1;');
    });

    it('should convert HTML lists to Markdown', () => {
      const result = htmlToMarkdown('<ul><li>item 1</li><li>item 2</li></ul>');
      expect(result).toContain('item 1');
      expect(result).toContain('item 2');
    });

    it('should convert HTML blockquote to Markdown', () => {
      const result = htmlToMarkdown('<blockquote>quote text</blockquote>');
      expect(result).toContain('quote text');
    });

    it('should return Markdown content as-is', () => {
      const md = '# Title\n\nSome **bold** text\n- list item';
      const result = htmlToMarkdown(md);
      expect(result).toBe(md);
    });

    it('should handle mixed HTML content', () => {
      const html = '<h1>Title</h1><p>Paragraph with <strong>bold</strong> and <em>italic</em></p>';
      const result = htmlToMarkdown(html);
      expect(result).toContain('# Title');
      expect(result).toContain('**bold**');
      expect(result).toContain('italic');
    });
  });

  describe('Error Path', () => {
    it('should return empty string for empty input', () => {
      expect(htmlToMarkdown('')).toBe('');
    });

    it('should return empty string for whitespace-only input', () => {
      expect(htmlToMarkdown('   ')).toBe('   ');
    });

    it('should return plain text as-is', () => {
      const plain = 'Just some plain text without any HTML tags';
      const result = htmlToMarkdown(plain);
      expect(result).toBe(plain);
    });

    it('should return original content if conversion fails', () => {
      // Malformed HTML that might cause turndown to throw
      const result = htmlToMarkdown('<div>unclosed');
      expect(result).toContain('unclosed');
    });
  });
});
