import { useMutation } from '@apollo/client/react';
import { VIEW_POST } from '../../infrastructure/graphql/mutations';

export function useViewPost() {
  const [viewPostMutation] = useMutation(VIEW_POST);

  const viewPost = async (id: number) => {
    await viewPostMutation({ variables: { id } });
  };

  return { viewPost };
}
