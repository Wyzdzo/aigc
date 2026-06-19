// src/features/media/infrastructure/graphql/mutations.ts

import { gql } from '@apollo/client';

export const DELETE_MEDIA = gql`
  mutation DeleteMedia($id: Int!) {
    deleteMedia(id: $id)
  }
`;
