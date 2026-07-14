// src/features/settings/ui/password-modal.tsx

import { App, Form, Input, Modal } from 'antd';

import { useSettings } from '../application/hooks';

interface PasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function PasswordModal({ open, onClose }: PasswordModalProps) {
  const [form] = Form.useForm<{ oldPassword: string; newPassword: string; confirmPassword: string }>();
  const { updatePassword, updatePasswordLoading } = useSettings({ skip: !open });
  const { message: messageApi } = App.useApp();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const success = await updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      if (success) {
        messageApi.success('密码修改成功');
        form.resetFields();
        onClose();
      } else {
        messageApi.error('密码修改失败，请重试');
      }
    } catch (error) {
      if ((error as { errorFields?: unknown })?.errorFields) {
        return;
      }
      messageApi.error('密码修改失败，请重试');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="修改密码"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={updatePasswordLoading}
      okText="确认修改"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <div className="mt-4">
        <Form.Item name="oldPassword" label="当前密码" rules={[{ required: true, message: '请输入当前密码' }]}>
          <Input.Password placeholder="输入当前密码" />
        </Form.Item>
        <Form.Item name="newPassword" label="新密码" rules={[
          { required: true, message: '请输入新密码' },
          { min: 8, message: '密码至少8个字符' },
        ]}>
          <Input.Password placeholder="输入新密码" />
        </Form.Item>
        <Form.Item name="confirmPassword" label="确认新密码" dependencies={['newPassword']} rules={[
          { required: true, message: '请确认新密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}>
          <Input.Password placeholder="再次输入新密码" />
        </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
