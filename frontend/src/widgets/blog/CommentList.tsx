// src/widgets/blog/CommentList.tsx

import { useCallback, useMemo, useState } from 'react';
import { Avatar, Empty, Spin, Typography } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';

import type { BlogComment } from '@/entities/blog';
import { useLikeComment } from '@/features/blog';

import { CommentForm } from './CommentForm';

const { Text, Paragraph } = Typography;

/** 最大嵌套层数，超过此深度后不再缩进 */
const MAX_NESTING_DEPTH = 4;

/** 每级嵌套的缩进像素值 */
const NESTING_INDENT = 20;

/** 线程线颜色（按深度循环） */
const THREAD_COLORS = [
  'var(--ant-color-border-secondary)',
  'var(--ant-color-primary-border)',
  'var(--ant-color-success-border)',
  'var(--ant-color-warning-border)',
  'var(--ant-color-info-border)',
];

export interface CommentListProps {
  comments: BlogComment[];
  loading?: boolean;
  postId: number;
}

/**
 * 格式化相对时间
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return '刚刚';
}

/**
 * 获取当前深度的线程线颜色
 */
function getThreadColor(depth: number): string {
  return THREAD_COLORS[depth % THREAD_COLORS.length];
}

/**
 * 评论项组件（递归，支持多级嵌套）
 */
