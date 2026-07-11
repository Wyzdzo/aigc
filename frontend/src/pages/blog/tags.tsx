// src/pages/blog/tags.tsx

import { TagsOutlined } from '@ant-design/icons';
import { Card, Empty, Spin, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router';

import { SeoMeta } from '@/widgets/seo';
import { useTags } from '@/features/blog';

import type { BlogTag } from '@/entities/blog';

const { Title, Text } = Typography;

const TAG_COLORS = [
  'blue', 'cyan', 'geekblue', 'purple', 'magenta',
  'volcano', 'orange', 'gold', 'green', 'lime',
];

function getTagColor(id: number): string {
  return TAG_COLORS[id % TAG_COLORS.length];
}

export function BlogTagsPage() {
  const { tags, loading, error } = useTags();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center py-10">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Empty
        description="加载失败，请稍后重试"
        className="mt-[100px]"
      />
    );
  }

  const handleTagClick = (tag: BlogTag) => {
    navigate(`/blog?tagId=${tag.id}`);
  };

  return (
    <>
      <SeoMeta title="文章标签 - AIGC Blog" description="按标签浏览技术博客文章" />

      <div className="max-w-[800px] mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <TagsOutlined className="text-2xl text-primary" />
            <Title level={2} className="mb-0">文章标签</Title>
          </div>
          <Text type="secondary">
            共 {tags.length} 个标签，点击标签浏览相关文章
          </Text>
        </div>

        {/* 标签云 */}
        {tags.length === 0 ? (
          <Empty description="暂无标签" />
        ) : (
          <Card
            style={{ borderRadius: 'var(--radius-card)' }}
            styles={{ body: { padding: 24 } }}
          >
            <div className="flex flex-wrap gap-3">
              {tags.map((tag: BlogTag) => (
                <Tag
                  key={tag.id}
                  color={getTagColor(tag.id)}
                  onClick={() => handleTagClick(tag)}
                  style={{ cursor: 'pointer', padding: '4px 14px', fontSize: 14 }}
                >
                  {tag.name}
                </Tag>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
