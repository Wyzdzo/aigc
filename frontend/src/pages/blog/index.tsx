// src/pages/blog/index.tsx

import { Card, List, Avatar, Typography, Space, Tag, Pagination, Spin, Empty } from 'antd';
import { EyeOutlined, LikeOutlined, CalendarOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import { useState } from 'react';
import { usePosts } from '@/features/blog';
import { PostStatus, type BlogPost } from '@/entities/blog';
import { SearchInput, SearchHighlight, CategoryTree, TagCloud } from '@/widgets/blog';

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
function FeaturedPostCard({ post }: { post: BlogPost }) {
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
function PostListItem({
  post,
  keyword,
}: {
  post: BlogPost;
  keyword?: string;
}) {
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
            <Title level={5} style={{ marginBottom: 0 }}>
              <SearchHighlight text={post.title} keyword={keyword ?? ''} />
            </Title>
          </Link>
        }
        description={
          <>
            <Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 8 }}
            >
              <SearchHighlight text={post.summary ?? ''} keyword={keyword ?? ''} />
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
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [tagId, setTagId] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { posts, total, loading, error } = usePosts({
    status: PostStatus.PUBLISHED,
    keyword: keyword || undefined,
    categoryId,
    tagId,
    page: currentPage,
    pageSize,
  });

  // 分离置顶文章和非置顶文章
  const featuredPost = posts.find((post) => post.isTop);
  const regularPosts = posts.filter((post) => !post.isTop);

  /**
   * 搜索处理
   */
  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
    setCurrentPage(1);
  };

  /**
   * 清空搜索
   */
  const handleClear = () => {
    setKeyword('');
    setCurrentPage(1);
  };

  /**
   * 分类筛选
   */
  const handleCategoryChange = (newCategoryId: number | undefined) => {
    setCategoryId(newCategoryId);
    setCurrentPage(1);
  };

  /**
   * 标签筛选
   */
  const handleTagChange = (newTagId: number | undefined) => {
    setTagId(newTagId);
    setCurrentPage(1);
  };

  /**
   * 清除所有筛选
   */
  const handleClearFilters = () => {
    setCategoryId(undefined);
    setTagId(undefined);
    setKeyword('');
    setCurrentPage(1);
  };

  /**
   * 分页切换
   */
  const handlePageChange = (page: number, newPageSize: number) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  // 检查是否有任何筛选条件
  const hasFilters = keyword || categoryId || tagId;

  if (error) {
    return (
      <Empty
        description="加载失败，请稍后重试"
        style={{ marginTop: 100 }}
      />
    );
  }

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* 侧边栏 */}
      <aside style={{ width: 260, flexShrink: 0 }}>
        {/* 分类树 */}
        <Card
          style={{ marginBottom: 24, borderRadius: 8 }}
          styles={{ body: { padding: 16 } }}
        >
          <CategoryTree
            selectedId={categoryId}
            onChange={handleCategoryChange}
          />
        </Card>

        {/* 标签云 */}
        <Card
          style={{ marginBottom: 24, borderRadius: 8 }}
          styles={{ body: { padding: 16 } }}
        >
          <TagCloud selectedId={tagId} onChange={handleTagChange} />
        </Card>

        {/* 归档链接 */}
        <Card
          style={{ borderRadius: 8 }}
          styles={{ body: { padding: 16 } }}
        >
          <Link to="/blog/archives" style={{ display: 'block', textAlign: 'center' }}>
            <CalendarOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
            <Title level={5} style={{ marginBottom: 0 }}>时间归档</Title>
          </Link>
        </Card>
      </aside>

      {/* 主内容区 */}
      <main style={{ flex: 1 }}>
        {/* 博主简介 */}
        <AuthorCard />

        {/* 搜索框 */}
        <Card
          style={{ marginBottom: 24, borderRadius: 8 }}
          styles={{ body: { padding: 16 } }}
        >
          <SearchInput
            value={keyword}
            onSearch={handleSearch}
            onClear={handleClear}
            loading={loading}
            placeholder="搜索文章标题或摘要..."
          />
          {hasFilters && !loading && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#9ca3af' }}>
                {total > 0 ? `找到 ${total} 篇相关文章` : '未找到相关文章'}
              </span>
              <Tag
                closable
                onClose={handleClearFilters}
                color="blue"
                style={{ cursor: 'pointer' }}
              >
                清除筛选
              </Tag>
            </div>
          )}
        </Card>

        {/* 加载状态 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* 置顶文章（有筛选时隐藏） */}
            {!hasFilters && featuredPost && (
              <FeaturedPostCard post={featuredPost} />
            )}

            {/* 文章列表 */}
            <Card
              style={{ borderRadius: 8 }}
              styles={{ body: { padding: '0 24px' } }}
            >
              <List
                dataSource={regularPosts}
                renderItem={(post) => <PostListItem post={post} keyword={keyword} />}
                locale={{ emptyText: hasFilters ? '未找到相关文章' : '暂无文章' }}
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
      </main>
    </div>
  );
}

export default BlogHomePage;
