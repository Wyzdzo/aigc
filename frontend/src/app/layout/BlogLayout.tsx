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
import { Avatar, Button, Drawer, Dropdown, Segmented, Tabs, Tooltip } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

import { FONT_SCALE_OPTIONS, useTheme } from '@/app/providers';
import { APP_THEME_CSS_VAR_KEY } from '@/app/theme';

import { ProfileModal, useAuth } from '@/features/auth';
import { BloggerInfoModal, PasswordModal } from '@/features/settings';

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
  const { isAuthenticated, user, logout, updateUser, isAdmin } = useAuth();

  const [bloggerModalOpen, setBloggerModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

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

  const userIsAdmin = isAdmin();

  const userMenuItems = [
    ...(userIsAdmin
      ? [{
          key: 'blogger',
          icon: <UserOutlined />,
          label: '修改博主信息',
          onClick: () => setBloggerModalOpen(true),
        }]
      : [{
          key: 'profile',
          icon: <UserOutlined />,
          label: '个人资料',
          onClick: () => setProfileModalOpen(true),
        }]),
    {
      key: 'password',
      icon: <LockOutlined />,
      label: '修改密码',
      onClick: () => setPasswordModalOpen(true),
    },
    ...(userIsAdmin
      ? [{
          key: 'admin',
          icon: <SettingOutlined />,
          label: '后台管理',
          onClick: () => navigate('/admin'),
        }]
      : []),
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

      {/* 修改博主信息弹窗（仅 admin） */}
      <BloggerInfoModal open={bloggerModalOpen} onClose={() => setBloggerModalOpen(false)} onSuccess={(values) => { if (values.avatar) updateUser({ avatarUrl: values.avatar }); if (values.nickname) updateUser({ nickname: values.nickname }); }} />

      {/* 个人资料弹窗（非 admin 用户） */}
      <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />

      {/* 修改密码弹窗 */}
      <PasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </div>
  );
}
