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
  Tag,
  Tooltip,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RestOutlined,
  TagOutlined,
} from '@ant-design/icons';

import {
  useCreateTag,
  useDeleteTag,
  useTags,
  useUpdateTag,
} from '@/features/blog';
import type { BlogTag } from '@/entities/blog';

const TAG_COLORS = [
  'blue', 'cyan', 'geekblue', 'purple', 'magenta',
  'volcano', 'orange', 'gold', 'green', 'lime',
];

function getTagColor(id: number): string {
  return TAG_COLORS[id % TAG_COLORS.length];
}

export function AdminTagsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [form] = Form.useForm();

  const { tags, loading, refetch } = useTags();
  const { createTag, loading: creating } = useCreateTag();
  const { updateTag, loading: updating } = useUpdateTag();
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
    form.validateFields().then(async (values) => {
      try {
        if (editingTag) {
          await updateTag({
            id: editingTag.id,
            name: values.name,
            slug: values.slug,
          });
          message.success('更新成功');
        } else {
          await createTag({
            name: values.name,
            slug: values.slug,
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

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <TagOutlined className="text-blue-500" />
            <span className="text-lg font-medium">标签管理</span>
            {tags.length > 0 && (
              <span className="text-sm text-gray-400 font-normal">共 {tags.length} 个</span>
            )}
          </div>
        }
        extra={
          <div className="flex gap-2">
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
          <div className="text-center py-10">
            <Spin size="large" />
          </div>
        ) : tags.length === 0 ? (
          <Empty description="暂无标签" />
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="group relative inline-flex items-center gap-2 px-3 py-2 border rounded-lg hover:shadow-sm hover:border-blue-300 transition-all"
              >
                <span className="m-0"><Tag color={getTagColor(tag.id)}>{tag.name}</Tag></span>
                <span className="text-xs text-gray-400">/{tag.slug}</span>
                <div className="flex gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip title="编辑">
                    <Button
                      size="small"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(tag)}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="确定删除这个标签吗？"
                    onConfirm={() => handleDelete(tag)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Tooltip title="删除">
                      <Button
                        danger
                        size="small"
                        type="text"
                        icon={<DeleteOutlined />}
                        loading={deleting}
                      />
                    </Tooltip>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        title={editingTag ? '编辑标签' : '新增标签'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={creating || updating}
        width={450}
      >
        <div className="mt-4">
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
        </div>
      </Modal>
    </div>
  );
}
