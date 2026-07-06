// src/widgets/blog/PostEditor.tsx

import { useEffect, useRef, useState } from 'react';

import { Button, Space, Tooltip } from 'antd';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BlockOutlined,
  BoldOutlined,
  CheckSquareOutlined,
  CodeOutlined,
  EyeOutlined,
  ItalicOutlined,
  LinkOutlined,
  MessageOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RedoOutlined,
  SaveOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';

export interface PostEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
  preview?: boolean;
  onSave?: () => void;
}

export function PostEditor({
  value,
  onChange,
  placeholder = '开始编写文章...',
  autoSave = true,
  autoSaveInterval = 3000,
  preview: initialPreview = false,
  onSave,
}: PostEditorProps) {
  const [preview, setPreview] = useState(initialPreview);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit.configure({
        heading: false,
        link: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    onUpdate: ({ editor }) => {
      if (editor.isDestroyed) return;
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed && value !== editor.getHTML()) {
      const timeoutId = setTimeout(() => {
        if (editor && !editor.isDestroyed && value !== editor.getHTML()) {
          editor.commands.setContent(value);
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [value, editor]);

  useEffect(() => {
    if (!autoSave || !onSave) return;

    const handleSave = () => {
      onSave();
      setLastSaved(new Date());
    };

    const interval = setInterval(() => {
      handleSave();
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, onSave]);

  const handleSave = () => {
    if (onSave) {
      onSave();
      setLastSaved(new Date());
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    }
  };

  const handleLinkInsert = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('输入链接地址', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImageInsert = () => {
    const url = window.prompt('输入图片地址');

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor || editor.isDestroyed) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-fill-tertiary px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Space wrap size="small">
            <Tooltip title="粗体">
              <Button
                type={editor.isActive('bold') ? 'primary' : 'default'}
                size="small"
                icon={<BoldOutlined />}
                onClick={() => editor.chain().focus().toggleBold().run()}
              />
            </Tooltip>
            <Tooltip title="斜体">
              <Button
                type={editor.isActive('italic') ? 'primary' : 'default'}
                size="small"
                icon={<ItalicOutlined />}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              />
            </Tooltip>
            <Tooltip title="下划线">
              <Button
                type={editor.isActive('underline') ? 'primary' : 'default'}
                size="small"
                icon={<UnderlineOutlined />}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              />
            </Tooltip>
            <Tooltip title="删除线">
              <Button
                type={editor.isActive('strike') ? 'primary' : 'default'}
                size="small"
                icon={<StrikethroughOutlined />}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              />
            </Tooltip>
            <Tooltip title="行内代码">
              <Button
                type={editor.isActive('code') ? 'primary' : 'default'}
                size="small"
                icon={<CodeOutlined />}
                onClick={() => editor.chain().focus().toggleCode().run()}
              />
            </Tooltip>

            <div className="w-px h-6 bg-border" />

            <Tooltip title="标题1">
              <Button
                type={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}
                size="small"
                icon={<AlignLeftOutlined />}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              />
            </Tooltip>
            <Tooltip title="标题2">
              <Button
                type={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
                size="small"
                icon={<AlignCenterOutlined />}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              />
            </Tooltip>
            <Tooltip title="标题3">
              <Button
                type={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
                size="small"
                icon={<AlignRightOutlined />}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              />
            </Tooltip>

            <div className="w-px h-6 bg-border" />

            <Tooltip title="无序列表">
              <Button
                type={editor.isActive('bulletList') ? 'primary' : 'default'}
                size="small"
                icon={<UnorderedListOutlined />}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              />
            </Tooltip>
            <Tooltip title="有序列表">
              <Button
                type={editor.isActive('orderedList') ? 'primary' : 'default'}
                size="small"
                icon={<OrderedListOutlined />}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              />
            </Tooltip>
            <Tooltip title="待办事项">
              <Button
                type={editor.isActive('taskList') ? 'primary' : 'default'}
                size="small"
                icon={<CheckSquareOutlined />}
                onClick={() => editor.chain().focus().toggleTaskList().run()}
              />
            </Tooltip>

            <div className="w-px h-6 bg-border" />

            <Tooltip title="引用">
              <Button
                type={editor.isActive('blockquote') ? 'primary' : 'default'}
                size="small"
                icon={<MessageOutlined />}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              />
            </Tooltip>
            <Tooltip title="代码块">
              <Button
                type={editor.isActive('codeBlock') ? 'primary' : 'default'}
                size="small"
                icon={<BlockOutlined />}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              />
            </Tooltip>

            <div className="w-px h-6 bg-border" />

            <Tooltip title="插入链接">
              <Button
                type="default"
                size="small"
                icon={<LinkOutlined />}
                onClick={handleLinkInsert}
              />
            </Tooltip>
            <Tooltip title="插入图片">
              <Button
                type="default"
                size="small"
                icon={<PictureOutlined />}
                onClick={handleImageInsert}
              />
            </Tooltip>

            <div className="w-px h-6 bg-border" />

            <Tooltip title="撤销">
              <Button
                type="default"
                size="small"
                icon={<UndoOutlined />}
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              />
            </Tooltip>
            <Tooltip title="重做">
              <Button
                type="default"
                size="small"
                icon={<RedoOutlined />}
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              />
            </Tooltip>
          </Space>

          <Space size="small">
            <Button
              type={preview ? 'primary' : 'default'}
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setPreview(!preview)}
            >
              {preview ? '编辑' : '预览'}
            </Button>
            {onSave && (
              <Button
                type="primary"
                size="small"
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
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

      <div className="flex-1 overflow-auto">
        {preview ? (
          <div className="prose prose-lg max-w-none p-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {editor.getText()}
            </ReactMarkdown>
          </div>
        ) : (
          <EditorContent editor={editor} className="h-full p-6" />
        )}
      </div>
    </div>
  );
}