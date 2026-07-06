// src/app/layout/BlogLayout.tsx

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Drawer, Dropdown, Form, Input, Modal, Segmented, Tabs, Tooltip, message } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

import { useAuth } from '@/features/auth';
import { useSettings, type UpdateBloggerInfoInput } from '@/features/settings';
import { FONT_SCALE_OPTIONS, useTheme } from '@/app/providers';
import { APP_THEME_CSS_VAR_KEY } from '@/app/theme';

const navItems = [
  { label: '首页', path: '/blog' },
  { label: '分类', path: '/blog/categories' },
  { label: '标签', path: '/blog/tags' },
  { label: '归档', path: '/blog/archives' },
  { label: '友链', path: '/blog/links' },
  { label: '留言板', path: '/blog/guestbook' },
  { label: '关于', path: '/blog/about' },
];

type BlogLayoutProps = {
  children?: ReactNode;
};

export function BlogLayout({ children }: BlogLayoutProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { fontScale, isDark, setFontScale, setIsDark } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { settings, updateBloggerInfo, updateBloggerInfoLoading, updatePassword, updatePasswordLoading } = useSettings({ skip: !isAuthenticated });

  const [bloggerModalOpen, setBloggerModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [bloggerForm] = Form.useForm<UpdateBloggerInfoInput>();
  const [passwordForm] = Form.useForm<{ oldPassword: string; newPassword: string; confirmPassword: string }>();

  const navigationTabs = useMemo(
    () => navItems.map((item) => ({ key: item.path, label: item.label })),
    [],
  );

  const activeKey = navItems.find((item) => item.path === location.pathname)?.path ?? location.pathname;

  useEffect(() => {
    const handleResize = () => {
      // 响应式通过 CSS 处理
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenBloggerModal = () => {
    if (settings?.bloggerInfo) {
      bloggerForm.setFieldsValue({
        nickname: settings.bloggerInfo.nickname ?? '',
        bio: settings.bloggerInfo.bio ?? '',
        avatar: settings.bloggerInfo.avatar ?? '',
      });
    }
    setBloggerModalOpen(true);
  };

  const handleBloggerSubmit = async () => {
    try {
      const values = await bloggerForm.validateFields();
      const success = await updateBloggerInfo(values);
      if (success) {
        message.success('博主信息更新成功');
        setBloggerModalOpen(false);
      } else {
        message.error('更新失败，请重试');
      }
    } catch (error) {
      if ((error as { errorFields?: unknown })?.errorFields) {
        return; // 表单验证失败，由 Ant Design 自动提示
      }
      console.error('updateBloggerInfo error:', error);
      const gqlMsg = (error as { graphQLErrors?: { message: string }[] })?.graphQLErrors?.[0]?.message;
      message.error(gqlMsg || '更新失败，请重试');
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields();
      const success = await updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      if (success) {
        message.success('密码修改成功');
        setPasswordModalOpen(false);
        passwordForm.resetFields();
      } else {
        message.error('密码修改失败，请重试');
      }
    } catch (error) {
      if ((error as { errorFields?: unknown })?.errorFields) {
        return; // 表单验证失败，由 Ant Design 自动提示
      }
      message.error('密码修改失败，请重试');
    }
  };

  const userMenuItems = [
    {
      key: 'blogger',
      icon: <UserOutlined />,
      label: '修改博主信息',
      onClick: handleOpenBloggerModal,
    },
    {
      key: 'password',
      icon: <LockOutlined />,
      label: '修改密码',
      onClick: () => setPasswordModalOpen(true),
    },
    {
      key: 'admin',
      icon: <SettingOutlined />,
      label: '后台管理',
      onClick: () => navigate('/admin'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className={`app-shell ${APP_THEME_CSS_VAR_KEY}`}>
      <header className="app-header">
        <div className="flex min-w-0 items-center gap-2">
          <Tooltip title="返回工作台">
            <Link to="/">
              <Button type="text" icon={<HomeOutlined />} shape="circle" />
            </Link>
          </Tooltip>
          <Link to="/blog" className="brand-title">
            AIGC Blog
          </Link>
        </div>

        <nav aria-label="博客导航" className="app-nav">
          <Tabs
            activeKey={activeKey}
            items={navigationTabs}
            onChange={(path) => navigate(path)}
            size="small"
            tabBarGutter={32}
          />
        </nav>

        <div className="app-header-actions">
          <div className="app-appearance-controls">
            <div className="app-font-scale-control">
              <Segmented
                onChange={(value) => {
                  if (value === 'compact' || value === 'standard' || value === 'comfortable') {
                    setFontScale(value);
                  }
                }}
                options={FONT_SCALE_OPTIONS}
                size="small"
                value={fontScale}
              />
            </div>
            <Tooltip title={isDark ? '切换浅色模式' : '切换深色模式'}>
              <span className="app-color-scheme-control">
                <Button
                  aria-label={isDark ? '切换浅色模式' : '切换深色模式'}
                  icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                  shape="circle"
                  type="text"
                  onClick={() => setIsDark((previousValue) => !previousValue)}
                />
              </span>
            </Tooltip>
          </div>

          {/* 用户下拉菜单 */}
          {isAuthenticated && user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md">
                <Avatar
                  size="small"
                  src={user.avatarUrl}
                  icon={!user.avatarUrl ? <UserOutlined /> : undefined}
                />
                <span className="hidden sm:inline max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">{user.nickname}</span>
              </div>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button type="primary" size="small" icon={<UserOutlined />}>
                登录
              </Button>
            </Link>
          )}

          {/* 移动端菜单按钮 */}
          <div className="blog-mobile-menu-btn">
            <Button
              icon={<MenuOutlined />}
              onClick={() => setIsDrawerOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* 移动端抽屉导航 */}
      <Drawer
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <div className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsDrawerOpen(false)}
              className={`block py-3 px-4 rounded-lg mb-2 ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-text-secondary hover:bg-fill-secondary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Drawer>

      <main className="app-main">{children ?? <Outlet />}</main>

      <footer className="blog-footer">
        <div className="blog-footer-inner">
          © {new Date().getFullYear()} AIGC Blog. All rights reserved.
        </div>
      </footer>

      {/* 修改博主信息弹窗 */}
      <Modal
        title="修改博主信息"
        open={bloggerModalOpen}
        onOk={handleBloggerSubmit}
        onCancel={() => setBloggerModalOpen(false)}
        confirmLoading={updateBloggerInfoLoading}
        okText="保存"
        cancelText="取消"
      >
        <Form form={bloggerForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="博主昵称" />
          </Form.Item>
          <Form.Item name="avatar" label="头像URL">
            <Input placeholder="头像图片地址" />
          </Form.Item>
          <Form.Item name="bio" label="个人简介">
            <Input.TextArea rows={4} placeholder="简单介绍自己" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalOpen}
        onOk={handlePasswordSubmit}
        onCancel={() => {
          setPasswordModalOpen(false);
          passwordForm.resetFields();
        }}
        confirmLoading={updatePasswordLoading}
        okText="确认修改"
        cancelText="取消"
      >
        <Form form={passwordForm} layout="vertical" style={{ marginTop: 16 }}>
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
        </Form>
      </Modal>
    </div>
  );
}
