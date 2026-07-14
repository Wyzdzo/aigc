// src/widgets/blog/CommentForm.tsx

import { useCallback, useState } from 'react';
import { App, Button, Form, Input, Space } from 'antd';
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
  const { message: messageApi } = App.useApp();

  const handleSubmit = useCallback(
    async (values: { nickname: string; email?: string; content: string }) => {
      setSubmitting(true);
      try {
        const result = await createComment({
          postId,
          parentId: parentId ?? undefined,
          nickname: values.nickname,
          email: values.email || '',
          content: values.content,
        });

        if (result === 'success') {
          form.resetFields();
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
    [postId, parentId, createComment, form, onSuccess, messageApi],
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
    <div className={parentId ? 'pl-8' : ''}>{formContent}</div>
  ) : (
    formContent
  );
}
