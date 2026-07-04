import { useMutation } from '@apollo/client/react';
import { CREATE_TAG } from '../../infrastructure/graphql/mutations';
import { GET_TAGS } from '../../infrastructure/graphql/queries';

export function useCreateTag() {
  const [createTagMutation, { loading }] = useMutation(CREATE_TAG, {
    refetchQueries: [{ query: GET_TAGS }],
  });

  const createTag = async (params: { name: string; slug: string }) => {
    const { data } = await createTagMutation({
      variables: params,
    });
    return data?.createTag;
  };

  return { createTag, loading };
}
