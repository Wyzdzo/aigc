// src/pages/admin/links.tsx

import { useState } from 'react';

import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Spin,
  Table,
  Tag,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RestOutlined,
} from '@ant-design/icons';

import {
  LinkStatus,
  useCreateLink,
  useDeleteLink,
  useLinks,
  useUpdateLink,
} from '@/features/blog';
import type { BlogLink } from '@/entities/blog';

export function AdminLinksPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLink, setEditingLink] = useState<BlogLink | null>(null);
  const [form] = Form.useForm();

  const { links, loading, refetch } = useLinks();
  const { createLink, loading: creating } = useCreateLink();
  const { updateLink, loading: updating } = useUpdateLink();
  const { deleteLink, loading: deleting } = useDeleteLink();

  const handleAdd = () => {
    setEditingLink(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (link: BlogLink) => {
    setEditingLink(link);
    form.setFieldsValue({
      title: link.title,
      url: link.url,
      description: link.description,
      logo: link.logo,
      sortOrder: link.sortOrder,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (link: BlogLink) => {
    try {
      await deleteLink(link.id);
      message.success('删除成功');
      await refetch();
    } catch {
      message.error('删除失败，请重试');
    }
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingLink) {
          await updateLink({
            id: editingLink.id,
            title: values.title,
            url: values.url,
            description: values.description,
            logo: values.logo,
            sortOrder: values.sortOrder,
          });
          message.success('更新成功');
        } else {
          await createLink({
            title: values.title,
            url: values.url,
            description: values.description,
            logo: values.logo,
            sortOrder: values.sortOrder,
          });
          message.success('创建成功');
        }
        setIsModalVisible(false);
        await refetch();
      } catch {
        message.error('操作失败，请重试');
      }
    }).catch(() => {
      // Form validation failed
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 120,
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      align: 'center' as const,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: LinkStatus) => {
        const isActive = status === LinkStatus.ACTIVE;
        return (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? '启用' : '禁用'}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      render: (_: unknown, record: BlogLink) => {
        return (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除这个友链吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={deleting}
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="友链管理"
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增友链
            </Button>
            <Button
              type="text"
              icon={<RestOutlined />}
              onClick={() => refetch()}
              loading={loading}
            >
              刷新
            </Button>
          </div>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : links.length === 0 ? (
          <Empty description="暂无友链" />
        ) : (
          <Table
            dataSource={links}
            columns={columns}
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            scroll={{ x: 1000 }}
          />
        )}
      </Card>

      <Modal
        title={editingLink ? '编辑友链' : '新增友链'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={creating || updating}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入友链标题' }]}
          >
            <Input placeholder="请输入友链标题" />
          </Form.Item>
          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: '请输入友链URL' }]}
          >
            <Input placeholder="请输入友链URL" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input placeholder="请输入友链描述" />
          </Form.Item>
          <Form.Item
            name="logo"
            label="Logo"
          >
            <Input placeholder="请输入Logo URL" />
          </Form.Item>
          <Form.Item
            name="sortOrder"
            label="排序"
            initialValue={0}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入排序值" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
