// src/app/layout/BlogLayout.tsx

import { Layout } from 'antd';
import type { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

const { Header, Content, Footer } = Layout;

type BlogLayoutProps = {
  children?: ReactNode;
};

const navItems = [
  { label: '首页', path: '/blog' },
  { label: '分类', path: '/blog/categories' },
  { label: '标签', path: '/blog/tags' },
  { label: '关于', path: '/blog/about' },
];

export function BlogLayout({ children }: BlogLayoutProps = {}) {
  const location = useLocation();

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/blog" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            AIGC Blog
          </Link>
          <nav className="flex gap-6">
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
        </div>
      </Header>

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