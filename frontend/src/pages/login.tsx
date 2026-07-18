// src/pages/login.tsx

import { Button, Card, Form, Input } from 'antd';
import { useNavigate } from 'react-router';

import { useAuth } from '@/features/auth';

import { USER_KEY } from '@/shared/graphql/auth-constants';

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
      // login 成功后 user 状态已更新，从 localStorage 读取最新值判断角色
      let userIsAdmin = false;
      try {
        const stored = localStorage.getItem(USER_KEY);
        const userInfo = stored ? JSON.parse(stored) : null;
        userIsAdmin = userInfo?.accessGroup?.some((role: string) => role.toLowerCase() === 'admin') ?? false;
      } catch {
        // JSON.parse 失败时默认跳转前台
      }
      navigate(userIsAdmin ? '/admin' : '/blog');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-layout">
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