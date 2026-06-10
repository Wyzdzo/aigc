// src/features/blog/application/hooks/useCategories.ts
import { useQuery } from '@apollo/client/react';
import { GET_CATEGORIES, GET_CATEGORY_TREE } from '../../infrastructure/graphql/queries';
import type { BlogCategory } from '@/entities/blog';

export interface CategoriesResult {
  categories: BlogCategory[];
}

export interface CategoryTreeResult {
  categoryTree: BlogCategory[];
}

export function useCategories() {
  const { data, loading, error, refetch } = useQuery<CategoriesResult>(GET_CATEGORIES, {
    fetchPolicy: 'cache-first',
  });

  return {
    categories: data?.categories || [],
    loading,
    error,
    refetch,
  };
}

export function useCategoryTree() {
  const { data, loading, error, refetch } = useQuery<CategoryTreeResult>(GET_CATEGORY_TREE, {
    fetchPolicy: 'cache-first',
  });

  return {
    categoryTree: data?.categoryTree || [],
    loading,
    error,
    refetch,
  };
}