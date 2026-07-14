// src/pages/admin/posts/[id].tsx

import { useEffect, useState } from 'react';

import { App, Button, Card, Form, Input, Select, Space, Spin, Switch, Upload } from 'antd';
import { ArrowLeftOutlined, FolderOpenOutlined, SaveOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
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

import { PostEditor, MediaPicker } from '@/widgets/blog';
import { htmlToMarkdown } from '@/shared/lib/htmlToMarkdown';

export function AdminPostEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id && id !== 'new';
  const { message: messageApi } = App.useApp();

  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

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
      setContent(htmlToMarkdown(post.content));
      setCoverPreview(post.coverImage || '');
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
      messageApi.error('请输入文章标题');
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
        messageApi.success('文章更新成功');
      } else {
        await createPost(createInput);
        messageApi.success('文章创建成功');
        navigate('/admin/posts');
        return;
      }
    } catch (err) {
      console.error('保存文章失败:', err);
      const msg = err instanceof Error ? err.message : '保存失败，请重试';
      messageApi.error(msg);
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
      <div className="text-center py-6">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card
        title={<span className="text-lg font-medium">{isEdit ? '编辑文章' : '新建文章'}</span>}
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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* 左侧：标题 + 编辑器 */}
            <div className="flex flex-col gap-4">
              <Form.Item
                name="title"
                label="文章标题"
                rules={[{ required: true, message: '请输入文章标题' }]}
              >
                <Input placeholder="请输入文章标题" size="large" />
              </Form.Item>

              <div className="h-[calc(100vh-300px)] min-h-[500px] rounded-lg overflow-hidden">
                <PostEditor
                  value={content}
                  onChange={setContent}
                  placeholder="开始编写 Markdown 文章内容..."
                  autoSave={isEdit}
                  onSave={handleAutoSave}
                />
              </div>
            </div>

            {/* 右侧：元信息 */}
            <div className="flex flex-col gap-4">
              <Card title="基本信息" size="small">
                <Form.Item
                  name="slug"
                  label="文章链接"
                  rules={[{ pattern: /^[a-z0-9\u4e00-\u9fa5-]+$/, message: '链接只能包含小写字母、数字、中文和连字符' }]}
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

                <Form.Item label="封面图片">
                  <div className="flex flex-col gap-2">
                    {coverPreview && (
                      <img
                        src={coverPreview}
                        alt="封面预览"
                        className="max-h-[120px] rounded object-cover"
                      />
                    )}
                    <Space>
                      <Upload
                        beforeUpload={async (file) => {
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const token = localStorage.getItem('admin_token');
                            const response = await fetch('/api/media/upload', {
                              method: 'POST',
                              headers: token ? { Authorization: `Bearer ${token}` } : {},
                              body: formData,
                            });
                            if (response.ok) {
                              const result = await response.json();
                              const url = result.data?.url;
                              if (url) {
                                form.setFieldsValue({ coverImage: url });
                                setCoverPreview(url);
                                messageApi.success('封面上传成功');
                              } else {
                                messageApi.error('上传失败');
                              }
                            } else {
                              messageApi.error('上传失败');
                            }
                          } catch {
                            messageApi.error('上传失败');
                          }
                          return false;
                        }}
                        showUploadList={false}
                        accept="image/*"
                      >
                        <Button icon={<UploadOutlined />}>上传封面</Button>
                      </Upload>
                      <Button
                        icon={<FolderOpenOutlined />}
                        onClick={() => setMediaPickerOpen(true)}
                      >
                        从图片库选择
                      </Button>
                    </Space>
                  </div>
                  <Form.Item name="coverImage" noStyle>
                    <Input type="hidden" />
                  </Form.Item>
                </Form.Item>
              </Card>

              <Card title="分类" size="small">
                <Form.Item name="categoryId" label="所属分类">
                  <Select
                    placeholder="请选择分类"
                    loading={categoriesLoading}
                    className="w-full"
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
                  className="w-full"
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
                  <Select className="w-full">
                    <Select.Option value={PostStatus.DRAFT}>草稿</Select.Option>
                    <Select.Option value={PostStatus.PUBLISHED}>已发布</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="isTop" valuePropName="checked">
                  <Switch checkedChildren="置顶" unCheckedChildren="普通" />
                </Form.Item>
              </Card>

              <div className="flex gap-3">
                <Button
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

      <MediaPicker
        open={mediaPickerOpen}
        onCancel={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          form.setFieldsValue({ coverImage: url });
          setCoverPreview(url);
        }}
      />
    </div>
  );
}
