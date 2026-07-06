// src/pages/admin/categories/index.tsx

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
  Tree,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RestOutlined,
} from '@ant-design/icons';
interface TreeNodeNormal {
  title: React.ReactNode;
  key: string;
  children?: TreeNodeNormal[];
}

import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/features/blog';
import type { BlogCategory } from '@/entities/blog';

export function AdminCategoriesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [form] = Form.useForm();

  const { categories, loading, refetch } = useCategories();
  const { createCategory, loading: creating } = useCreateCategory();
  const { updateCategory, loading: updating } = useUpdateCategory();
  const { deleteCategory, loading: deleting } = useDeleteCategory();

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId,
      sortOrder: category.sortOrder,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (category: BlogCategory) => {
    try {
      await deleteCategory(category.id);
      message.success('删除成功');
      await refetch();
    } catch {
      message.error('删除失败，请重试');
    }
  };

  const cleanFormValues = (values: Record<string, unknown>) => {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(values)) {
      if (value === '' || value === undefined || value === null) {
        continue;
      }
      cleaned[key] = value;
    }
    return cleaned;
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const cleaned = cleanFormValues(values);
        if (editingCategory) {
          await updateCategory({
            id: editingCategory.id,
            ...cleaned,
          });
          message.success('更新成功');
        } else {
          await createCategory(cleaned as Parameters<typeof createCategory>[0]);
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

  const buildTreeData = (
    categories: BlogCategory[],
    parentId: number | null = null,
  ): TreeNodeNormal[] => {
    return categories
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        title: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>{category.name}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(category)}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定删除这个分类吗？"
                onConfirm={() => handleDelete(category)}
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
          </div>
        ),
        key: String(category.id),
        children: buildTreeData(categories, category.id),
      }));
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="分类管理"
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增分类
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
        ) : categories.length === 0 ? (
          <Empty description="暂无分类" />
        ) : (
          <Tree
            showLine
            defaultExpandAll
            treeData={buildTreeData(categories)}
          />
        )}
      </Card>

      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={creating || updating}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="slug"
            label="分类别名"
            rules={[{ required: true, message: '请输入分类别名' }]}
          >
            <Input placeholder="请输入分类别名" />
          </Form.Item>
          <Form.Item name="description" label="分类描述">
            <Input.TextArea placeholder="请输入分类描述" rows={3} />
          </Form.Item>
          <Form.Item name="parentId" label="父分类ID">
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="请输入父分类ID（可选）"
            />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序顺序" initialValue={0}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="请输入排序顺序"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
