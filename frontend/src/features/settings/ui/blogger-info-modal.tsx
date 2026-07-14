// src/features/settings/ui/blogger-info-modal.tsx

import { useEffect } from 'react';
import { App, Avatar, Button, Form, Input, Modal, Upload } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';

import { useSettings, type UpdateBloggerInfoInput } from '../application/hooks';

interface BloggerInfoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (values: UpdateBloggerInfoInput) => void;
}

export function BloggerInfoModal({ open, onClose, onSuccess }: BloggerInfoModalProps) {
  const [form] = Form.useForm<UpdateBloggerInfoInput>();
  const { settings, updateBloggerInfo, updateBloggerInfoLoading } = useSettings({ skip: !open });
  const { message: messageApi } = App.useApp();

  useEffect(() => {
    if (open && settings?.bloggerInfo) {
      form.setFieldsValue({
        nickname: settings.bloggerInfo.nickname ?? '',
        bio: settings.bloggerInfo.bio ?? '',
        avatar: settings.bloggerInfo.avatar ?? '',
      });
    }
  }, [open, settings, form]);

  const handleAvatarUpload = async (file: File) => {
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
          form.setFieldsValue({ avatar: url });
          messageApi.success('头像上传成功');
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
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const success = await updateBloggerInfo(values);
      if (success) {
        onSuccess?.(values);
        messageApi.success('博主信息更新成功');
        onClose();
      } else {
        messageApi.error('更新失败，请重新登录后再试');
      }
    } catch (error) {
      if ((error as { errorFields?: unknown })?.errorFields) {
        return;
      }
      messageApi.error('更新失败，请重新登录后再试');
    }
  };

  return (
    <Modal
      title="修改博主信息"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={updateBloggerInfoLoading}
      okText="保存"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <div className="mt-4">
        <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
          <Input placeholder="博主昵称" />
        </Form.Item>
        <Form.Item label="头像">
          <div className="flex items-center gap-4">
            <Avatar
              size={64}
              src={form.getFieldValue('avatar')}
              icon={!form.getFieldValue('avatar') ? <UserOutlined /> : undefined}
            />
            <Upload beforeUpload={handleAvatarUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
          </div>
          <Form.Item name="avatar" noStyle>
            <Input type="hidden" />
          </Form.Item>
        </Form.Item>
        <Form.Item name="bio" label="个人简介">
          <Input.TextArea rows={4} placeholder="简单介绍自己" />
        </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
