// src/pages/blog/category/[id].tsx

import { useEffect, useState } from 'react';
import { CalendarOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { App, Breadcrumb, Card, Empty, Pagination, Space, Spin, Tooltip, Typography } from 'antd';
import { Link, useParams } from 'react-router';

import { useCategories, useLikePost, usePosts } from '@/features/blog';

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
 * 文章列表项
 */
function PostListItem({ post }: { post: import('@/entities/blog').BlogPost }) {
  const { likePost, loading: likeLoading } = useLikePost();
  const { message: messageApi } = App.useApp();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid var(--ant-color-border-secondary)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link to={`/blog/${post.slug}`}>
          <Title level={5} style={{ marginBottom: 0 }}>
            {post.title}
          </Title>
        </Link>
        <Paragraph
          type="secondary"
          ellipsis={{ rows: 2 }}
          style={{ marginBottom: 8 }}
        >
          {post.summary ?? ''}
        </Paragraph>
        <Space size="middle">
          <CalendarOutlined /> {formatDate(post.createdAt)}
        </Space>
      </div>
      <ul style={{ display: 'flex', gap: 16, listStyle: 'none', margin: 0, padding: 0, marginLeft: 24 }}>
        <li>
          <span>
            <EyeOutlined /> {post.viewCount}
          </span>
        </li>
        <li>
          <Tooltip title="点赞">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const result = await likePost(post.id);
                if (result === 'already_liked') messageApi.info('您已经点过赞了');
                else if (result === 'success') messageApi.success('点赞成功');
                else if (result === 'error') messageApi.error('点赞失败，请稍后重试');
              }}
              disabled={likeLoading}
            >
              <LikeOutlined /> {post.likeCount}
            </button>
          </Tooltip>
        </li>
      </ul>
    </div>
  );
}

/**
 * 分类详情页
 */
export function BlogCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = id ? Number(id) : undefined;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { categories } = useCategories();
  const { posts, total, loading, error } = usePosts({
    status: PostStatus.PUBLISHED,
    categoryId,
    page: currentPage,
    pageSize,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 重置分页当分类变化时
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);

  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category?.name ?? '分类';

  const handlePageChange = (page: number, newPageSize: number) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  if (!categoryId || isNaN(categoryId)) {
    return (
      <Empty description="无效的分类链接" style={{ marginTop: 100 }}>
        <Link to="/blog">
          <span>返回首页</span>
        </Link>
      </Empty>
    );
  }

  if (error) {
    return (
      <Empty description="加载失败，请稍后重试" style={{ marginTop: 100 }}>
        <Link to="/blog">
          <span>返回首页</span>
        </Link>
      </Empty>
    );
  }

  return (
    <>
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/blog">首页</Link> },
          { title: categoryName },
        ]}
      />

      {/* 分类标题 */}
      <Title level={isMobile ? 3 : 2} style={{ marginBottom: 24 }}>
        {categoryName}
      </Title>

      {/* 加载状态 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* 文章列表 */}
          {posts.length > 0 ? (
            <Card style={{ borderRadius: 8 }}>
              {posts.map((post) => (
                <PostListItem key={post.id} post={post} />
              ))}
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={['10', '20', '50']}
                showTotal={(t) => `共 ${t} 篇文章`}
                style={{ textAlign: 'center', marginTop: 16 }}
              />
            </Card>
          ) : (
            <Empty
              description="该分类下暂无文章"
              style={{ marginTop: 50 }}
            >
              <Link to="/blog">
                <span>返回首页</span>
              </Link>
            </Empty>
          )}
        </>
      )}
    </>
  );
}

export default BlogCategoryPage;
