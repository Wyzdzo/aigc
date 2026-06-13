// src/app/layout/BlogLayout.tsx

import { Layout, Drawer, Button } from 'antd';
import type { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { MenuOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Header, Content, Footer } = Layout;

type BlogLayoutProps = {
  children?: ReactNode;
};

const navItems = [
  { label: '首页', path: '/blog' },
  { label: '分类', path: '/blog/categories' },
  { label: '标签', path: '/blog/tags' },
  { label: '归档', path: '/blog/archives' },
  { label: '关于', path: '/blog/about' },
];

export function BlogLayout({ children }: BlogLayoutProps = {}) {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 响应式通过 Tailwind CSS 类处理，此处保留空 effect 作为扩展点
  useEffect(() => {
    const handleResize = () => {
      // 响应式通过 Tailwind CSS 类处理
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/blog" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            AIGC Blog
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 移动端菜单按钮 */}
          <Button
            className="md:hidden"
            icon={<MenuOutlined />}
            onClick={() => setIsDrawerOpen(true)}
          />
        </div>
      </Header>

      {/* 移动端抽屉导航 */}
      <Drawer
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        className="md:hidden"
      >
        <div style={{ padding: 16 }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsDrawerOpen(false)}
              className={`block py-3 px-4 rounded-lg mb-2 ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Drawer>

      <Content className="max-w-6xl mx-auto w-full py-8 px-4">
        {children ?? <Outlet />}
      </Content>

      <Footer className="bg-gray-50 border-t py-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          © 2024 AIGC Blog. All rights reserved.
        </div>
      </Footer>
    </Layout>
  );
}