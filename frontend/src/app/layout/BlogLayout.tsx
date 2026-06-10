// src/app/layout/BlogLayout.tsx

import { Layout } from 'antd';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router';

const { Header, Content, Footer } = Layout;

type BlogLayoutProps = {
  children?: ReactNode;
};

export function BlogLayout({ children }: BlogLayoutProps = {}) {
  return (
    <Layout className="min-h-screen">
      <Header className="bg-white border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">AIGC Blog</h1>
          <nav className="flex gap-6">
            <a href="/blog" className="text-gray-600 hover:text-gray-900">首页</a>
            <a href="/blog/categories" className="text-gray-600 hover:text-gray-900">分类</a>
            <a href="/blog/tags" className="text-gray-600 hover:text-gray-900">标签</a>
            <a href="/blog/about" className="text-gray-600 hover:text-gray-900">关于</a>
          </nav>
        </div>
      </Header>

      <Content className="max-w-6xl mx-auto w-full py-8">
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