import { useCallback, useMemo, useState } from 'react';
import { Avatar, Empty, List, Space, Spin, Typography } from 'antd';

import type { BlogComment } from '@/entities/blog';

import { CommentForm } from './CommentForm';

const { Text } = Typography;

export interface CommentListProps {
  comments: BlogComment[];
  loading?: boolean;
  postId: number;
  onReply?: (parentId: number) => void;
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
 * 评论列表项组件
 */
function CommentItem({
  comment,
  postId,
  onReply,
  isChild = false,
}: {
  comment: BlogComment;
  postId: number;
  onReply?: (parentId: number) => void;
  isChild?: boolean;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = useCallback(() => {
    onReply?.(comment.id);
    setShowReplyForm(!showReplyForm);
  }, [comment.id, onReply, showReplyForm]);

  return (
    <div style={{ paddingLeft: isChild ? 48 : 0 }}>
      <Space align="start" size={12} style={{ width: '100%' }}>
        <Avatar src={comment.avatar || undefined} size={isChild ? 32 : 40}>
          {comment.nickname.charAt(0).toUpperCase()}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Space>
            <Text strong>{comment.nickname}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatRelativeTime(comment.createdAt)}
            </Text>
          </Space>
          <div style={{ marginTop: 4 }}>
            <Text>{comment.content}</Text>
          </div>
          {!isChild && (
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                className="text-gray-400 hover:text-blue-500 bg-transparent border-none cursor-pointer p-0 text-sm"
                onClick={handleReply}
              >
                回复
              </button>
            </div>
          )}
          {showReplyForm && (
            <div style={{ marginTop: 12 }}>
              <CommentForm
                postId={postId}
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
 * 评论列表组件
 */
export function CommentList({ comments, loading, postId, onReply }: CommentListProps) {
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
        <Spin />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <Empty description="暂无评论，快来抢沙发吧~" style={{ margin: '40px 0' }} />
    );
  }

  return (
    <div>
      <List
        dataSource={rootComments}
        renderItem={(comment) => {
          const children = childCommentsMap.get(comment.id) || [];
          return (
            <List.Item key={comment.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: '100%' }}>
                <CommentItem comment={comment} postId={postId} onReply={onReply} />
                {children.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    {children.map((child) => (
                      <div key={child.id} style={{ marginBottom: 12 }}>
                        <CommentItem comment={child} postId={postId} isChild />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </List.Item>
          );
        }}
      />
      {orphanComments.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
          {orphanComments.map((comment) => (
            <div key={comment.id} style={{ marginBottom: 12 }}>
              <CommentItem comment={comment} postId={postId} isChild />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
