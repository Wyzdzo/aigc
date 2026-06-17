// src/pages/admin/tags/index.tsx

import { useState } from 'react';

import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Spin,
  Table,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RestOutlined,
} from '@ant-design/icons';

import {
  useTags,
  useDeleteTag,
} from '@/features/blog';
import type { BlogTag } from '@/entities/blog';

export function AdminTagsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [form] = Form.useForm();

  const { tags, loading, refetch } = useTags();
  const { deleteTag, loading: deleting } = useDeleteTag();

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (tag: BlogTag) => {
    setEditingTag(tag);
    form.setFieldsValue({
      name: tag.name,
      slug: tag.slug,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (tag: BlogTag) => {
    try {
      await deleteTag(tag.id);
      message.success('删除成功');
      await refetch();
    } catch {
      message.error('删除失败，请重试');
    }
  };

  const handleOk = () => {
    form.validateFields().then(async () => {
      try {
        if (editingTag) {
          message.success('更新成功');
        } else {
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
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '标签别名',
      dataIndex: 'slug',
      key: 'slug',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: Date) => {
        return new Date(date).toLocaleString('zh-CN');
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      render: (_: unknown, record: BlogTag) => {
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
              title="确定删除这个标签吗？"
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
        title="标签管理"
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增标签
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
        ) : tags.length === 0 ? (
          <Empty description="暂无标签" />
        ) : (
          <Table
            dataSource={tags}
            columns={columns}
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      <Modal
        title={editingTag ? '编辑标签' : '新增标签'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={450}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          <Form.Item
            name="slug"
            label="标签别名"
            rules={[{ required: true, message: '请输入标签别名' }]}
          >
            <Input placeholder="请输入标签别名" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
