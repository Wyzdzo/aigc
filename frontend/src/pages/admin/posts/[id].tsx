// src/pages/admin/posts/[id].tsx

import { useEffect, useState } from 'react';

import { Button, Card, Form, Input, message, Select, Spin, Switch } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';

import {
  PostStatus,
  useCategories,
  useCreatePost,
  usePost,
  useTags,
  useUpdatePost,
} from '@/features/blog';
import type { BlogCategory, BlogTag, CreateBlogPostInput } from '@/entities/blog';

import { PostEditor } from '@/widgets/blog';

export function AdminPostEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id && id !== 'new';

  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const { post, loading: postLoading } = usePost(isEdit ? Number(id) : undefined);
  const { categories, loading: categoriesLoading } = useCategories();
  const { tags, loading: tagsLoading } = useTags();
  const { createPost, loading: creating } = useCreatePost();
  const { updatePost, loading: updating } = useUpdatePost();

  useEffect(() => {
    if (post && isEdit) {
      form.setFieldsValue({
        title: post.title,
        slug: post.slug,
        summary: post.summary || '',
        coverImage: post.coverImage || '',
        status: post.status,
        isTop: post.isTop,
        categoryId: post.categoryId,
      });
      setContent(post.content);
    }
  }, [post, isEdit, form]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSave = async (values: {
    title?: string;
    slug?: string;
    summary?: string;
    coverImage?: string;
    status?: PostStatus;
    isTop?: boolean;
    categoryId?: number;
  }) => {
    if (!values.title?.trim()) {
      message.error('请输入文章标题');
      return;
    }

    const createInput: CreateBlogPostInput = {
      title: values.title.trim(),
      slug: (values.slug?.trim() || generateSlug(values.title)) || '',
      content,
      summary: values.summary?.trim() || undefined,
      coverImage: values.coverImage?.trim() || undefined,
      status: values.status || PostStatus.DRAFT,
      isTop: values.isTop || false,
      categoryId: values.categoryId || undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    };

    try {
      if (isEdit && id) {
        await updatePost(Number(id), createInput);
        message.success('文章更新成功');
      } else {
        await createPost(createInput);
        message.success('文章创建成功');
        navigate('/admin/posts');
        return;
      }
    } catch (err) {
      console.error('保存文章失败:', err);
      const msg = err instanceof Error ? err.message : '保存失败，请重试';
      message.error(msg);
    }
  };

  const handleAutoSave = () => {
    form.validateFields().then(async (values: {
      title?: string;
      slug?: string;
      summary?: string;
      coverImage?: string;
      isTop?: boolean;
      categoryId?: number;
    }) => {
      if (!values.title?.trim()) return;

      const autoSaveInput: CreateBlogPostInput = {
        title: values.title.trim(),
        slug: (values.slug?.trim() || generateSlug(values.title)) || '',
        content,
        summary: values.summary?.trim() || undefined,
        coverImage: values.coverImage?.trim() || undefined,
        status: PostStatus.DRAFT,
        isTop: values.isTop || false,
        categoryId: values.categoryId || undefined,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      };

      try {
        if (isEdit && id) {
          await updatePost(Number(id), autoSaveInput);
        } else {
          const result = await createPost(autoSaveInput);
          if (result) {
            navigate(`/admin/posts/${result.id}`);
          }
        }
      } catch {
        // 自动保存失败不显示错误提示
      }
    });
  };

  if (isEdit && postLoading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={isEdit ? '编辑文章' : '新建文章'}
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/posts')}
          >
            返回列表
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: isEdit ? post?.status : PostStatus.DRAFT,
            isTop: isEdit ? post?.isTop : false,
          }}
          onFinish={handleSave}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Form.Item
                name="title"
                label="文章标题"
                rules={[{ required: true, message: '请输入文章标题' }]}
              >
                <Input placeholder="请输入文章标题" size="large" />
              </Form.Item>

              <div style={{ height: 'calc(100vh - 300px)', minHeight: '500px', border: '1px solid var(--ant-color-border-secondary, #f0f0f0)', borderRadius: 4, overflow: 'hidden' }}>
                <PostEditor
                  value={content}
                  onChange={setContent}
                  placeholder="开始编写文章内容..."
                  autoSave={isEdit}
                  onSave={handleAutoSave}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card title="基本信息" size="small">
                <Form.Item
                  name="slug"
                  label="文章链接"
                  rules={[{ pattern: /^[a-z0-9\u4e00-\u9fa5\-]+$/, message: '链接只能包含小写字母、数字、中文和连字符' }]}
                >
                  <Input
                    placeholder="自动生成"
                    suffix={
                      isEdit && post ? (
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        />
                      ) : null
                    }
                  />
                </Form.Item>

                <Form.Item name="summary" label="文章摘要">
                  <Input.TextArea rows={3} placeholder="简要描述文章内容" />
                </Form.Item>

                <Form.Item name="coverImage" label="封面图片">
                  <Input placeholder="输入图片URL" />
                </Form.Item>
              </Card>

              <Card title="分类" size="small">
                <Form.Item name="categoryId" label="所属分类">
                  <Select
                    placeholder="请选择分类"
                    loading={categoriesLoading}
                    style={{ width: '100%' }}
                  >
                    {categories.map((category: BlogCategory) => (
                      <Select.Option key={category.id} value={category.id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Card>

              <Card title="标签" size="small">
                <Select
                  mode="multiple"
                  placeholder="请选择标签"
                  loading={tagsLoading}
                  style={{ width: '100%' }}
                  value={selectedTagIds}
                  onChange={setSelectedTagIds}
                >
                  {tags.map((tag: BlogTag) => (
                    <Select.Option key={tag.id} value={tag.id}>
                      {tag.name}
                    </Select.Option>
                  ))}
                </Select>
              </Card>

              <Card title="状态设置" size="small">
                <Form.Item name="status" label="文章状态">
                  <Select style={{ width: '100%' }}>
                    <Select.Option value={PostStatus.DRAFT}>草稿</Select.Option>
                    <Select.Option value={PostStatus.PUBLISHED}>已发布</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="isTop" valuePropName="checked">
                  <Switch checkedChildren="置顶" unCheckedChildren="普通" />
                </Form.Item>
              </Card>

              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  type="default"
                  size="large"
                  onClick={() => navigate('/admin/posts')}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={creating || updating}
                  icon={<SaveOutlined />}
                >
                  {isEdit ? '更新文章' : '创建文章'}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
}