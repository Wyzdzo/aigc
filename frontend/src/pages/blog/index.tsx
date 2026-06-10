// src/pages/blog/index.tsx

import { Layout } from 'antd';

const { Content } = Layout;

export function BlogHomePage() {
  return (
    <Layout className="min-h-screen">
      <Content className="p-8">
        <h1>博客首页</h1>
        <p>文章列表展示区域</p>
      </Content>
    </Layout>
  );
}