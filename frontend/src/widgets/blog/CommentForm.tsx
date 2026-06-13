import { useCallback, useState } from 'react';
import { Button, Form, Input, Space } from 'antd';
import type { ReactNode } from 'react';

import { useCreateComment } from '@/features/blog';

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
  const { createComment } = useCreateComment();

  const handleSubmit = useCallback(
    async (values: { nickname: string; email?: string; content: string }) => {
      setSubmitting(true);
      try {
        const success = await createComment({
          postId,
          parentId: parentId ?? undefined,
          nickname: values.nickname,
          email: values.email || '',
          content: values.content,
        });

        if (success) {
          form.resetFields();
          onSuccess?.();
        }
      } finally {
        setSubmitting(false);
      }
    },
    [postId, parentId, createComment, form, onSuccess],
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
      <Space.Compact block style={compact ? { width: '100%' } : { width: '100%', maxWidth: 400 }}>
        <Form.Item
          name="nickname"
          rules={[
            { required: true, message: '请输入昵称' },
            { min: 2, max: 20, message: '昵称长度在 2-20 个字符' },
          ]}
          style={{ flex: 1 }}
        >
          <Input placeholder="昵称" maxLength={20} />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
          style={{ flex: 1 }}
        >
          <Input placeholder="邮箱（选填）" />
        </Form.Item>
      </Space.Compact>
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
      <Space>
        <Button type="primary" htmlType="submit" loading={submitting}>
          发布评论
        </Button>
        {showCancel && (
          <Button onClick={handleCancel}>取消</Button>
        )}
      </Space>
    </Form>
  );

  return compact ? (
    <div style={{ paddingLeft: parentId ? 32 : 0 }}>{formContent}</div>
  ) : (
    formContent
  );
}
