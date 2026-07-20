// src/widgets/blog/CommentForm.tsx

import { useCallback, useState } from 'react';
import { App, Avatar, Button, Form, Input, Space } from 'antd';
import { PictureOutlined, UserOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

import { useAuth } from '@/features/auth';
import { useCreateComment } from '@/features/blog';

import { MediaPicker } from './MediaPicker';

const { TextArea } = Input;

export interface CommentFormProps {
  postId: number;
  parentId?: number | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  showCancel?: boolean;
  compact?: boolean;
}

/**
 * 评论表单组件
 */
export function CommentForm({
  postId,
  parentId,
  onSuccess,
  onCancel,
  placeholder = '写下你的评论...',
  showCancel = false,
  compact = false,
}: CommentFormProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const { createComment } = useCreateComment();
  const { message: messageApi } = App.useApp();
  const { isAuthenticated, user } = useAuth();

  const handleMediaSelect = useCallback((url: string, name: string) => {
    const currentContent = form.getFieldValue('content') || '';
    const imgMd = `![${name}](${url})`;
    form.setFieldsValue({ content: currentContent + imgMd });
  }, [form]);

  const handleSubmit = useCallback(
    async (values: { content: string; nickname?: string; email?: string }) => {
      setSubmitting(true);
      try {
        // 已登录用户使用账号信息，未登录用户使用表单输入
        const nickname = isAuthenticated && user ? user.nickname : (values.nickname ?? '');
        const email = isAuthenticated && user ? user.email : (values.email || '');
        const avatar = isAuthenticated && user ? user.avatarUrl : null;

        const result = await createComment({
          postId,
          parentId: parentId ?? undefined,
          nickname,
          email,
          avatar,
          content: values.content,
        });

        if (result === 'success') {
          form.resetFields(['content']);
          onSuccess?.();
          messageApi.success('评论发布成功');
        } else if (result === 'duplicate') {
          messageApi.info('请勿重复提交');
        } else {
          messageApi.error('评论发布失败，请稍后重试');
        }
      } finally {
        setSubmitting(false);
      }
    },
    [postId, parentId, createComment, form, onSuccess, messageApi, isAuthenticated, user],
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel?.();
  }, [form, onCancel]);

  const formContent: ReactNode = (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      size={compact ? 'small' : 'middle'}
    >
      <div className="w-full">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 mb-4">
            <Avatar size="small" src={user.avatarUrl} icon={!user.avatarUrl ? <UserOutlined /> : undefined} />
            <span className="text-text-secondary">{user.nickname}</span>
          </div>
        ) : (
          <Space.Compact block>
            <div className="flex-1">
              <Form.Item
                name="nickname"
                rules={[
                  { required: true, message: '请输入昵称' },
                  { min: 2, max: 20, message: '昵称长度在 2-20 个字符' },
                ]}
              >
                <Input placeholder="昵称" maxLength={20} />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                name="email"
                rules={[
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input placeholder="邮箱（选填）" />
              </Form.Item>
            </div>
          </Space.Compact>
        )}
      </div>
      <Form.Item
        name="content"
        rules={[
          { required: true, message: '请输入评论内容' },
          { min: 5, message: '评论内容至少 5 个字符' },
          { max: 2000, message: '评论内容最多 2000 个字符' },
        ]}
      >
        <TextArea
          placeholder={placeholder}
          rows={compact ? 3 : 4}
          maxLength={2000}
          showCount={!compact}
        />
      </Form.Item>
      <div className="flex items-center justify-between">
        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            发布评论
          </Button>
          {showCancel && (
            <Button onClick={handleCancel}>取消</Button>
          )}
        </Space>
        {isAuthenticated && (
          <Button
            type="text"
            icon={<PictureOutlined />}
            onClick={() => setMediaPickerOpen(true)}
            size="small"
          >
            插入图片
          </Button>
        )}
      </div>
    </Form>
  );

  return (
    <>
      {compact ? (
        <div className={parentId ? 'pl-8' : ''}>{formContent}</div>
      ) : (
        formContent
      )}
      <MediaPicker
        open={mediaPickerOpen}
        onCancel={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
    </>
  );
}
