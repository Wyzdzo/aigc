// src/app/layout/app-layout.tsx

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LockOutlined,
  LogoutOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Form, Input, Modal, Segmented, Tabs, Tooltip, message } from 'antd';
import type { ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

import { useAuth } from '@/features/auth';
import { useSettings, type UpdateBloggerInfoInput } from '@/features/settings';
import { getNavigationItems } from '@/app/navigation';
import { FONT_SCALE_OPTIONS, useTheme } from '@/app/providers';
import { APP_THEME_CSS_VAR_KEY } from '@/app/theme';

import { AigcSidecar } from '@/widgets/aigc-sidecar';

import type { AssistantRouteCandidate } from '@/entities/assistant-session';

import { EntryAccentGlyph } from './entry-accent-glyph';

function toRouteCandidate(
  item: ReturnType<typeof getNavigationItems>[number],
): AssistantRouteCandidate {
  return {
    description: item.description,
    id: item.id,
    label: item.label,
    path: item.path,
    tags: item.tags,
  };
}

function resolveActiveNavigationPath(
  pathname: string,
  items: ReturnType<typeof getNavigationItems>,
) {
  return items.find((item) => item.path === pathname)?.path;
}

type AppLayoutProps = {
  children?: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps = {}) {
  const [isSidecarOpen, setIsSidecarOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const wasSidecarOpenRef = useRef(isSidecarOpen);
  const [showShortcutHint, setShowShortcutHint] = useState(() =>
    typeof document === 'undefined'
      ? false
      : document.hasFocus() && document.visibilityState === 'visible',
  );
  const { fontScale, isDark, setFontScale, setIsDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navigationItems = useMemo(() => getNavigationItems(), []);
  const activeNavigationPath = resolveActiveNavigationPath(location.pathname, navigationItems);
  const navigationTabs = useMemo(
    () => navigationItems.map((item) => ({ key: item.path, label: item.label })),
    [navigationItems],
  );
  const routeCandidates = useMemo(
    () => navigationItems.map((item) => toRouteCandidate(item)),
    [navigationItems],
  );

  const { isAuthenticated, user, logout } = useAuth();
  const { settings, updateBloggerInfo, updateBloggerInfoLoading, updatePassword, updatePasswordLoading } = useSettings({ skip: !isAuthenticated });
  const [bloggerModalOpen, setBloggerModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [bloggerForm] = Form.useForm<UpdateBloggerInfoInput>();
  const [passwordForm] = Form.useForm<{ oldPassword: string; newPassword: string; confirmPassword: string }>();

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
      message.error('更新失败，请重试');
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
    { key: 'blog', icon: <></>, label: '前往博客', onClick: () => navigate('/blog') },
    { key: 'admin', icon: <SettingOutlined />, label: '后台管理', onClick: () => navigate('/admin') },
    { key: 'blogger', icon: <UserOutlined />, label: '修改博主信息', onClick: handleOpenBloggerModal },
    { key: 'password', icon: <LockOutlined />, label: '修改密码', onClick: () => setPasswordModalOpen(true) },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true, onClick: handleLogout },
  ];

  useEffect(() => {
    if (wasSidecarOpenRef.current && !isSidecarOpen) {
      triggerRef.current?.focus();
    }

    wasSidecarOpenRef.current = isSidecarOpen;
  }, [isSidecarOpen]);

  useEffect(() => {
    function syncPageFocus() {
      setShowShortcutHint(document.hasFocus() && document.visibilityState === 'visible');
    }

    syncPageFocus();
    window.addEventListener('focus', syncPageFocus);
    window.addEventListener('blur', syncPageFocus);
    document.addEventListener('visibilitychange', syncPageFocus);

    return () => {
      window.removeEventListener('focus', syncPageFocus);
      window.removeEventListener('blur', syncPageFocus);
      document.removeEventListener('visibilitychange', syncPageFocus);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSidecarOpen((previousValue) => !previousValue);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`app-shell ${APP_THEME_CSS_VAR_KEY}`}>
      <header className="app-header">
        <div className="flex min-w-0 items-center">
          <img alt="" className="brand-logo" src="/logo.svg" />
        </div>

        <nav aria-label="主导航" className="app-nav">
          <Tabs
            activeKey={activeNavigationPath}
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

          {isAuthenticated && user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md">
                <Avatar size="small" src={user.avatarUrl} icon={!user.avatarUrl ? <UserOutlined /> : undefined} />
                <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">{user.nickname}</span>
              </div>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button type="primary" size="small" icon={<UserOutlined />}>
                登录
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="app-main">{children ?? <Outlet />}</main>

      {!isSidecarOpen ? (
        <div className="entry-trigger-shell" data-entry-open="false">
          <Button
            ref={triggerRef}
            aria-keyshortcuts="Alt+K"
            shape="round"
            size="large"
            type="primary"
            onClick={() => setIsSidecarOpen(true)}
          >
            <div className="flex items-center gap-2">
              <EntryAccentGlyph inverse />
              <span>AI</span>
              {showShortcutHint ? <span className="entry-trigger-shortcut">Alt+K</span> : null}
            </div>
          </Button>
        </div>
      ) : null}

      <AigcSidecar
        onClose={() => setIsSidecarOpen(false)}
        onNavigate={(path) => {
          navigate(path);
          setIsSidecarOpen(false);
        }}
        open={isSidecarOpen}
        routeCandidates={routeCandidates}
      />

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
