// src/features/media/application/hooks/useDeleteMedia.ts

import { useMutation } from '@apollo/client/react';
import { DELETE_MEDIA } from '../../infrastructure/graphql/mutations';

export function useDeleteMedia() {
  const [deleteMedia, { loading }] = useMutation<{ deleteMedia: boolean }>(
    DELETE_MEDIA,
  );

  return {
    deleteMedia: async (id: number) => {
      try {
        const result = await deleteMedia({ variables: { id } });
        return result.data?.deleteMedia ?? false;
      } catch {
        return false;
      }
    },
    loading,
  };
}
