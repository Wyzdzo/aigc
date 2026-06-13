// src/widgets/blog/TagCloud.tsx

import { Tag } from 'antd';

import { useTags } from '@/features/blog';

import type { BlogTag } from '@/entities/blog';

export interface TagCloudProps {
  selectedId?: number;
  onChange: (tagId: number | undefined) => void;
}

export function TagCloud({ selectedId, onChange }: TagCloudProps) {
  const { tags, loading } = useTags();

  if (loading) {
    return <div style={{ padding: 16 }}>加载中...</div>;
  }

  const getTagColor = (index: number): string => {
    const colors = ['blue', 'cyan', 'green', 'magenta', 'orange', 'purple', 'red', 'gold'];
    return colors[index % colors.length];
  };

  const handleTagClick = (tag: BlogTag) => {
    if (selectedId === tag.id) {
      onChange(undefined);
    } else {
      onChange(tag.id);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>标签云</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {tags.map((tag, index) => (
          <Tag
            key={tag.id}
            color={selectedId === tag.id ? 'primary' : getTagColor(index)}
            onClick={() => handleTagClick(tag)}
            style={{ cursor: 'pointer', padding: '4px 12px' }}
          >
            {tag.name}
          </Tag>
        ))}
      </div>
    </div>
  );
}