// src/shared/graphql/auth-constants.ts

/**
 * 认证相关 localStorage key 常量
 * 供 GraphQL client（token 刷新）和 auth feature（登录/登出）共享
 */
export const TOKEN_KEY = 'admin_token';
export const REFRESH_TOKEN_KEY = 'admin_refresh_token';

/**
 * RefreshToken mutation 原始字符串
 * 供 client.ts 中 raw fetch 调用使用（无法使用 gql 文档因为此时 Apollo client 可能不可用）
 */
export const REFRESH_TOKEN_MUTATION_STRING = `mutation RefreshToken($input: RefreshTokenInput!) {
          refreshToken(input: $input) { accessToken refreshToken }
        }`;
