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

/**
 * 更新用户信息变更（普通用户可用）
 */
export const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfo($input: UpdateUserInfoInput!) {
    updateUserInfo(input: $input) {
      isUpdated
      userInfo {
        accountId
        nickname
        avatarUrl
        signature
        email
      }
    }
  }
`;