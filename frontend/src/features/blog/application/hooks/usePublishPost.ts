// src/features/blog/application/hooks/usePublishPost.ts
import { useMutation } from '@apollo/client/react';

import { PUBLISH_POST } from '../../infrastructure/graphql/mutations';
import { GET_POSTS } from '../../infrastructure/graphql/queries';

export function usePublishPost() {
  const [mutate, { loading }] = useMutation(PUBLISH_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  const publishPost = async (id: number) => {
    await mutate({ variables: { id } });
  };

  return { publishPost, loading };
}
