// src/shared/graphql/client.ts

import { ApolloClient, HttpLink, InMemoryCache, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import type { GraphQLFormattedError } from 'graphql';

import { getGraphQLEndpoint } from '@/shared/env';

import { REFRESH_TOKEN_KEY, REFRESH_TOKEN_MUTATION_STRING, TOKEN_KEY } from './auth-constants';

type GraphQLRuntimeConfig = {
  getAccessToken?: () => string | null | undefined;
  refreshSession?: () => Promise<void>;
  onAuthFailure?: () => void;
};

// Token 刷新锁，防止并发请求同时触发多次刷新
let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function resolvePendingRequests(token: string | null) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

function isJwtAuthError(graphQLErrors: ReadonlyArray<GraphQLFormattedError>): boolean {
  return graphQLErrors.some(
    (err) =>
      err.extensions?.code === 'UNAUTHENTICATED' ||
      (typeof err.message === 'string' && err.message.includes('JWT 认证失败')),
  );
}

async function tryRefreshToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise<string | null>((resolve) => {
      pendingRequests.push(resolve);
    });
  }

  isRefreshing = true;
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    resolvePendingRequests(null);
    isRefreshing = false;
    return null;
  }

  try {
    const response = await fetch(getGraphQLEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: REFRESH_TOKEN_MUTATION_STRING,
        variables: { input: { refreshToken } },
      }),
    });

    const result = await response.json() as {
      data?: { refreshToken?: { accessToken: string; refreshToken: string } };
      errors?: { message: string }[];
    };

    if (result.errors || !result.data?.refreshToken) {
      resolvePendingRequests(null);
      isRefreshing = false;
      return null;
    }

    const { accessToken, refreshToken: newRefreshToken } = result.data.refreshToken;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    resolvePendingRequests(accessToken);
    isRefreshing = false;
    return accessToken;
  } catch {
    resolvePendingRequests(null);
    isRefreshing = false;
    return null;
  }
}

let runtimeConfig: GraphQLRuntimeConfig = {};
let graphQLClient: ApolloClient | null = null;

function toRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return { ...value };
}

function getContextAuthMode(context: unknown): 'required' | 'none' | null {
  const authMode = toRecord(context).authMode;

  return authMode === 'required' || authMode === 'none' ? authMode : null;
}

function getRequestAuthorizationHeader(headers: unknown): string | null {
  const headerRecord = toRecord(headers);

  if (typeof headerRecord.Authorization === 'string') {
    return headerRecord.Authorization;
  }

  if (typeof headerRecord.authorization === 'string') {
    return headerRecord.authorization;
  }

  return null;
}

function getAuthorizationHeader(accessToken?: string | null) {
  return accessToken ? `Bearer ${accessToken}` : null;
}

function removeAuthorizationHeader(headers: unknown) {
  const nextHeaders = toRecord(headers);

  delete nextHeaders.Authorization;
  delete nextHeaders.authorization;

  return nextHeaders;
}

/**
 * 创建缓存配置
 * 配置类型策略和字段策略以优化缓存行为
 */
function createCacheConfig() {
  return new InMemoryCache({
    // 类型策略
    typePolicies: {
      // 文章类型
      BlogPost: {
        // 使用 id 作为主键
        keyFields: ['id'],
        fields: {
          // 点赞数和阅读数使用合并策略
          likeCount: {
            merge: (_existing: number | undefined, incoming: number): number => {
              return incoming;
            },
          },
          viewCount: {
            merge: (_existing: number | undefined, incoming: number): number => {
              return incoming;
            },
          },
        },
      },
      // 分类类型
      BlogCategory: {
        keyFields: ['id'],
        fields: {
          // 子分类使用合并策略
          children: {
            merge: (_existing: unknown[] | undefined, incoming: unknown[]): unknown[] => {
              return incoming;
            },
          },
        },
      },
      // 标签类型
      BlogTag: {
        keyFields: ['id'],
      },
      // 评论类型
      BlogComment: {
        keyFields: ['id'],
      },
      // 友链类型
      BlogLink: {
        keyFields: ['id'],
      },
      // 分页结果类型
      PaginatedPosts: {
        keyFields: false,
        fields: {
          items: {
            // 合并分页数据
            merge: (existing: unknown[] | undefined, incoming: unknown[], { args }): unknown[] => {
              // 如果是第一页，直接返回新数据
              if (!args || args.page === 1 || !existing) {
                return incoming;
              }
              // 否则合并数据
              return [...existing, ...incoming];
            },
          },
        },
      },
      PaginatedComments: {
        keyFields: false,
        fields: {
          items: {
            merge: (existing: unknown[] | undefined, incoming: unknown[], { args }): unknown[] => {
              if (!args || args.page === 1 || !existing) {
                return incoming;
              }
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  });
}

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: getGraphQLEndpoint(),
  });
  const authLink = setContext((_, previousContext) => {
    if (getContextAuthMode(previousContext) === 'none') {
      return {
        headers: removeAuthorizationHeader(previousContext.headers),
      };
    }

    const requestAuthorizationHeader = getRequestAuthorizationHeader(previousContext.headers);
    const authorizationHeader =
      requestAuthorizationHeader ??
      getAuthorizationHeader(runtimeConfig.getAccessToken?.() ?? null);

    return {
      headers: {
        ...previousContext.headers,
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
      },
    };
  });

  // Error link: 拦截 JWT 认证失败错误，自动刷新 token
  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors && isJwtAuthError(graphQLErrors)) {
      return new Observable((observer) => {
        tryRefreshToken()
          .then((newToken) => {
            if (!newToken) {
              // 刷新失败，跳转登录
              runtimeConfig.onAuthFailure?.();
              observer.error(graphQLErrors);
              return;
            }
            // 用新 token 重试原请求
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                Authorization: `Bearer ${newToken}`,
              },
            });
            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(() => {
            runtimeConfig.onAuthFailure?.();
            observer.error(graphQLErrors);
          });
      });
    }
  });

  return new ApolloClient({
    cache: createCacheConfig(),
    link: errorLink.concat(authLink.concat(httpLink)),
    // 默认查询选项
    defaultOptions: {
      watchQuery: {
        // 缓存优先策略
        fetchPolicy: 'cache-first',
      },
      query: {
        fetchPolicy: 'cache-first',
      },
    },
  });
}

export function configureGraphQLRuntime(config: GraphQLRuntimeConfig) {
  runtimeConfig = {
    ...runtimeConfig,
    ...config,
  };
}

export function getGraphQLRuntimeConfig(): Readonly<GraphQLRuntimeConfig> {
  return runtimeConfig;
}

export function getGraphQLClient() {
  if (!graphQLClient) {
    graphQLClient = createApolloClient();
  }

  return graphQLClient;
}

/**
 * 重置缓存
 * 用于用户登录/登出后清除缓存数据
 */
export function resetGraphQLCache() {
  if (graphQLClient) {
    graphQLClient.resetStore();
  }
}
