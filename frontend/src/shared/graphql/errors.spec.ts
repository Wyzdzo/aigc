import { describe, it, expect } from 'vitest';
import {
  GraphQLIngressError,
  isGraphQLIngressError,
  toGraphQLIngressError,
} from './errors';

describe('GraphQLIngressError', () => {
  it('should set type and message', () => {
    const error = new GraphQLIngressError({ type: 'graphql', message: 'Something went wrong' });

    expect(error.type).toBe('graphql');
    expect(error.message).toBe('Something went wrong');
    expect(error.name).toBe('GraphQLIngressError');
  });

  it('should set isRetryable true for network type', () => {
    const error = new GraphQLIngressError({ type: 'network', message: 'Network error' });

    expect(error.isRetryable).toBe(true);
  });

  it('should set isRetryable true for http with 5xx status', () => {
    const error = new GraphQLIngressError({ type: 'http', message: 'Server error', statusCode: 500 });

    expect(error.isRetryable).toBe(true);
  });

  it('should set isRetryable false for http with 4xx status', () => {
    const error = new GraphQLIngressError({ type: 'http', message: 'Not found', statusCode: 404 });

    expect(error.isRetryable).toBe(false);
  });

  it('should set isRetryable false for graphql type', () => {
    const error = new GraphQLIngressError({ type: 'graphql', message: 'GraphQL error' });

    expect(error.isRetryable).toBe(false);
  });

  it('should return correct userMessage for each type', () => {
    const types = [
      { type: 'network' as const, expected: '网络连接异常，请稍后重试。' },
      { type: 'http' as const, expected: '服务暂时不可用，请稍后重试。' },
      { type: 'graphql' as const, expected: '请求处理失败，请稍后重试。' },
      { type: 'auth' as const, expected: '登录状态已失效，请重新登录后再试。' },
      { type: 'malformed' as const, expected: '返回结果异常，请稍后重试。' },
    ];

    for (const { type, expected } of types) {
      const error = new GraphQLIngressError({ type, message: 'err' });
      expect(error.userMessage).toBe(expected);
    }
  });

  it('should set operationName', () => {
    const error = new GraphQLIngressError({
      type: 'graphql',
      message: 'Error',
      operationName: 'GetUser',
    });

    expect(error.operationName).toBe('GetUser');
  });
});

describe('isGraphQLIngressError', () => {
  it('should return true for GraphQLIngressError instance', () => {
    const error = new GraphQLIngressError({ type: 'graphql', message: 'err' });

    expect(isGraphQLIngressError(error)).toBe(true);
  });

  it('should return false for non-GraphQLIngressError', () => {
    expect(isGraphQLIngressError(new Error('err'))).toBe(false);
    expect(isGraphQLIngressError(null)).toBe(false);
    expect(isGraphQLIngressError(undefined)).toBe(false);
    expect(isGraphQLIngressError('string')).toBe(false);
    expect(isGraphQLIngressError(42)).toBe(false);
  });
});

describe('toGraphQLIngressError', () => {
  it('should pass through existing GraphQLIngressError', () => {
    const original = new GraphQLIngressError({ type: 'network', message: 'Network error' });
    const result = toGraphQLIngressError(original);

    expect(result).toBe(original);
  });
});
