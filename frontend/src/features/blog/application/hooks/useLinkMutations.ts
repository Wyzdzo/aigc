import { useMutation } from '@apollo/client/react';
import { CREATE_LINK, UPDATE_LINK, DELETE_LINK } from '../../infrastructure/graphql/mutations';
import { GET_LINKS } from '../../infrastructure/graphql/queries';

export function useCreateLink() {
  const [createLinkMutation, { loading }] = useMutation(CREATE_LINK, {
    refetchQueries: [{ query: GET_LINKS }],
  });

  const createLink = async (params: {
    title: string;
    url: string;
    description?: string;
    logo?: string;
    sortOrder?: number;
  }) => {
    const { data } = await createLinkMutation({ variables: params });
    return data?.createLink;
  };

  return { createLink, loading };
}

export function useUpdateLink() {
  const [updateLinkMutation, { loading }] = useMutation(UPDATE_LINK, {
    refetchQueries: [{ query: GET_LINKS }],
  });

  const updateLink = async (params: {
    id: number;
    title?: string;
    url?: string;
    description?: string;
    logo?: string;
    sortOrder?: number;
  }) => {
    const { data } = await updateLinkMutation({ variables: params });
    return data?.updateLink;
  };

  return { updateLink, loading };
}

export function useDeleteLink() {
  const [deleteLinkMutation, { loading }] = useMutation(DELETE_LINK, {
    refetchQueries: [{ query: GET_LINKS }],
  });

  const deleteLink = async (id: number) => {
    await deleteLinkMutation({ variables: { id } });
  };

  return { deleteLink, loading };
}
