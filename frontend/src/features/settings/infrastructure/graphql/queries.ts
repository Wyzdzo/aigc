// src/features/settings/infrastructure/graphql/queries.ts

import { gql } from '@apollo/client';

export const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      siteSettings {
        key
        value
        displayName
        groupName
      }
      bloggerInfo {
        nickname
        avatar
        bio
      }
    }
  }
`;
