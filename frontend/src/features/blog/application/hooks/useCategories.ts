// src/features/blog/application/hooks/useCategories.ts
import { executeGraphQL } from '@/shared/graphql/request';
import { GET_CATEGORIES, GET_CATEGORY_TREE } from '../../infrastructure/graphql/queries';
import type { BlogCategory } from '@/entities/blog';

interface CategoriesResponse {
  categories: BlogCategory[];
}

interface CategoryTreeResponse {
  categoryTree: BlogCategory[];
}

export function useCategories() {
  const fetchCategories = async () => {
    try {
      const data = await executeGraphQL<CategoriesResponse, Record<string, never>>(GET_CATEGORIES.loc?.source.body || '', {});

      return data?.categories || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  };

  return {
    fetchCategories,
  };
}

export function useCategoryTree() {
  const fetchCategoryTree = async () => {
    try {
      const data = await executeGraphQL<CategoryTreeResponse, Record<string, never>>(GET_CATEGORY_TREE.loc?.source.body || '', {});

      return data?.categoryTree || [];
    } catch (error) {
      console.error('Failed to fetch category tree:', error);
      return [];
    }
  };

  return {
    fetchCategoryTree,
  };
}