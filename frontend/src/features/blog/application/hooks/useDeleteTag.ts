// src/features/blog/application/hooks/useDeleteTag.ts
import { useMutation } from '@apollo/client/react';

import { DELETE_TAG } from '../../infrastructure/graphql/mutations';

export function useDeleteTag() {
  const [mutate, { loading }] = useMutation<{ deleteTag: boolean }>(DELETE_TAG);

  const deleteTag = async (id: number) => {
    const result = await mutate({ variables: { id } });
    return result.data?.deleteTag;
  };

  return { deleteTag, loading };
}
