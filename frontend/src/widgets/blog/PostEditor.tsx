// src/widgets/blog/PostEditor.tsx

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, Select, Space, Tooltip, message } from 'antd';
import {
  BoldOutlined,
  CodeOutlined,
  EditOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  SaveOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import { Markdown } from '@/shared/blog/markdown';

export interface PostEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
  preview?: boolean;
  onSave?: () => void;
}

type ViewMode = 'edit' | 'preview' | 'split';

/**
 * Markdown 源码语法高亮
 * 返回 HTML 字符串，各种语法元素用 <span> 包裹并指定颜色 class
 */
function highlightMarkdown(source: string): string {
  // 先转义 HTML 特殊字符
  let html = source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 代码块（```...```）— 最先处理，避免内部被其他规则干扰
  html = html.replace(/(```[\s\S]*?```)/g, '<span class="md-code-block">$1</span>');

  // 行内代码
  html = html.replace(/(`[^`\n]+`)/g, '<span class="md-inline-code">$1</span>');

  // 标题（# 开头）
  html = html.replace(/^(#{1,6}\s.*)$/gm, '<span class="md-heading">$1</span>');

  // 粗体 **text** 或 __text__
  html = html.replace(/(\*\*|__)(?=\S)(.+?)(?<=\S)\1/g, '<span class="md-bold">$1$2$1</span>');

  // 斜体 *text* 或 _text_（不匹配粗体中的星号）
  html = html.replace(/(?<!\*)(\*)(?=\S)(.+?)(?<=\S)\1(?!\*)/g, '<span class="md-italic">$1$2$1</span>');

  // 删除线 ~~text~~
  html = html.replace(/(~~)(?=\S)(.+?)(?<=\S)\1/g, '<span class="md-strike">$1$2$1</span>');

  // 链接 [text](url)
  html = html.replace(/(\[)([^\]]+)(\]\()([^\)]+)(\))/g,
    '<span class="md-link-bracket">$1</span><span class="md-link-text">$2</span><span class="md-link-bracket">$3</span><span class="md-link-url">$4</span><span class="md-link-bracket">$5</span>');

  // 图片 ![alt](url)
  html = html.replace(/(!\[)([^\]]+)(\]\()([^\)]+)(\))/g,
    '<span class="md-img-marker">$1</span><span class="md-link-text">$2</span><span class="md-link-bracket">$3</span><span class="md-link-url">$4</span><span class="md-link-bracket">$5</span>');

  // 引用 > text
  html = html.replace(/^(&gt;\s.*)$/gm, '<span class="md-blockquote">$1</span>');

  // 列表标记 - / * / 1. 等
  html = html.replace(/^(\s*)([-*]|\d+\.)\s/gm, '$1<span class="md-list-marker">$2</span> ');

  // 水平线 --- / *** / ___
  html = html.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '<span class="md-hr">$1</span>');

  // 末尾换行确保高度一致
  if (html.endsWith('\n')) {
    html += ' ';
  }

  return html;
}

export function PostEditor({
  value,
  onChange,
  placeholder = '开始编写 Markdown 文章...',
  autoSave = true,
  autoSaveInterval = 3000,
  onSave,
}: PostEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef(false);

  // 语法高亮 HTML
  const highlightedHtml = useMemo(() => highlightMarkdown(value), [value]);

  // 自动保存
  useEffect(() => {
    if (!autoSave || !onSave) return;

    const interval = setInterval(() => {
      onSave();
      setLastSaved(new Date());
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, onSave]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave();
      setLastSaved(new Date());
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    }
  }, [onSave]);

  // 滚动同步：textarea ↔ 高亮层 ↔ 预览
  const handleEditorScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    const preview = previewRef.current;
    if (!textarea) return;

    // 同步高亮层滚动
    if (highlight) {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    }

    // 同步预览区滚动（按比例）
    if (preview && viewMode === 'split') {
      if (isSyncingScroll.current) return;
      isSyncingScroll.current = true;
      const scrollRatio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight || 1);
      preview.scrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);
      requestAnimationFrame(() => { isSyncingScroll.current = false; });
    }
  }, [viewMode]);

  const handlePreviewScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const preview = previewRef.current;
    if (!textarea || !preview || viewMode !== 'split') return;

    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    const scrollRatio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight || 1);
    textarea.scrollTop = scrollRatio * (textarea.scrollHeight - textarea.clientHeight);
    if (highlightRef.current) {
      highlightRef.current.scrollTop = textarea.scrollTop;
    }
    requestAnimationFrame(() => { isSyncingScroll.current = false; });
  }, [viewMode]);

  // 在选中文字前后包裹语法
  const wrapSelection = useCallback(
    (before: string, after: string, placeholderText: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd } = textarea;
      const selectedText = value.slice(selectionStart, selectionEnd);
      const insertText = selectedText || placeholderText;
      const newValue =
        value.slice(0, selectionStart) + before + insertText + after + value.slice(selectionEnd);

      onChange(newValue);

      requestAnimationFrame(() => {
        textarea.focus();
        const newStart = selectionStart + before.length;
        textarea.selectionStart = newStart;
        textarea.selectionEnd = newStart + insertText.length;
      });
    },
    [value, onChange],
  );

  // 在行首插入语法
  const insertAtLineStart = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart } = textarea;
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);

      onChange(newValue);

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.selectionStart = selectionStart + prefix.length;
        textarea.selectionEnd = selectionStart + prefix.length;
      });
    },
    [value, onChange],
  );

  // 插入链接
  const insertLink = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = value.slice(selectionStart, selectionEnd);
    const linkText = selectedText || '链接文字';
    const newValue =
      value.slice(0, selectionStart) + `[${linkText}](url)` + value.slice(selectionEnd);

    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const urlStart = selectionStart + linkText.length + 3;
      textarea.selectionStart = urlStart;
      textarea.selectionEnd = urlStart + 3;
    });
  }, [value, onChange]);

  // 插入图片
  const insertImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          const url = result.data?.url;
          if (url) {
            const textarea = textareaRef.current;
            if (!textarea) return;
            const { selectionStart } = textarea;
            const imgMd = `![${file.name}](${url})`;
            const newValue = value.slice(0, selectionStart) + imgMd + value.slice(selectionStart);
            onChange(newValue);
          } else {
            message.error('上传失败');
          }
        } else {
          message.error('上传失败');
        }
      } catch {
        message.error('上传失败');
      }
    };
    input.click();
  }, [value, onChange]);

  // 快捷键
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const isMod = e.ctrlKey || e.metaKey;

      if (isMod && e.key === 's') {
        e.preventDefault();
        handleSave();
        return;
      }

      if (isMod && e.key === 'b') {
        e.preventDefault();
        wrapSelection('**', '**', '粗体');
        return;
      }

      if (isMod && e.key === 'i') {
        e.preventDefault();
        wrapSelection('*', '*', '斜体');
        return;
      }

      if (isMod && e.key === 'k') {
        e.preventDefault();
        insertLink();
        return;
      }

      // Tab 缩进
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;
        const { selectionStart, selectionEnd } = textarea;
        const newValue = value.slice(0, selectionStart) + '  ' + value.slice(selectionEnd);
        onChange(newValue);
        requestAnimationFrame(() => {
          textarea.selectionStart = selectionStart + 2;
          textarea.selectionEnd = selectionStart + 2;
        });
      }
    },
    [handleSave, wrapSelection, insertLink, value, onChange],
  );

  const viewModeOptions = [
    { value: 'edit', label: '编辑' },
    { value: 'split', label: '分栏' },
    { value: 'preview', label: '预览' },
  ];

  // 编辑器区域的公共样式常量
  const editorFontClass = 'font-mono text-sm leading-relaxed p-4';

  return (
    <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden" style={{ background: 'var(--ant-color-bg-container)' }}>
      {/* 工具栏 */}
      <div className="border-b border-border px-4 py-2" style={{ background: 'var(--ant-color-fill-quaternary)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Space wrap size="small">
            <Tooltip title="粗体 (Ctrl+B)">
              <Button size="small" icon={<BoldOutlined />} onClick={() => wrapSelection('**', '**', '粗体')} />
            </Tooltip>
            <Tooltip title="斜体 (Ctrl+I)">
              <Button size="small" icon={<ItalicOutlined />} onClick={() => wrapSelection('*', '*', '斜体')} />
            </Tooltip>
            <Tooltip title="删除线">
              <Button size="small" icon={<StrikethroughOutlined />} onClick={() => wrapSelection('~~', '~~', '删除线')} />
            </Tooltip>
            <Tooltip title="行内代码">
              <Button size="small" icon={<CodeOutlined />} onClick={() => wrapSelection('`', '`', 'code')} />
            </Tooltip>

            <div className="w-px h-6 bg-border" />

            <Tooltip title="一级标题">
              <Button size="small" onClick={() => insertAtLineStart('# ')}>H1</Button>
            </Tooltip>
            <Tooltip title="二级标题">
              <Button size="small" onClick={() => insertAtLineStart('## ')}>H2</Button>
            </Tooltip>
            <Tooltip title="三级标题">
              <Button size="small" onClick={() => insertAtLineStart('### ')}>H3</Button>
            </Tooltip>

            <div className="w-px h-6 bg-border" />

            <Tooltip title="无序列表">
              <Button size="small" icon={<UnorderedListOutlined />} onClick={() => insertAtLineStart('- ')} />
            </Tooltip>
            <Tooltip title="有序列表">
              <Button size="small" icon={<OrderedListOutlined />} onClick={() => insertAtLineStart('1. ')} />
            </Tooltip>

            <div className="w-px h-6 bg-border" />

            <Tooltip title="引用">
              <Button size="small" onClick={() => insertAtLineStart('> ')}>{'>'}</Button>
            </Tooltip>
            <Tooltip title="代码块">
              <Button size="small" onClick={() => wrapSelection('\n```\n', '\n```\n', 'code')}>{'{ }'}</Button>
            </Tooltip>

            <div className="w-px h-6 bg-border" />

            <Tooltip title="插入链接 (Ctrl+K)">
              <Button size="small" icon={<LinkOutlined />} onClick={insertLink} />
            </Tooltip>
            <Tooltip title="上传图片">
              <Button size="small" icon={<PictureOutlined />} onClick={insertImage} />
            </Tooltip>
          </Space>

          <Space size="small">
            <Select size="small" value={viewMode} onChange={setViewMode} options={viewModeOptions} style={{ width: 80 }} />
            {onSave && (
              <Button type="primary" size="small" icon={<SaveOutlined />} onClick={handleSave}>
                保存
              </Button>
            )}
            {lastSaved && (
              <span className="text-xs text-text-tertiary">
                上次保存: {lastSaved.toLocaleTimeString('zh-CN')}
              </span>
            )}
          </Space>
        </div>
      </div>

      {/* 编辑区 */}
      <div className="flex-1 flex min-h-0">
        {/* 源码编辑（带语法高亮叠加层） */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`flex flex-col relative ${viewMode === 'split' ? 'w-1/2 border-r border-border' : 'flex-1'}`}>
            <div className="flex-1 relative overflow-hidden">
              {/* 高亮叠加层 */}
              <pre
                ref={highlightRef}
                className={`absolute inset-0 m-0 overflow-hidden whitespace-pre-wrap break-words pointer-events-none ${editorFontClass}`}
                style={{ background: 'var(--ant-color-bg-container)', color: 'var(--ant-color-text)', border: 'none', zIndex: 0 }}
                aria-hidden="true"
              >
                <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
              </pre>
              {/* 实际编辑 textarea（透明文字，高亮层显示颜色） */}
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={handleEditorScroll}
                placeholder={placeholder}
                className={`absolute inset-0 resize-none outline-none caret-text ${editorFontClass}`}
                style={{ background: 'transparent', color: 'transparent', zIndex: 1, WebkitTextFillColor: 'transparent' }}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>
        )}

        {/* 实时预览 */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2' : 'flex-1'}`}>
            <div
              ref={previewRef}
              className="md-editor-preview flex-1 overflow-auto p-4"
              onScroll={handlePreviewScroll}
            >
              {value.trim() ? (
                <Markdown content={value} />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
