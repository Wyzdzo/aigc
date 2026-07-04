// src/features/blog/application/hooks/useUnpublishPost.ts
import { useMutation } from '@apollo/client/react';

import { UNPUBLISH_POST } from '../../infrastructure/graphql/mutations';
import { GET_POSTS } from '../../infrastructure/graphql/queries';

export function useUnpublishPost() {
  const [mutate, { loading }] = useMutation(UNPUBLISH_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  const unpublishPost = async (id: number) => {
    await mutate({ variables: { id } });
  };

  return { unpublishPost, loading };
}
