// src/widgets/blog/CategoryTree.tsx

import { FolderOpenOutlined,FolderOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import type React from 'react';

import { useCategoryTree } from '@/features/blog';

import type { BlogCategory } from '@/entities/blog';

export interface CategoryTreeProps {
  selectedId?: number;
  onChange: (categoryId: number | undefined) => void;
}

interface CategoryTreeNode {
  title: string;
  key: string;
  children?: CategoryTreeNode[];
}

function buildTree(categories: BlogCategory[]): CategoryTreeNode[] {
  const map = new Map<number | null, CategoryTreeNode[]>();

  categories.forEach((cat) => {
    const node: CategoryTreeNode = {
      title: cat.name,
      key: String(cat.id),
      children: [],
    };

    const parentId = cat.parentId ?? null;
    if (!map.has(parentId)) {
      map.set(parentId, []);
    }
    map.get(parentId)!.push(node);
  });

  const buildHierarchy = (parentId: number | null): CategoryTreeNode[] => {
    const children = map.get(parentId) || [];
    children.forEach((child) => {
      child.children = buildHierarchy(Number(child.key));
    });
    return children;
  };

  return buildHierarchy(null);
}

export function CategoryTree({ selectedId, onChange }: CategoryTreeProps) {
  const { categoryTree, loading } = useCategoryTree();

  const treeData = buildTree(categoryTree);

  if (loading) {
    return <div style={{ padding: 16 }}>加载中...</div>;
  }

  const handleSelect = (keys: React.Key[]) => {
    const selected = keys[0];
    onChange(selected !== null && selected !== undefined ? Number(selected) : undefined);
  };

  return (
    <div>
      <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>文章分类</h3>
      <Tree
        showLine
        defaultExpandAll
        selectedKeys={selectedId ? [String(selectedId)] : []}
        onSelect={handleSelect}
        icon={({ isLeaf }: { isLeaf: boolean }) =>
          isLeaf ? <FolderOutlined /> : <FolderOpenOutlined />
        }
        treeData={treeData}
      />
    </div>
  );
}