import { useMutation } from '@apollo/client/react';
import { UPDATE_TAG } from '../../infrastructure/graphql/mutations';
import { GET_TAGS } from '../../infrastructure/graphql/queries';

export function useUpdateTag() {
  const [updateTagMutation, { loading }] = useMutation(UPDATE_TAG, {
    refetchQueries: [{ query: GET_TAGS }],
  });

  const updateTag = async (params: { id: number; name?: string; slug?: string }) => {
    const { data } = await updateTagMutation({
      variables: params,
    });
    return data?.updateTag;
  };

  return { updateTag, loading };
}
