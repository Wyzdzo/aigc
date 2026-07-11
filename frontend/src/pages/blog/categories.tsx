// src/pages/blog/categories.tsx

import { FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
import { Card, Empty, Spin, Tree, Typography } from 'antd';
import { useNavigate } from 'react-router';

import { SeoMeta } from '@/widgets/seo';
import { useCategoryTree } from '@/features/blog';

import type { BlogCategory } from '@/entities/blog';

const { Title, Text } = Typography;

interface CategoryTreeNode {
  title: React.ReactNode;
  key: string;
  children?: CategoryTreeNode[];
}

function buildCategoryTree(
  categories: BlogCategory[],
  parentId: number | null = null,
): CategoryTreeNode[] {
  return categories
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      title: (
        <div className="flex items-center justify-between w-full py-1 pr-2">
          <span className="font-medium">{category.name}</span>
          {category.description && (
            <Text type="secondary" className="text-xs ml-4 hidden sm:inline truncate max-w-[200px]">
              {category.description}
            </Text>
          )}
        </div>
      ),
      key: String(category.id),
      children: buildCategoryTree(categories, category.id),
    }));
}

export function BlogCategoriesPage() {
  const { categoryTree, loading, error } = useCategoryTree();
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

  const treeData = buildCategoryTree(categoryTree);

  const handleSelect = (keys: React.Key[]) => {
    const selected = keys[0];
    if (selected !== null && selected !== undefined) {
      navigate(`/blog/category/${selected}`);
    }
  };

  return (
    <>
      <SeoMeta title="文章分类 - AIGC Blog" description="按分类浏览技术博客文章" />

      <div className="max-w-[800px] mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpenOutlined className="text-2xl text-primary" />
            <Title level={2} className="mb-0">文章分类</Title>
          </div>
          <Text type="secondary">
            共 {categoryTree.length} 个分类，点击分类浏览文章
          </Text>
        </div>

        {/* 分类树 */}
        {categoryTree.length === 0 ? (
          <Empty description="暂无分类" />
        ) : (
          <Card
            style={{ borderRadius: 'var(--radius-card)' }}
            styles={{ body: { padding: 20 } }}
          >
            <Tree
              defaultExpandAll
              icon={({ isLeaf }: { isLeaf: boolean }) =>
                isLeaf ? <FolderOutlined className="text-amber-500" /> : <FolderOpenOutlined className="text-amber-500" />
              }
              treeData={treeData}
              onSelect={handleSelect}
            />
          </Card>
        )}
      </div>
    </>
  );
}
