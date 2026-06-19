// src/pages/login.tsx

import { Button, Card, Form, Input } from 'antd';
import { useNavigate } from 'react-router';

import { useAuth } from '@/features/auth';

/**
 * 登录页面
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string }) => {
    const success = await login({
      loginName: values.username,
      loginPassword: values.password,
    });

    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <Card title="管理员登录">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item>
              <Button block htmlType="submit" loading={loading} type="primary">
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}