// src/pages/blog/tags.tsx

import { useTags } from '@/features/blog';

import type { BlogTag } from '@/entities/blog';

export function BlogTagsPage() {
  const { tags, loading, error } = useTags();

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>加载失败：{error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">文章标签</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: BlogTag) => (
          <span
            key={tag.id}
            className="px-4 py-2 bg-fill-tertiary text-text rounded-full hover:bg-fill-secondary transition-colors cursor-pointer"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
