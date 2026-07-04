import { useMutation } from '@apollo/client/react';
import { CREATE_CATEGORY } from '../../infrastructure/graphql/mutations';
import { GET_CATEGORIES } from '../../infrastructure/graphql/queries';

export function useCreateCategory() {
  const [createCategoryMutation, { loading }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const createCategory = async (params: {
    name: string;
    slug: string;
    description?: string;
    parentId?: number;
    sortOrder?: number;
  }) => {
    const { data } = await createCategoryMutation({
      variables: params,
    });
    return data?.createCategory;
  };

  return { createCategory, loading };
}
