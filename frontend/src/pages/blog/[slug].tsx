// src/pages/blog/[slug].tsx

import { Card, Typography, Space, Tag, Divider, Spin, Empty, Breadcrumb, Anchor } from 'antd';
import { EyeOutlined, LikeOutlined, CalendarOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router';
import { usePostBySlug } from '@/features/blog';
import { Markdown, extractToc, type TocItem } from '@/shared/blog/markdown';
import { useEffect, useState } from 'react';

const { Title } = Typography;

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 目录导航组件
 */
function TocNavigation({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  const itemsConfig = items.map((item) => ({
    key: item.id,
    href: `#${item.id}`,
    title: item.text,
  }));

  return (
    <Card
      size="small"
      title="目录"
      style={{ marginBottom: 16 }}
      styles={{ body: { padding: '12px 16px' } }}
    >
      <Anchor items={itemsConfig} targetOffset={100} />
    </Card>
  );
}

/**
 * 文章元信息组件
 */
function ArticleMeta({
  viewCount,
  likeCount,
  createdAt,
}: {
  viewCount: number;
  likeCount: number;
  createdAt: Date;
}) {
  return (
    <Space size="middle" style={{ color: '#9ca3af' }}>
      <span>
        <EyeOutlined /> {viewCount}
      </span>
      <span>
        <LikeOutlined /> {likeCount}
      </span>
      <span>
        <CalendarOutlined /> {formatDate(createdAt)}
      </span>
    </Space>
  );
}

/**
 * 文章导航组件（上一篇/下一篇）
 */
function ArticleNavigation({
  prev,
  next,
}: {
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
}) {
  if (!prev && !next) return null;

  return (
    <Divider>文章导航</Divider>
  );
}

/**
 * 文章详情页
 */
export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePostBySlug(slug);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [viewCount, setViewCount] = useState(0);

  // 提取目录
  useEffect(() => {
    if (post?.content) {
      setToc(extractToc(post.content));
    }
  }, [post?.content]);

  // 阅读量统计（模拟）
  useEffect(() => {
    if (post) {
      setViewCount(post.viewCount + 1);
    }
  }, [post]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <Empty
        description="文章不存在或加载失败"
        style={{ marginTop: 100 }}
      >
        <Link to="/blog">
          <span>返回首页</span>
        </Link>
      </Empty>
    );
  }

  return (
    <div className="flex gap-6">
      {/* 主内容区 */}
      <div className="flex-1 min-w-0">
        {/* 面包屑导航 */}
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <Link to="/blog">首页</Link> },
            { title: post.title },
          ]}
        />

        {/* 文章卡片 */}
        <Card
          style={{ borderRadius: 8 }}
          styles={{ body: { padding: 32 } }}
        >
          {/* 标题 */}
          <Title level={2} style={{ marginBottom: 16 }}>
            {post.title}
          </Title>

          {/* 标签和统计 */}
          <Space size="middle" style={{ marginBottom: 24 }}>
            {post.isTop && <Tag color="gold">置顶</Tag>}
            <ArticleMeta
              viewCount={viewCount}
              likeCount={post.likeCount}
              createdAt={post.createdAt}
            />
          </Space>

          <Divider style={{ margin: '16px 0' }} />

          {/* 文章封面图 */}
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              style={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 8,
                marginBottom: 24,
              }}
            />
          )}

          {/* 文章内容 */}
          <Markdown content={post.content} />
        </Card>

        {/* 文章导航 */}
        <ArticleNavigation prev={null} next={null} />
      </div>

      {/* 侧边栏 */}
      <div className="w-64 flex-shrink-0 hidden lg:block">
        {/* 目录 */}
        <div style={{ position: 'sticky', top: 80 }}>
          <TocNavigation items={toc} />
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
