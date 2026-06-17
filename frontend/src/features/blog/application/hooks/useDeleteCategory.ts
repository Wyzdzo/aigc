// src/features/blog/application/hooks/useDeleteCategory.ts
import { useMutation } from '@apollo/client/react';

import { DELETE_CATEGORY } from '../../infrastructure/graphql/mutations';

export function useDeleteCategory() {
  const [mutate, { loading }] = useMutation<{ deleteCategory: boolean }>(DELETE_CATEGORY);

  const deleteCategory = async (id: number) => {
    const result = await mutate({ variables: { id } });
    return result.data?.deleteCategory;
  };

  return { deleteCategory, loading };
}
