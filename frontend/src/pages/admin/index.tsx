// src/pages/admin/index.tsx

import { BarChartOutlined, FileTextOutlined, LinkOutlined, MessageOutlined, WarningOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Row, Col, Statistic, Spin, Typography } from 'antd';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router';

const { Title, Paragraph } = Typography;

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    postStats {
      total
      published
      draft
    }
    commentStats {
      total
      pending
      approved
      rejected
    }
    categoryStats {
      total
    }
    tagStats {
      total
    }
    linkStats {
      total
    }
  }
`;

interface PostStats {
  total: number;
  published: number;
  draft: number;
}

interface CommentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface CategoryStats {
  total: number;
}

interface TagStats {
  total: number;
}

interface LinkStats {
  total: number;
}

interface DashboardStatsData {
  postStats: PostStats;
  commentStats: CommentStats;
  categoryStats: CategoryStats;
  tagStats: TagStats;
  linkStats: LinkStats;
}

/**
 * 统计卡片组件
 */
function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: React.ComponentType<{ style?: React.CSSProperties }>; color: string }) {
  return (
    <Card hoverable style={{ borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            backgroundColor: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon style={{ fontSize: 24, color }} />
        </div>
        <div>
          <Statistic title={title} value={value} />
        </div>
      </div>
    </Card>
  );
}

/**
 * 快捷操作卡片组件
 */
function QuickActionCard({ title, icon: Icon, color, onClick }: { title: string; icon: React.ComponentType<{ style?: React.CSSProperties }>; color: string; onClick?: () => void }) {
  return (
    <Card
      hoverable
      style={{ borderRadius: 8, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon style={{ fontSize: 28, color }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{title}</span>
      </div>
    </Card>
  );
}

/**
 * 后台仪表盘页面
 */
export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery<DashboardStatsData>(GET_DASHBOARD_STATS);

  const postStats = data?.postStats || { total: 0, published: 0, draft: 0 };
  const commentStats = data?.commentStats || { total: 0, pending: 0, approved: 0, rejected: 0 };
  const categoryStats = data?.categoryStats || { total: 0 };
  const tagStats = data?.tagStats || { total: 0 };
  const linkStats = data?.linkStats || { total: 0 };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <MessageOutlined style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />
            <Title level={3} style={{ marginBottom: 8 }}>加载失败</Title>
            <Paragraph type="secondary">数据加载失败，请稍后重试</Paragraph>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>仪表盘</Title>
        <Paragraph type="secondary">欢迎回来！这是您的博客管理控制台</Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="文章总数"
            value={postStats.total}
            icon={FileTextOutlined}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="评论总数"
            value={commentStats.total}
            icon={MessageOutlined}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="分类数量"
            value={categoryStats.total}
            icon={WarningOutlined}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="标签数量"
            value={tagStats.total}
            icon={UserOutlined}
            color="#fa8c16"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="友链数量"
            value={linkStats.total}
            icon={LinkOutlined}
            color="#13c2c2"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="已发布"
            value={postStats.published}
            icon={BarChartOutlined}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="待审核评论"
            value={commentStats.pending}
            icon={MessageOutlined}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="草稿"
            value={postStats.draft}
            icon={FileTextOutlined}
            color="#d9d9d9"
          />
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Card title="快捷操作" style={{ borderRadius: 8 }}>
        <Row gutter={[16, 16]}>
          <Col xs={6} sm={4} lg={3}>
            <QuickActionCard title="写文章" icon={FileTextOutlined} color="#1890ff" onClick={() => navigate('/admin/posts/new')} />
          </Col>
          <Col xs={6} sm={4} lg={3}>
            <QuickActionCard title="管理评论" icon={MessageOutlined} color="#52c41a" onClick={() => navigate('/admin/comments')} />
          </Col>
          <Col xs={6} sm={4} lg={3}>
            <QuickActionCard title="分类管理" icon={WarningOutlined} color="#722ed1" onClick={() => navigate('/admin/categories')} />
          </Col>
          <Col xs={6} sm={4} lg={3}>
            <QuickActionCard title="标签管理" icon={UserOutlined} color="#fa8c16" onClick={() => navigate('/admin/tags')} />
          </Col>
          <Col xs={6} sm={4} lg={3}>
            <QuickActionCard title="友链管理" icon={LinkOutlined} color="#13c2c2" />
          </Col>
          <Col xs={6} sm={4} lg={3}>
            <QuickActionCard title="系统设置" icon={BarChartOutlined} color="#eb2f96" />
          </Col>
        </Row>
      </Card>

      {/* 最近动态提示 */}
      <Card title="最近动态" style={{ marginTop: 24, borderRadius: 8 }}>
        <div style={{ color: '#666' }}>
          <p style={{ marginBottom: 8 }}>• 有 {commentStats.pending} 条评论待审核</p>
          <p style={{ marginBottom: 8 }}>• 有 {postStats.draft} 篇文章草稿</p>
          <p>• 最近更新：刚刚</p>
        </div>
      </Card>
    </div>
  );
}