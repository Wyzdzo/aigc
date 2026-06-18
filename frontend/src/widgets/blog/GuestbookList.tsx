// src/widgets/blog/GuestbookList.tsx

import { useCallback, useMemo, useState } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import { Avatar, Empty, List, Space, Spin, Typography } from 'antd';

import type { BlogComment } from '@/entities/blog';

import { CommentForm } from './CommentForm';

const { Text } = Typography;

// UI Avatars 头像生成 URL
const getAvatarUrl = (nickname: string, email?: string): string => {
  const seed = email || nickname;
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0D8ABC,D1D5DB,FF6B6B,4ECDC4,F9CA24&fontFamily=Helvetica&fontSize=38`;
};

// 留言特殊 ID（用于标识留言板）
export const GUESTBOOK_POST_ID = 0;

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
 * 留言回复项组件
 */
function GuestbookReplyItem({
  comment,
  onReply,
}: {
  comment: BlogComment;
  onReply?: (parentId: number) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = useCallback(() => {
    onReply?.(comment.id);
    setShowReplyForm(!showReplyForm);
  }, [comment.id, onReply, showReplyForm]);

  return (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
      <Space align="start" size={12} style={{ width: '100%' }}>
        <Avatar
          src={getAvatarUrl(comment.nickname, comment.email || undefined)}
          size={36}
        />
        <div style={{ flex: 1 }}>
          <Space>
            <Text strong style={{ fontSize: 14 }}>{comment.nickname}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatRelativeTime(comment.createdAt)}
            </Text>
          </Space>
          <div style={{ marginTop: 'var(--spacing-xs)' }}>
            <Text style={{ lineHeight: 1.6, fontSize: 14 }}>{comment.content}</Text>
          </div>
          <div style={{ marginTop: 'var(--spacing-sm)' }}>
            <button
              type="button"
              className="text-gray-400 hover:text-blue-500 bg-transparent border-none cursor-pointer p-0 text-sm transition-colors"
              onClick={handleReply}
            >
              回复
            </button>
          </div>
          {showReplyForm && (
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <CommentForm
                postId={GUESTBOOK_POST_ID}
                parentId={comment.id}
                onSuccess={() => setShowReplyForm(false)}
                onCancel={() => setShowReplyForm(false)}
                placeholder={`回复 @${comment.nickname}...`}
                showCancel
                compact
              />
            </div>
          )}
        </div>
      </Space>
    </div>
  );
}

/**
 * 留言列表项组件
 */
function GuestbookItem({
  comment,
  replies,
  onReply,
}: {
  comment: BlogComment;
  replies: BlogComment[];
  onReply?: (parentId: number) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = useCallback(() => {
    onReply?.(comment.id);
    setShowReplyForm(!showReplyForm);
  }, [comment.id, onReply, showReplyForm]);

  return (
    <List.Item
      key={comment.id}
      style={{ padding: '20px 0', borderBottom: '1px solid var(--color-border)' }}
    >
      <div style={{ width: '100%' }}>
        <Space align="start" size={12} style={{ width: '100%' }}>
          <Avatar
            src={getAvatarUrl(comment.nickname, comment.email || undefined)}
            size={48}
          />
          <div style={{ flex: 1 }}>
            <Space>
              <Text strong>{comment.nickname}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatRelativeTime(comment.createdAt)}
              </Text>
            </Space>
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <Text style={{ lineHeight: 1.8 }}>{comment.content}</Text>
            </div>
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <button
                type="button"
                className="text-gray-400 hover:text-blue-500 bg-transparent border-none cursor-pointer p-0 text-sm transition-colors"
                onClick={handleReply}
              >
                回复
              </button>
            </div>
          </div>
        </Space>

        {/* 回复表单 */}
        {showReplyForm && (
          <div style={{ marginTop: 'var(--spacing-lg)', paddingLeft: 'var(--spacing-xl)' }}>
            <CommentForm
              postId={GUESTBOOK_POST_ID}
              parentId={comment.id}
              onSuccess={() => setShowReplyForm(false)}
              onCancel={() => setShowReplyForm(false)}
              placeholder={`回复 @${comment.nickname}...`}
              showCancel
              compact
            />
          </div>
        )}

        {/* 子回复列表 */}
        {replies.length > 0 && (
          <div style={{ marginTop: 'var(--spacing-lg)', paddingLeft: 'var(--spacing-xl)' }}>
            {replies.map((reply) => (
              <GuestbookReplyItem key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </List.Item>
  );
}

/**
 * 留言列表组件
 */
export function GuestbookList({
  comments,
  loading,
  onReply,
}: {
  comments: BlogComment[];
  loading?: boolean;
  onReply?: (parentId: number) => void;
}) {
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

    // 按时间排序（新的在前）
    roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    children.forEach((items) => {
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    return { rootComments: roots, childCommentsMap: children };
  }, [comments]);

  // 获取没有对应父评论的子评论（孤儿评论）
  const orphanComments = useMemo(() => {
    return comments.filter(
      (comment) => comment.parentId !== null && !comments.some((c) => c.id === comment.parentId)
    );
  }, [comments]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <Empty
        image={<MessageOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
        description="暂无留言，快来写下第一条留言吧~"
        style={{ margin: '60px 0' }}
      />
    );
  }

  return (
    <div>
      <List
        dataSource={rootComments}
        renderItem={(comment) => {
          const replies = childCommentsMap.get(comment.id) || [];
          return (
            <GuestbookItem
              key={comment.id}
              comment={comment}
              replies={replies}
              onReply={onReply}
            />
          );
        }}
        locale={{
          emptyText: '暂无留言',
        }}
      />
      {orphanComments.length > 0 && (
        <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
          {orphanComments.map((comment) => (
            <GuestbookReplyItem key={comment.id} comment={comment} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}
