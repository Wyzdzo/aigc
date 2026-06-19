// src/features/media/infrastructure/graphql/queries.ts

import { gql } from '@apollo/client';

export const GET_MEDIA_LIST = gql`
  query GetMediaList($page: Int!, $pageSize: Int!, $keyword: String) {
    mediaList(page: $page, pageSize: $pageSize, keyword: $keyword) {
      items {
        id
        filename
        originalName
        mimeType
        size
        url
        width
        height
        createdAt
        updatedAt
      }
      total
      page
      pageSize
    }
  }
`;
