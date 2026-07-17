// src/pages/blog/guestbook.tsx

import { Card, Divider, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { CommentForm, GuestbookList, GUESTBOOK_POST_ID } from '@/widgets/blog';
import { useComments } from '@/features/blog';

const { Title } = Typography;

/**
 * 留言板页面
 */
export function BlogGuestbookPage() {
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { items: comments, total, loading, refetch } = useComments({
    postId: GUESTBOOK_POST_ID,
    page: 1,
    pageSize: 50,
  });

  return (
    <div>
      {/* 留言说明 */}
      <Card
        style={{ marginBottom: 24, borderRadius: 'var(--radius-card)' }}
        styles={{ body: { padding: isMobile ? 16 : 24 } }}
      >
        <Title level={4} style={{ marginBottom: 8 }}>
          留言板
        </Title>
        <p style={{ color: 'var(--ant-color-text-secondary)', marginBottom: 0 }}>
          有什么想说的？想吐槽的？想交流的？都在这里留言吧~
          博主会认真阅读每一条留言，并尽快回复。
        </p>
      </Card>

      {/* 留言表单 */}
      <Card
        style={{ borderRadius: 'var(--radius-card)', marginBottom: 24 }}
        styles={{ body: { padding: isMobile ? 16 : 24 } }}
      >
        <Title level={5} style={{ marginBottom: 16 }}>
          写下你的留言
        </Title>
        <CommentForm
          postId={GUESTBOOK_POST_ID}
          onSuccess={() => refetch()}
          placeholder="有什么想说的..."
        />
      </Card>

      <Divider style={{ margin: '24px 0' }} />

      {/* 留言列表 */}
      <Card
        style={{ borderRadius: 'var(--radius-card)' }}
        styles={{ body: { padding: isMobile ? 16 : 24 } }}
      >
        <Title level={5} style={{ marginBottom: 16 }}>
          留言 ({total})
        </Title>
        <GuestbookList
          comments={comments}
          loading={loading}
          onReplySuccess={() => refetch()}
        />
      </Card>
    </div>
  );
}
