// src/pages/blog/categories.tsx

import { useCategories } from '@/features/blog';

import type { BlogCategory } from '@/entities/blog';

export function BlogCategoriesPage() {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>加载失败：{error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">文章分类</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category: BlogCategory) => (
          <div
            key={category.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-text">{category.name}</h3>
            {category.description && (
              <p className="text-text-secondary text-sm mt-1">{category.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}