// src/features/blog/application/hooks/usePublishPost.ts
import { useMutation } from '@apollo/client/react';

import { PUBLISH_POST } from '../../infrastructure/graphql/mutations';

export interface PublishPostResult {
  publishPost: {
    id: number;
    status: string;
  };
}

export function usePublishPost() {
  const [mutate, { loading }] = useMutation<PublishPostResult>(PUBLISH_POST);

  const publishPost = async (id: number) => {
    const result = await mutate({ variables: { id } });
    return result.data?.publishPost;
  };

  return { publishPost, loading };
}
