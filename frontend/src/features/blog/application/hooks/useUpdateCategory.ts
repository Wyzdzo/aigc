import { useMutation } from '@apollo/client/react';
import { UPDATE_CATEGORY } from '../../infrastructure/graphql/mutations';
import { GET_CATEGORIES } from '../../infrastructure/graphql/queries';

export function useUpdateCategory() {
  const [updateCategoryMutation, { loading }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const updateCategory = async (params: {
    id: number;
    name?: string;
    slug?: string;
    description?: string;
    parentId?: number;
    sortOrder?: number;
  }) => {
    const { data } = await updateCategoryMutation({
      variables: params,
    });
    return data?.updateCategory;
  };

  return { updateCategory, loading };
}
