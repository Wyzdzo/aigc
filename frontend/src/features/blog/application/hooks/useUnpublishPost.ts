// src/features/blog/application/hooks/useUnpublishPost.ts
import { useMutation } from '@apollo/client/react';

import { UNPUBLISH_POST } from '../../infrastructure/graphql/mutations';

export interface UnpublishPostResult {
  unpublishPost: {
    id: number;
    status: string;
  };
}

export function useUnpublishPost() {
  const [mutate, { loading }] = useMutation<UnpublishPostResult>(UNPUBLISH_POST);

  const unpublishPost = async (id: number) => {
    const result = await mutate({ variables: { id } });
    return result.data?.unpublishPost;
  };

  return { unpublishPost, loading };
}
