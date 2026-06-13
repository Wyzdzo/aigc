// src/pages/blog/archives.tsx

import { useMemo } from 'react';
import { CalendarOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Badge, Card, Collapse, Empty, List, Space, Spin, Typography } from 'antd';
import { Link } from 'react-router';

import { usePosts } from '@/features/blog';

import { PostStatus } from '@/entities/blog';

const { Title, Text } = Typography;

interface ArchiveItem {
  year: number;
  month: number;
  count: number;
  posts: Array<{
    id: number;
    title: string;
    slug: string;
    createdAt: Date;
    viewCount: number;
    likeCount: number;
  }>;
}

interface ArchivePost {
  id: number;
  title: string;
  slug: string;
  createdAt: Date;
  viewCount: number;
  likeCount: number;
}

/**
 * 按年月分组文章
 */
function groupByYearMonth(posts: ArchivePost[]): ArchiveItem[] {
  const groups = new Map<string, ArchiveItem>();

  posts.forEach((post) => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从 0 开始
    const key = `${year}-${month}`;

    if (!groups.has(key)) {
      groups.set(key, {
        year,
        month,
        count: 0,
        posts: [],
      });
    }

    const group = groups.get(key)!;
    group.count += 1;
    group.posts.push({
      id: post.id,
      title: post.title,
      slug: post.slug,
      createdAt: post.createdAt,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
    });
  });

  // 按时间倒序排列（最新的在前）
  return Array.from(groups.values()).sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }
    return b.month - a.month;
  });
}

/**
 * 格式化月份
 */
function formatMonth(month: number): string {
  return `${month}月`;
}

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
  const d = new Date(date);
  return `${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * 归档页面
 */
export function ArchivesPage() {
  // 获取所有已发布的文章（pageSize 设置为足够大以获取所有文章）
  const { posts, loading, error } = usePosts({
    status: PostStatus.PUBLISHED,
    pageSize: 1000, // 获取足够多的文章用于归档统计
  });

  // 按年月分组
  const archives = useMemo(() => groupByYearMonth(posts), [posts]);

  // 统计总数
  const totalCount = useMemo(() => posts.length, [posts]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Empty
        description="加载失败"
        style={{ marginTop: 100 }}
      />
    );
  }

  if (archives.length === 0) {
    return (
      <Empty
        description="暂无文章"
        style={{ marginTop: 100 }}
      />
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
      {/* 页面标题 */}
      <Card
        style={{ marginBottom: 24, borderRadius: 8 }}
        styles={{ body: { padding: 24 } }}
      >
        <Title level={2} style={{ marginBottom: 8 }}>
          <CalendarOutlined style={{ marginRight: 8 }} />
          时间归档
        </Title>
        <Text type="secondary">
          共 {totalCount} 篇文章，按时间归档整理
        </Text>
      </Card>

      {/* 归档列表 */}
      <Card style={{ borderRadius: 8 }}>
        <Collapse
          defaultActiveKey={archives.slice(0, 3).map((_, index) => String(index))}
          expandIconPosition="end"
          items={archives.map((archive, index) => ({
            key: String(index),
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Title level={4} style={{ margin: 0 }}>
                  {archive.year}年{formatMonth(archive.month)}
                </Title>
                <Badge count={archive.count} style={{ backgroundColor: '#1890ff' }} />
              </div>
            ),
            children: (
              <List
                dataSource={archive.posts}
                renderItem={(post) => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
                      {/* 日期 */}
                      <Text type="secondary" style={{ minWidth: 60 }}>
                        {formatDate(post.createdAt)}
                      </Text>

                      {/* 文章标题 */}
                      <Link
                        to={`/blog/${post.slug}`}
                        style={{ flex: 1, color: '#262626', textDecoration: 'none' }}
                      >
                        <Text strong>{post.title}</Text>
                      </Link>

                      {/* 统计数据 */}
                      <Space size="small">
                        <Text type="secondary">
                          <EyeOutlined /> {post.viewCount}
                        </Text>
                        <Text type="secondary">
                          <LikeOutlined /> {post.likeCount}
                        </Text>
                      </Space>
                    </div>
                  </List.Item>
                )}
              />
            ),
          }))}
        />
      </Card>
    </div>
  );
}