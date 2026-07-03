import { describe, it, expect } from 'vitest';
import { extractToc, addHeadingIds } from './markdownUtils';

describe('extractToc', () => {
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

describe('addHeadingIds', () => {
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
