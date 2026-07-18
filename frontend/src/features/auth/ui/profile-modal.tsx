// src/features/auth/ui/profile-modal.tsx

import { useEffect } from 'react';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Form, Input, Modal, Upload } from 'antd';

import { TOKEN_KEY } from '@/shared/graphql/auth-constants';

import { useAuth } from '../application/hooks/useAuth';
import { type UpdateUserInfoInput,useUpdateUserInfo } from '../application/hooks/useUpdateUserInfo';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const [form] = Form.useForm<UpdateUserInfoInput>();
  const { user, updateUser } = useAuth();
  const { updateUserInfo, loading } = useUpdateUserInfo();
  const { message: messageApi } = App.useApp();

  // 打开时初始化表单
  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        nickname: user.nickname ?? '',
        avatarUrl: user.avatarUrl ?? '',
        signature: '',
      });
    }
  }, [open, user, form]);

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const url = result.data?.url;
        if (url) {
          form.setFieldsValue({ avatarUrl: url });
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
      const success = await updateUserInfo(values);
      if (success) {
        // 更新 auth context 中的用户信息
        if (values.avatarUrl !== undefined) updateUser({ avatarUrl: values.avatarUrl });
        if (values.nickname) updateUser({ nickname: values.nickname });
        messageApi.success('个人信息更新成功');
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
      title="个人资料"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      okText="保存"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <div className="mt-4">
          <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item label="头像">
            <div className="flex items-center gap-4">
              <Avatar
                size={64}
                src={form.getFieldValue('avatarUrl')}
                icon={!form.getFieldValue('avatarUrl') ? <UserOutlined /> : undefined}
              />
              <Upload beforeUpload={handleAvatarUpload} showUploadList={false}>
                <Button icon={<UploadOutlined />}>上传头像</Button>
              </Upload>
            </div>
            <Form.Item name="avatarUrl" noStyle>
              <Input type="hidden" />
            </Form.Item>
          </Form.Item>
          <Form.Item name="signature" label="个性签名">
            <Input.TextArea rows={3} placeholder="简单介绍自己" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
