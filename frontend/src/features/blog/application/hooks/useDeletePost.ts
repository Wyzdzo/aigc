// src/features/blog/application/hooks/useDeletePost.ts
import { useMutation } from '@apollo/client/react';

import { DELETE_POST } from '../../infrastructure/graphql/mutations';

export function useDeletePost() {
  const [mutate, { loading }] = useMutation<{ deletePost: boolean }>(DELETE_POST);

  const deletePost = async (id: number) => {
    const result = await mutate({ variables: { id } });
    return result.data?.deletePost;
  };

  return { deletePost, loading };
}
