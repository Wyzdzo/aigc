// src/pages/blog/index.tsx

import { Card, List, Avatar, Typography, Space, Tag, Pagination, Spin, Empty } from 'antd';
import { EyeOutlined, LikeOutlined, CalendarOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import { usePosts } from '@/features/blog';
import { PostStatus } from '@/entities/blog';

const { Title, Paragraph } = Typography;

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
 * 博主简介卡片
 */
function AuthorCard() {
  return (
    <Card
      style={{
        marginBottom: 24,
        borderRadius: 8,
      }}
      styles={{ body: { padding: 24 } }}
    >
      <Space align="start" size={16}>
        <Avatar
          size={80}
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=aigc"
          style={{ flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ marginBottom: 8 }}>AIGC Blog</Title>
          <Paragraph type="secondary" style={{ marginBottom: 12 }}>
            全栈开发者，热爱技术，专注于 React、TypeScript、Node.js 等前端技术。
            分享工作中的技术积累和最佳实践，希望与大家一起成长。
          </Paragraph>
          <Space size="middle">
            <span>文章 10</span>
            <span>分类 5</span>
            <span>标签 10</span>
          </Space>
        </div>
      </Space>
    </Card>
  );
}

/**
 * 置顶文章卡片
 */
function FeaturedPostCard({ post }: { post: NonNullable<ReturnType<typeof usePosts>['posts']>[0] }) {
  return (
    <Link to={`/blog/${post.slug}`}>
      <Card
        hoverable
        style={{
          marginBottom: 24,
          borderRadius: 8,
          overflow: 'hidden',
        }}
        styles={{ body: { padding: 0 } }}
        cover={
          post.coverImage ? (
            <img
              alt={post.title}
              src={post.coverImage}
              style={{ height: 200, objectFit: 'cover' }}
            />
          ) : undefined
        }
      >
        <Card style={{ borderRadius: 0 }} styles={{ body: { padding: 20 } }}>
          <Tag color="gold" style={{ marginBottom: 12 }}>置顶</Tag>
          <Title level={4} style={{ marginBottom: 8 }}>{post.title}</Title>
          <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
            {post.summary}
          </Paragraph>
          <Space size="middle" style={{ color: '#9ca3af' }}>
            <span>
              <EyeOutlined /> {post.viewCount}
            </span>
            <span>
              <LikeOutlined /> {post.likeCount}
            </span>
            <span>
              <CalendarOutlined /> {formatDate(post.createdAt)}
            </span>
          </Space>
        </Card>
      </Card>
    </Link>
  );
}

/**
 * 文章列表项
 */
function PostListItem({ post }: { post: NonNullable<ReturnType<typeof usePosts>['posts']>[0] }) {
  return (
    <List.Item
      style={{ padding: '16px 0' }}
      actions={[
        <span key="views">
          <EyeOutlined /> {post.viewCount}
        </span>,
        <span key="likes">
          <LikeOutlined /> {post.likeCount}
        </span>,
      ]}
    >
      <List.Item.Meta
        title={
          <Link to={`/blog/${post.slug}`}>
            <Title level={5} style={{ marginBottom: 0 }}>{post.title}</Title>
          </Link>
        }
        description={
          <>
            <Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 8 }}
            >
              {post.summary}
            </Paragraph>
            <Space size="middle">
              <CalendarOutlined /> {formatDate(post.createdAt)}
            </Space>
          </>
        }
      />
    </List.Item>
  );
}

/**
 * 博客首页
 */
export function BlogHomePage() {
  const { posts, total, currentPage, pageSize, loading, error } = usePosts({
    status: PostStatus.PUBLISHED,
    page: 1,
    pageSize: 10,
  });

  // 分离置顶文章和非置顶文章
  const featuredPost = posts.find((post) => post.isTop);
  const regularPosts = posts.filter((post) => !post.isTop);

  const handlePageChange = (page: number, newPageSize: number) => {
    // TODO: 实现分页切换逻辑
    console.log('Page change:', page, newPageSize);
  };

  if (error) {
    return (
      <Empty
        description="加载失败，请稍后重试"
        style={{ marginTop: 100 }}
      />
    );
  }

  return (
    <div>
      {/* 博主简介 */}
      <AuthorCard />

      {/* 加载状态 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* 置顶文章 */}
          {featuredPost && (
            <FeaturedPostCard post={featuredPost} />
          )}

          {/* 文章列表 */}
          <Card
            style={{ borderRadius: 8 }}
            styles={{ body: { padding: '0 24px' } }}
          >
            <List
              dataSource={regularPosts}
              renderItem={(post) => <PostListItem post={post} />}
              locale={{ emptyText: '暂无文章' }}
            />

            {/* 分页 */}
            {total > pageSize && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total) => `共 ${total} 篇文章`}
                />
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

export default BlogHomePage;
