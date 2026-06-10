// src/pages/blog/[slug].tsx

import { Layout } from 'antd';
import { useParams } from 'react-router';

const { Content } = Layout;

export function BlogDetailPage() {
  const params = useParams();
  const { slug } = params;

  return (
    <Layout className="min-h-screen">
      <Content className="p-8">
        <h1>文章详情 - {slug}</h1>
        <p>文章内容展示区域</p>
      </Content>
    </Layout>
  );
}