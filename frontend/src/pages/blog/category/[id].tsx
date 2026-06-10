// src/pages/blog/category/[id].tsx

import { Layout } from 'antd';
import { useParams } from 'react-router';

const { Content } = Layout;

export function BlogCategoryPage() {
  const params = useParams();
  const { id } = params;

  return (
    <Layout className="min-h-screen">
      <Content className="p-8">
        <h1>分类页面 - ID: {id}</h1>
        <p>该分类下的文章列表</p>
      </Content>
    </Layout>
  );
}