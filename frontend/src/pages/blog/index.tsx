// src/pages/blog/index.tsx

import { useEffect, useRef, useState } from 'react';
import { CalendarOutlined, EyeOutlined, FilterOutlined, LikeOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Drawer, Empty, List, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import { Link } from 'react-router';

import { CategoryTree, SearchHighlight, SearchInput, TagCloud } from '@/widgets/blog';
import { SeoMeta } from '@/widgets/seo';
import { usePublicBloggerInfo } from '@/features/settings';
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
function AuthorCard({ postCount, categoryCount, tagCount }: {
  postCount: number;
  categoryCount: number;
  tagCount: number;
}) {
  const { bloggerInfo } = usePublicBloggerInfo();

  const nickname = bloggerInfo?.nickname || 'AIGC Blog';
  const avatar = bloggerInfo?.avatar || undefined;
  const bio = bloggerInfo?.bio || '全栈开发者，热爱技术，专注于 React、TypeScript、Node.js 等前端技术。';

  return (
    <div className="mb-6">
      <Card
        style={{ borderRadius: 'var(--radius-card)' }}
        styles={{ body: { padding: 24 } }}
      >
        <Space align="start" size={16}>
          <Avatar
            size={80}
            src={avatar}
            icon={!avatar ? <UserOutlined /> : undefined}
            className="shrink-0"
          />
          <div className="flex-1">
            <Title level={4} className="mb-2">{nickname}</Title>
            <Paragraph type="secondary" className="mb-3">
              {bio}
            </Paragraph>
            <Space size="middle">
              <span>文章 {postCount}</span>
              <span>分类 {categoryCount}</span>
              <span>标签 {tagCount}</span>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
}

/**
 * 置顶文章卡片
 */
function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`}>
      <div className="mb-6">
        <Card
          hoverable
          style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden' }}
          styles={{ body: { padding: 0 } }}
        >
          {post.coverImage && (
            <div className="h-[200px]">
              <LazyImage
                src={post.coverImage}
                alt={post.title}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
          <Card style={{ borderRadius: 0 }} styles={{ body: { padding: 20 } }}>
            <Tag color="gold" className="mb-3">置顶</Tag>
            <Title level={4} className="mb-2">{post.title}</Title>
            <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
              {post.summary}
            </Paragraph>
            <div className="text-text-tertiary">
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
      </div>
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
      className="py-4"
      actions={[
        <span key="views">
          <EyeOutlined /> {post.viewCount}
        </span>,
        <Tooltip title="点赞">
          <button
            type="button"
            key="likes"
            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
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
            <Title level={5} className="mb-0">
              <SearchHighlight text={post.title} keyword={keyword ?? ''} />
            </Title>
          </Link>
        }
        description={
          <>
            <Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              className="mb-2"
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
      <div className="mb-6">
        <Card
          style={{ borderRadius: 'var(--radius-card)' }}
          styles={{ body: { padding: 16 } }}
        >
          <CategoryTree
            selectedId={categoryId}
            onChange={onCategoryChange}
          />
        </Card>
      </div>

      {/* 标签云 */}
      <div className="mb-6">
        <Card
          style={{ borderRadius: 'var(--radius-card)' }}
          styles={{ body: { padding: 16 } }}
        >
          <TagCloud selectedId={tagId} onChange={onTagChange} />
        </Card>
      </div>

      {/* 归档链接 */}
      <Card
        style={{ borderRadius: 'var(--radius-card)' }}
        styles={{ body: { padding: 16 } }}
      >
        <Link to="/blog/archives" className="block text-center">
          <CalendarOutlined className="text-2xl text-primary mb-2" />
          <Title level={5} className="mb-0">时间归档</Title>
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { posts, total, loading, error, hasMore, loadMore } = usePosts({
    status: PostStatus.PUBLISHED,
    keyword: keyword || undefined,
    categoryId,
    tagId,
    page: 1,
    pageSize: 10,
  });

  const { categoryTree } = useCategoryTree();
  const { tags } = useTags();

  // 分离置顶文章和非置顶文章
  const featuredPost = posts.find((post) => post.isTop);
  const regularPosts = posts.filter((post) => !post.isTop);

  // 无限滚动：IntersectionObserver 监听哨兵元素
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading && !loadingMore) {
          setLoadingMore(true);
          loadMore().finally(() => setLoadingMore(false));
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMore]);

  /**
   * 搜索处理
   */
  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
  };

  /**
   * 清空搜索
   */
  const handleClear = () => {
    setKeyword('');
  };

  /**
   * 分类筛选
   */
  const handleCategoryChange = (newCategoryId: number | undefined) => {
    setCategoryId(newCategoryId);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  /**
   * 标签筛选
   */
  const handleTagChange = (newTagId: number | undefined) => {
    setTagId(newTagId);
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
  };

  // 检查是否有任何筛选条件
  const hasFilters = keyword || categoryId || tagId;

  if (error) {
    return (
      <Empty
        description="加载失败，请稍后重试"
        className="mt-[100px]"
      />
    );
  }

  return (
    <>
      {/* SEO Meta */}
      <SeoMeta title="AIGC Blog - 技术博客" description="分享技术见解和生活感悟，专注于 React、TypeScript、Node.js 等前端技术" />

      {/* 移动端筛选按钮 */}
      {isMobile && (
        <div className="sticky-z bg-bg-container py-3 border-b border-border">
          <div className="max-w-full mx-auto px-4 flex gap-3">
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={() => setIsDrawerOpen(true)}
              className="flex-1"
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

      <div className="flex gap-6">
        {/* 桌面端侧边栏 */}
        <aside className={`w-[260px] shrink-0 ${isMobile ? 'hidden' : 'block'}`}>
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
        <main className="flex-1">
          {/* 博主简介（仅桌面端显示） */}
          {!isMobile && <AuthorCard postCount={total} categoryCount={categoryTree.length} tagCount={tags.length} />}

          {/* 搜索框 */}
          <div className="mb-6">
            <Card
              style={{ borderRadius: 'var(--radius-card)' }}
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
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-text-tertiary">
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
          </div>

          {/* 加载状态（首次加载） */}
          {loading && posts.length === 0 ? (
            <div className="text-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* 置顶文章 */}
              {featuredPost && <FeaturedPostCard post={featuredPost} />}

              {/* 文章列表 */}
              <Card style={{ borderRadius: 'var(--radius-card)' }}>
                <List
                  dataSource={regularPosts}
                  renderItem={(post) => <PostListItem post={post} keyword={keyword} />}
                />

                {/* 无限滚动哨兵 + 加载更多 */}
                <div ref={sentinelRef} className="text-center py-6">
                  {loadingMore && <Spin />}
                  {!hasMore && posts.length > 0 && (
                    <span className="text-text-tertiary">—— 已加载全部 {total} 篇文章 ——</span>
                  )}
                  {hasMore && !loadingMore && (
                    <Button type="link" onClick={() => { setLoadingMore(true); loadMore().finally(() => setLoadingMore(false)); }}>
                      加载更多
                    </Button>
                  )}
                </div>
              </Card>

              {/* 空状态 */}
              {posts.length === 0 && (
                <Empty
                  description="暂无文章"
                  className="mt-[50px]"
                />
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
