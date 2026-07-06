// src/features/auth/infrastructure/graphql/mutations.ts

import { gql } from '@apollo/client';

import { REFRESH_TOKEN_MUTATION_STRING } from '@/shared/graphql/auth-constants';

/**
 * 登录变更
 */
export const LOGIN = gql`
  mutation Login($input: AuthLoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      accountId
      role
      userInfo {
        id
        accountId
        nickname
        avatarUrl
        email
        accessGroup
      }
    }
  }
`;

/**
 * 刷新令牌变更
 */
export const REFRESH_TOKEN = gql(REFRESH_TOKEN_MUTATION_STRING);