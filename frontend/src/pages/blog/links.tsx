// src/pages/blog/links.tsx

import { LinkOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Form, Input, Modal, Row, Spin, Typography } from 'antd';
import { useState } from 'react';

import { useActiveLinks } from '@/features/blog';
import { LazyImage } from '@/shared/ui/LazyImage';

import type { BlogLink } from '@/entities/blog';

const { Title, Paragraph } = Typography;

/**
 * 友链卡片组件
 */
function LinkCard({ link }: { link: BlogLink }) {
  return (
    <Card
      hoverable
      style={{
        borderRadius: 8,
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {link.logo ? (
            <LazyImage
              src={link.logo}
              alt={link.title}
              width={40}
              height={40}
              style={{ borderRadius: 4 }}
              skeleton={false}
            />
          ) : (
            <LinkOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title level={5} style={{ marginBottom: 4 }}>
              {link.title}
            </Title>
            <Paragraph
              type="secondary"
              style={{ marginBottom: 0, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {link.description}
            </Paragraph>
          </div>
        </div>
      </a>
    </Card>
  );
}

/**
 * 友链申请表单组件
 */
function LinkApplyModal({ visible, onCancel }: { visible: boolean; onCancel: () => void }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 1000));
      form.resetFields();
      onCancel();
    } catch {
      // 错误已由表单验证处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="友链申请"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="title"
          label="网站名称"
          rules={[
            { required: true, message: '请输入网站名称' },
            { max: 50, message: '网站名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入您的网站名称" />
        </Form.Item>

        <Form.Item
          name="url"
          label="网站地址"
          rules={[
            { required: true, message: '请输入网站地址' },
            { type: 'url', message: '请输入有效的URL地址' },
          ]}
        >
          <Input placeholder="请输入您的网站URL" />
        </Form.Item>

        <Form.Item
          name="description"
          label="网站描述"
          rules={[
            { required: true, message: '请输入网站描述' },
            { max: 200, message: '网站描述不能超过200个字符' },
          ]}
        >
          <Input.TextArea
            placeholder="请简要描述您的网站"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="logo"
          label="网站Logo（可选）"
        >
          <Input placeholder="请输入Logo图片URL" />
        </Form.Item>

        <Form.Item
          name="email"
          label="联系邮箱"
          rules={[
            { required: true, message: '请输入联系邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入您的联系邮箱" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <Button htmlType="button" onClick={onCancel} style={{ flex: 1 }}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} style={{ flex: 1 }}>
            提交申请
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

/**
 * 友链页面
 */
export function BlogLinksPage() {
  const { activeLinks, loading } = useActiveLinks();
  const [showModal, setShowModal] = useState(false);

  const sortedLinks = [...activeLinks].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>友情链接</Title>
          <Paragraph type="secondary">
            这里是我的友情链接列表，欢迎交换友链！
          </Paragraph>
        </div>
        <Button type="primary" onClick={() => setShowModal(true)}>
          申请友链
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : sortedLinks.length === 0 ? (
        <Empty description="暂无友链" />
      ) : (
        <Row gutter={[16, 16]}>
          {sortedLinks.map((link) => (
            <Col xs={24} sm={12} md={8} key={link.id}>
              <LinkCard link={link} />
            </Col>
          ))}
        </Row>
      )}

      <Card style={{ marginTop: 24, borderRadius: 8 }}>
        <Title level={4} style={{ marginBottom: 12 }}>友链交换须知</Title>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#666' }}>
          <li style={{ marginBottom: 8 }}>申请友链前，请先在您的博客添加本站链接</li>
          <li style={{ marginBottom: 8 }}>本站只收录技术类、博客类网站</li>
          <li style={{ marginBottom: 8 }}>申请后一般会在 1-3 个工作日内处理</li>
          <li>如有问题，请通过邮件联系我</li>
        </ul>
      </Card>

      <LinkApplyModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}