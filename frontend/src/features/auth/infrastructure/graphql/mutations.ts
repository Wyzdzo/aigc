// src/features/auth/infrastructure/graphql/mutations.ts

import { gql } from '@apollo/client';

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
 * 刷新令牌变更（如果需要）
 */
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;