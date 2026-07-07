// src/pages/blog/[slug].tsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarOutlined, EyeOutlined, LikeOutlined, MenuOutlined } from '@ant-design/icons';
import {
  Anchor,
  Breadcrumb,
  Button,
  Card,
  Divider,
  Drawer,
  Empty,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { Link, useParams } from 'react-router';

import { CommentForm, CommentList } from '@/widgets/blog';
import { SeoMeta } from '@/widgets/seo';
import { useAdjacentPosts, useComments, useLikePost, usePostBySlug, useViewPost } from '@/features/blog';

import { Markdown } from '@/shared/blog/markdown';
import { extractToc, type TocItem } from '@/shared/lib/markdownUtils';
import { LazyImage } from '@/shared/ui/LazyImage';

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
  const itemsConfig = items.map((item) => ({ key: item.id, href: `#${item.id}`, title: item.text }));
  return (
    <Card size="small" title="目录" style={{ marginBottom: 16 }} styles={{ body: { padding: '12px 16px' } }}>
      <Anchor items={itemsConfig} targetOffset={100} />
    </Card>
  );
}

/**
 * 文章元信息组件
 */
function ArticleMeta({
  postId,
  viewCount,
  likeCount,
  createdAt,
}: {
  postId: number;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
}) {
  const { likePost, loading: likeLoading } = useLikePost();

  return (
    <div className="text-text-tertiary">
      <Space size="middle">
        <span>
          <EyeOutlined /> {viewCount}
        </span>
        <Tooltip title="点赞">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
            onClick={() => likePost(postId)}
            disabled={likeLoading}
          >
            <LikeOutlined /> {likeCount}
          </button>
        </Tooltip>
        <span>
          <CalendarOutlined /> {formatDate(createdAt)}
        </span>
      </Space>
    </div>
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
  const { Text } = Typography;
  return (
    <div className="flex justify-between gap-4 mt-6">
      {prev ? (
        <Link to={`/blog/${prev.slug}`} className="flex-1 min-w-0">
          <Card size="small" hoverable>
            <Text type="secondary">上一篇</Text>
            <div><Text strong ellipsis>{prev.title}</Text></div>
          </Card>
        </Link>
      ) : <div className="flex-1" />}
      {next ? (
        <Link to={`/blog/${next.slug}`} className="flex-1 min-w-0 text-right">
          <Card size="small" hoverable>
            <Text type="secondary">下一篇</Text>
            <div><Text strong ellipsis>{next.title}</Text></div>
          </Card>
        </Link>
      ) : <div className="flex-1" />}
    </div>
  );
}

/**
 * 文章详情页
 */
export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePostBySlug(slug);
  const { prev, next } = useAdjacentPosts(slug);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { items: comments, total, loading: commentsLoading, refetch } = useComments({ postId: post?.id });

  const { viewPost } = useViewPost();
  const hasViewedRef = useRef(false);

  useEffect(() => {
    if (post?.id && !hasViewedRef.current) {
      hasViewedRef.current = true;
      viewPost(post.id);
    }
  }, [post?.id, viewPost]);

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toc = useMemo(() => {
    const content = post?.content;
    if (content) {
      return extractToc(content);
    }
    return [];
  }, [post?.content]);

  if (!slug) {
    return (
      <Empty description="无效的文章链接" style={{ marginTop: 100 }}>
        <Link to="/blog">
          <span>返回首页</span>
        </Link>
      </Empty>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <Empty description="文章不存在或加载失败" style={{ marginTop: 100 }}>
        <Link to="/blog">
          <span>返回首页</span>
        </Link>
      </Empty>
    );
  }

  return (
    <>
      {/* SEO Meta */}
      <SeoMeta
        article={
          post
            ? {
                title: post.title,
                slug: post.slug,
                summary: post.summary || (post.content ? post.content.slice(0, 200) : ''),
                publishedTime: post.createdAt,
                modifiedTime: post.updatedAt,
                coverImage: post.coverImage,
              }
            : undefined
        }
        articleSlug={slug}
      />

      {/* 移动端目录按钮 */}
      {isMobile && toc.length > 0 && (
        <div className="fixed-z" style={{ bottom: '1.25rem', right: '1.25rem' }}>
          <Button
            type="primary"
            shape="circle"
            icon={<MenuOutlined />}
            onClick={() => setIsDrawerOpen(true)}
            size="large"
          />
        </div>
      )}

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
            styles={{ body: { padding: isMobile ? 16 : 32 } }}
          >
            {/* 标题 */}
            <Title
              level={isMobile ? 3 : 2}
              style={{ marginBottom: 16, fontSize: isMobile ? '20px' : undefined }}
            >
              {post.title}
            </Title>

            {/* 标签和统计 */}
            <Space size="middle" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
              {post.isTop && <Tag color="gold">置顶</Tag>}
              <ArticleMeta
                postId={post.id}
                viewCount={post.viewCount}
                likeCount={post.likeCount}
                createdAt={post.createdAt}
              />
            </Space>

            <Divider style={{ margin: '16px 0' }} />

            {/* 文章封面图 */}
            {post.coverImage && (
              <div style={{ marginBottom: 24, borderRadius: 8, overflow: 'hidden' }}>
                <LazyImage
                  src={post.coverImage}
                  alt={post.title}
                  style={{
                    width: '100%',
                    maxHeight: isMobile ? 200 : 400,
                  }}
                />
              </div>
            )}

            {/* 文章内容 */}
            <div style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8' }}>
              <Markdown content={post.content} />
            </div>
          </Card>

          {/* 文章导航 */}
          <ArticleNavigation prev={prev} next={next} />

          {/* 评论区域 */}
          <Card style={{ borderRadius: 8, marginTop: 24 }} styles={{ body: { padding: isMobile ? 16 : 24 } }}>
            <Title level={isMobile ? 4 : 3} style={{ marginBottom: 16 }}>
              评论 ({total})
            </Title>
            <div style={{ marginBottom: 24 }}>
              <CommentForm postId={post.id} />
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <CommentList
              comments={comments}
              loading={commentsLoading}
              postId={post.id}
              onReply={() => refetch()}
            />
          </Card>
        </div>

        {/* 桌面端侧边栏 */}
        <div className="w-64 flex-shrink-0 hidden lg:block">
          {/* 目录 */}
          <div style={{ position: 'sticky', top: 80 }}>
            <TocNavigation items={toc} />
          </div>
        </div>
      </div>

      {/* 移动端目录抽屉 */}
      <Drawer
        title="目录"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={280}
        style={{ display: isMobile ? 'block' : 'none' }}
      >
        <TocNavigation items={toc} />
      </Drawer>
    </>
  );
}

export default BlogDetailPage;