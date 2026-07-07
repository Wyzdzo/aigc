// src/pages/admin/index.tsx

import { EyeOutlined, FileTextOutlined, HeartOutlined, LinkOutlined, MessageOutlined, WarningOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Row, Col, Statistic, Spin, Typography } from 'antd';
import { useNavigate } from 'react-router';
import { useDashboardStats } from '@/features/blog';

const { Title, Paragraph } = Typography;

/**
 * 统计卡片组件
 */
function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <Card hoverable className="rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg`} style={{ backgroundColor: `${color}20` }}>
          <Icon className="text-2xl" style={{ color }} />
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
function QuickActionCard({ title, icon: Icon, color, onClick }: { title: string; icon: React.ComponentType<{ className?: string }>; color: string; onClick?: () => void }) {
  return (
    <Card
      hoverable
      className={`rounded-lg ${onClick ? 'cursor-pointer' : 'cursor-default'} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon className="text-[28px]" style={{ color }} />
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>
    </Card>
  );
}

/**
 * 后台仪表盘页面
 */
export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { postStats, commentStats, categoryStats, tagStats, linkStats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="text-center">
            <MessageOutlined className="mb-4 text-5xl text-red-500" />
            <Title level={3} className="mb-2">加载失败</Title>
            <Paragraph type="secondary">数据加载失败，请稍后重试</Paragraph>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <Title level={2} className="mb-2">仪表盘</Title>
        <Paragraph type="secondary">欢迎回来！这是您的博客管理控制台</Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
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
            title="总阅读量"
            value={postStats.totalViewCount}
            icon={EyeOutlined}
            color="#1677ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总点赞量"
            value={postStats.totalLikeCount}
            icon={HeartOutlined}
            color="#eb2f96"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
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
            icon={FileTextOutlined}
            color="#52c41a"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
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
      <Card title="快捷操作" className="rounded-lg">
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
            <QuickActionCard title="友链管理" icon={LinkOutlined} color="#13c2c2" onClick={() => navigate('/admin/links')} />
          </Col>
          <Col xs={6} sm={4} lg={3}>
            <QuickActionCard title="系统设置" icon={EyeOutlined} color="#eb2f96" />
          </Col>
        </Row>
      </Card>

      {/* 最近动态提示 */}
      <Card title="最近动态" className="mt-6 rounded-lg">
        <div className="text-gray-500">
          <p className="mb-2">• 有 {commentStats.pending} 条评论待审核</p>
          <p className="mb-2">• 有 {postStats.draft} 篇文章草稿</p>
          <p>• 最近更新：刚刚</p>
        </div>
      </Card>
    </div>
  );
}
