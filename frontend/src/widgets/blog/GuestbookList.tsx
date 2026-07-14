// src/widgets/blog/GuestbookList.tsx

import { useMemo } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import { Empty, List, Spin } from 'antd';

import type { BlogComment } from '@/entities/blog';

import { CommentItem } from './CommentList';

// 留言特殊 ID（用于标识留言板）
export const GUESTBOOK_POST_ID = 0;

/**
 * 留言列表组件
 */
export function GuestbookList({
  comments,
  loading,
  onReplySuccess,
}: {
  comments: BlogComment[];
  loading?: boolean;
  onReplySuccess?: () => void;
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
      (comment) => comment.parentId !== null && !comments.some((c) => c.id === comment.parentId)
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
        <Empty
          image={<MessageOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
          description="暂无留言，快来写下第一条留言吧~"
        />
      </div>
    );
  }

  return (
    <div>
      <List
        dataSource={rootComments}
        renderItem={(comment) => (
          <List.Item
            key={comment.id}
            style={{
              padding: '8px 0',
              borderBottom: '1px solid var(--ant-color-border-secondary)',
            }}
          >
            <div className="w-full">
              <CommentItem
                comment={comment}
                postId={GUESTBOOK_POST_ID}
                childComments={childCommentsMap}
                depth={0}
                onReplySuccess={onReplySuccess}
              />
            </div>
          </List.Item>
        )}
      />
      {orphanComments.length > 0 && (
        <div
          className="mt-4 pt-4"
          style={{ borderTop: '1px solid var(--ant-color-border-secondary)' }}
        >
          {orphanComments.map((comment) => (
            <div key={comment.id} className="mb-2">
              <CommentItem
                comment={comment}
                postId={GUESTBOOK_POST_ID}
                childComments={childCommentsMap}
                depth={1}
                onReplySuccess={onReplySuccess}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