export function CommentItem({
  comment,
  postId,
  childComments,
  depth = 0,
  onReplySuccess,
}: {
  comment: BlogComment;
  postId: number;
  childComments: Map<number, BlogComment[]>;
  depth?: number;
  onReplySuccess?: () => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const { likeComment, loading: likeLoading } = useLikeComment();

  const handleReply = useCallback(() => {
    setShowReplyForm((prev) => !prev);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const handleLike = useCallback(async () => {
    if (liked || likeLoading) return;
    const result = await likeComment(comment.id);
    if (result === 'success') {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  }, [liked, likeLoading, likeComment, comment.id]);

  // 解析评论内容中的图片 URL（Markdown 图片语法: ![alt](url)）
  const renderContent = useCallback((content: string) => {
    const parts: React.ReactNode[] = [];
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = imgRegex.exec(content)) !== null) {
      // 图片前的文本
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      // 图片
      parts.push(
        <img
          key={key++}
          src={match[2]}
          alt={match[1]}
          className="max-w-full max-h-[200px] rounded-lg mt-1 mb-1"
        />,
      );
      lastIndex = match.index + match[0].length;
    }
    // 剩余文本
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }
    return parts.length > 0 ? parts : content;
  }, []);

  const isNested = depth > 0;
  const children = childComments.get(comment.id) || [];
  const childDepth = Math.min(depth + 1, MAX_NESTING_DEPTH);
  const indentPx = isNested ? depth * NESTING_INDENT : 0;
  const threadColor = getThreadColor(depth);

  return (
    <div
      className="group relative"
      style={isNested ? { marginLeft: indentPx } : undefined}
    >
      {/* 线程连接线 */}
      {isNested && (
        <div
          className="absolute top-0 bottom-0 rounded-full"
          style={{
            left: -12,
            width: 2,
            backgroundColor: threadColor,
            opacity: 0.6,
          }}
        />
      )}

      {/* 评论主体 */}
      <div className="rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-bg-text-hover">
        {/* 头部：头像 + 信息 */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <Avatar
              src={comment.avatar || undefined}
              size={isNested ? 30 : 36}
              style={
                isNested
                  ? { backgroundColor: 'var(--ant-color-primary-bg)' }
                  : { backgroundColor: 'var(--ant-color-primary)' }
              }
            >
              {comment.nickname.charAt(0).toUpperCase()}
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            {/* 昵称 + 时间 */}
            <div className="flex items-baseline gap-2">
              <Text
                strong
                style={isNested ? { fontSize: 13 } : undefined}
              >
                {comment.nickname}
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: 12 }}
              >
                {formatRelativeTime(comment.createdAt)}
              </Text>
            </div>

            {/* 评论内容 */}
            <div className="mt-1.5">
              <Paragraph
                style={{
                  marginBottom: 0,
                  fontSize: isNested ? 13 : 14,
                  lineHeight: 1.7,
                }}
              >
                {renderContent(comment.content)}
              </Paragraph>
            </div>

            {/* 操作栏 */}
            <div className="flex items-center gap-3 mt-1.5">
              <button
                type="button"
                className="bg-transparent border-none cursor-pointer p-0 text-sm transition-colors duration-200"
                style={{ color: 'var(--ant-color-text-tertiary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--ant-color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--ant-color-text-tertiary)';
                }}
                onClick={handleReply}
              >
                {showReplyForm ? '收起回复' : '回复'}
              </button>
              <button
                type="button"
                className="bg-transparent border-none cursor-pointer p-0 text-sm transition-colors duration-200 flex items-center gap-1"
                style={{ color: liked ? 'var(--ant-color-primary)' : 'var(--ant-color-text-tertiary)' }}
                onClick={handleLike}
                disabled={likeLoading}
              >
                {liked ? <LikeFilled /> : <LikeOutlined />}
                {likeCount > 0 && <span>{likeCount}</span>}
              </button>
              {children.length > 0 && (
                <button
                  type="button"
                  className="bg-transparent border-none cursor-pointer p-0 text-sm transition-colors duration-200"
                  style={{ color: 'var(--ant-color-text-quaternary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--ant-color-text-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--ant-color-text-quaternary)';
                  }}
                  onClick={handleToggleCollapse}
                >
                  {collapsed ? `展开 ${children.length} 条回复` : '收起'}
                </button>
              )}
            </div>

            {/* 回复表单 */}
            {showReplyForm && (
              <div className="mt-3">
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  onSuccess={() => {
                    setShowReplyForm(false);
                    onReplySuccess?.();
                  }}
                  onCancel={() => setShowReplyForm(false)}
                  placeholder={`回复 @${comment.nickname}...`}
                  showCancel
                  compact
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 递归渲染子评论 */}
      {children.length > 0 && !collapsed && (
        <div className="mt-0.5">
          {children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              postId={postId}
              childComments={childComments}
              depth={childDepth}
              onReplySuccess={onReplySuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 评论列表组件
 */
export function CommentList({ comments, loading, postId }: CommentListProps) {
  // 按 parentId 分组，构建树形结构
  const { rootComments, childCommentsMap } = useMemo(() => {
    const roots: BlogComment[] = [];
    const children: Map<number, BlogComment[]> = new Map();

    comments.forEach((comment) => {
      if (comment.parentId === null) {
        roots.push(comment);
      } else {
        const existing = children.get(comment.parentId) || [];
        existing.push(comment);
        children.set(comment.parentId, existing);
      }
    });

    // 按时间排序（根评论新的在前，子评论旧的在前）
    roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    children.forEach((items) => {
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    return { rootComments: roots, childCommentsMap: children };
  }, [comments]);

  // 获取没有对应父评论的子评论（孤儿评论）
  const orphanComments = useMemo(() => {
    return comments.filter(
      (comment) => comment.parentId !== null && !comments.some((c) => c.id === comment.parentId),
    );
  }, [comments]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <Spin />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="my-10">
        <Empty description="暂无评论，快来抢沙发吧~" />
      </div>
    );
  }

  return (
    <div>
      {rootComments.map((comment) => (
        <div
          key={comment.id}
          style={{
            padding: '8px 0',
            borderBottom: '1px solid var(--ant-color-border-secondary)',
          }}
        >
          <div className="w-full">
            <CommentItem
              comment={comment}
              postId={postId}
              childComments={childCommentsMap}
              depth={0}
            />
          </div>
        </div>
      ))}
      {orphanComments.length > 0 && (
        <div
          className="mt-4 pt-4"
          style={{ borderTop: '1px solid var(--ant-color-border-secondary)' }}
        >
          {orphanComments.map((comment) => (
            <div key={comment.id} className="mb-2">
              <CommentItem
                comment={comment}
                postId={postId}
                childComments={childCommentsMap}
                depth={1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
