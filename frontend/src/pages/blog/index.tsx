// src/pages/blog/index.tsx

import { useEffect, useState } from 'react';
import { CalendarOutlined, EyeOutlined, FilterOutlined, LikeOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Drawer, Empty, List, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import { Link } from 'react-router';

import { CategoryTree, SearchHighlight, SearchInput, TagCloud } from '@/widgets/blog';
import { SeoMeta } from '@/widgets/seo';
import { useCategoryTree, useLikePost, usePosts, useTags } from '@/features/blog';

import { type BlogPost, PostStatus } from '@/entities/blog';

import { LazyImage } from '@/shared/ui/LazyImage';

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
  const { posts } = usePosts({ status: PostStatus.PUBLISHED });
  const { categoryTree } = useCategoryTree();
  const { tags } = useTags();

  const postCount = posts.length;
  const categoryCount = categoryTree.length;
  const tagCount = tags.length;

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
            <span>文章 {postCount}</span>
            <span>分类 {categoryCount}</span>
            <span>标签 {tagCount}</span>
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
      >
        {post.coverImage && (
          <div style={{ height: 200 }}>
            <LazyImage
              src={post.coverImage}
              alt={post.title}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
        <Card style={{ borderRadius: 0 }} styles={{ body: { padding: 20 } }}>
          <Tag color="gold" style={{ marginBottom: 12 }}>置顶</Tag>
          <Title level={4} style={{ marginBottom: 8 }}>{post.title}</Title>
          <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
            {post.summary}
          </Paragraph>
          <div className="text-gray-400">
            <Space size="middle">
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
          </div>
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
  const { likePost, loading: likeLoading } = useLikePost();

  return (
    <List.Item
      style={{ padding: '16px 0' }}
      actions={[
        <span key="views">
          <EyeOutlined /> {post.viewCount}
        </span>,
        <Tooltip title="点赞">
          <button
            type="button"
            key="likes"
            className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              likePost(post.id);
            }}
            disabled={likeLoading}
          >
            <LikeOutlined /> {post.likeCount}
          </button>
        </Tooltip>,
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
 * 侧边栏内容组件
 */
function SidebarContent({
  categoryId,
  tagId,
  onCategoryChange,
  onTagChange,
}: {
  categoryId: number | undefined;
  tagId: number | undefined;
  onCategoryChange: (id: number | undefined) => void;
  onTagChange: (id: number | undefined) => void;
}) {
  return (
    <>
      {/* 分类树 */}
      <Card
        style={{ marginBottom: 24, borderRadius: 8 }}
        styles={{ body: { padding: 16 } }}
      >
        <CategoryTree
          selectedId={categoryId}
          onChange={onCategoryChange}
        />
      </Card>

      {/* 标签云 */}
      <Card
        style={{ marginBottom: 24, borderRadius: 8 }}
        styles={{ body: { padding: 16 } }}
      >
        <TagCloud selectedId={tagId} onChange={onTagChange} />
      </Card>

      {/* 归档链接 */}
      <Card
        style={{ borderRadius: 8 }}
        styles={{ body: { padding: 16 } }}
      >
        <Link to="/blog/archives" style={{ display: 'block', textAlign: 'center' }}>
          <CalendarOutlined className="text-2xl text-blue-500 mb-2" />
          <Title level={5} style={{ marginBottom: 0 }}>时间归档</Title>
        </Link>
      </Card>
    </>
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  /**
   * 标签筛选
   */
  const handleTagChange = (newTagId: number | undefined) => {
    setTagId(newTagId);
    setCurrentPage(1);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
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
    <>
      {/* SEO Meta */}
      <SeoMeta title="AIGC Blog - 技术博客" description="分享技术见解和生活感悟，专注于 React、TypeScript、Node.js 等前端技术" />

      {/* 移动端筛选按钮 */}
      {isMobile && (
        <div className="sticky-z bg-white py-3 border-b">
          <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 16px', display: 'flex', gap: 12 }}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={() => setIsDrawerOpen(true)}
              style={{ flex: 1 }}
            >
              筛选
            </Button>
            {hasFilters && (
              <Button danger onClick={handleClearFilters}>
                清除筛选
              </Button>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 24 }}>
        {/* 桌面端侧边栏 */}
        <aside style={{ width: 260, flexShrink: 0, display: isMobile ? 'none' : 'block' }}>
          <SidebarContent
            categoryId={categoryId}
            tagId={tagId}
            onCategoryChange={handleCategoryChange}
            onTagChange={handleTagChange}
          />
        </aside>

        {/* 移动端抽屉侧边栏 */}
        <Drawer
          title="筛选"
          placement="left"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={280}
          style={{ display: isMobile ? 'block' : 'none' }}
        >
          <SidebarContent
            categoryId={categoryId}
            tagId={tagId}
            onCategoryChange={handleCategoryChange}
            onTagChange={handleTagChange}
          />
        </Drawer>

        {/* 主内容区 */}
        <main style={{ flex: 1 }}>
          {/* 博主简介（仅桌面端显示） */}
          {!isMobile && <AuthorCard />}

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
                <span className="text-gray-400">
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
              {/* 置顶文章 */}
              {featuredPost && <FeaturedPostCard post={featuredPost} />}

              {/* 文章列表 */}
              <Card style={{ borderRadius: 8 }}>
                <List
                  dataSource={regularPosts}
                  renderItem={(post) => <PostListItem post={post} keyword={keyword} />}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    onChange: handlePageChange,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    showTotal: (total) => `共 ${total} 篇文章`,
                  }}
                />
              </Card>

              {/* 空状态 */}
              {posts.length === 0 && (
                <Empty
                  description="暂无文章"
                  style={{ marginTop: 50 }}
                />
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}