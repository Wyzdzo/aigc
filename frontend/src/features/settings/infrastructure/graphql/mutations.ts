// src/features/settings/infrastructure/graphql/mutations.ts

import { gql } from '@apollo/client';

export const UPDATE_SITE_SETTINGS = gql`
  mutation UpdateSiteSettings($input: UpdateSiteSettingsInput!) {
    updateSiteSettings(input: $input)
  }
`;

export const UPDATE_BLOGGER_INFO = gql`
  mutation UpdateBloggerInfo($input: UpdateBloggerInfoInput!) {
    updateBloggerInfo(input: $input)
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input)
  }
`;
