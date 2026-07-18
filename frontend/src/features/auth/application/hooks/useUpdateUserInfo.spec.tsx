// src/features/auth/application/hooks/useUpdateUserInfo.spec.tsx

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { UPDATE_USER_INFO } from '../../infrastructure/graphql/mutations';

import type { UpdateUserInfoInput } from './useUpdateUserInfo';
import { useUpdateUserInfo } from './useUpdateUserInfo';

describe('useUpdateUserInfo', () => {
  const mockInput: UpdateUserInfoInput = {
    nickname: '测试用户',
    avatarUrl: 'https://example.com/avatar.png',
    signature: '你好世界',
  };

  const mockResult = {
    updateUserInfo: {
      isUpdated: true,
      userInfo: {
        accountId: 2,
        nickname: '测试用户',
        avatarUrl: 'https://example.com/avatar.png',
        signature: '你好世界',
        email: 'guest@test.com',
      },
    },
  };

  function createWrapper(mocks: readonly MockedResponse[]) {
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
    };
  }

  describe('Happy Path', () => {
    it('should return true when updateUserInfo mutation succeeds', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_USER_INFO,
            variables: { input: mockInput },
          },
          result: { data: mockResult },
        },
      ];

      const { result } = renderHook(() => useUpdateUserInfo(), {
        wrapper: createWrapper(mocks),
      });

      const success = await result.current.updateUserInfo(mockInput);

      await waitFor(() => {
        expect(success).toBe(true);
      });
    });

    it('should track loading state during mutation', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_USER_INFO,
            variables: { input: mockInput },
          },
          result: { data: mockResult },
          delay: 100,
        },
      ];

      const { result } = renderHook(() => useUpdateUserInfo(), {
        wrapper: createWrapper(mocks),
      });

      expect(result.current.loading).toBe(false);

      const mutationPromise = result.current.updateUserInfo(mockInput);

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      }, { timeout: 2000 });

      await mutationPromise;

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should update with partial input (only nickname)', async () => {
      const partialInput: UpdateUserInfoInput = { nickname: '新昵称' };
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_USER_INFO,
            variables: { input: partialInput },
          },
          result: {
            data: {
              updateUserInfo: {
                isUpdated: true,
                userInfo: {
                  accountId: 2,
                  nickname: '新昵称',
                  avatarUrl: null,
                  signature: null,
                  email: null,
                },
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useUpdateUserInfo(), {
        wrapper: createWrapper(mocks),
      });

      const success = await result.current.updateUserInfo(partialInput);

      await waitFor(() => {
        expect(success).toBe(true);
      });
    });
  });

  describe('Error Path', () => {
    it('should return false when mutation fails with network error', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_USER_INFO,
            variables: { input: mockInput },
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useUpdateUserInfo(), {
        wrapper: createWrapper(mocks),
      });

      const success = await result.current.updateUserInfo(mockInput);

      expect(success).toBe(false);
    });

    it('should return false when mutation returns isUpdated=false', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_USER_INFO,
            variables: { input: mockInput },
          },
          result: {
            data: {
              updateUserInfo: {
                isUpdated: false,
                userInfo: null,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useUpdateUserInfo(), {
        wrapper: createWrapper(mocks),
      });

      const success = await result.current.updateUserInfo(mockInput);

      await waitFor(() => {
        expect(success).toBe(false);
      });
    });

    it('should return false when mutation returns null data', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_USER_INFO,
            variables: { input: mockInput },
          },
          result: { data: null },
        },
      ];

      const { result } = renderHook(() => useUpdateUserInfo(), {
        wrapper: createWrapper(mocks),
      });

      const success = await result.current.updateUserInfo(mockInput);

      await waitFor(() => {
        expect(success).toBe(false);
      });
    });

    it('should return false when GraphQL returns errors', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_USER_INFO,
            variables: { input: mockInput },
          },
          result: {
            errors: [{ message: 'Unauthorized' }],
          },
        },
      ];

      const { result } = renderHook(() => useUpdateUserInfo(), {
        wrapper: createWrapper(mocks),
      });

      const success = await result.current.updateUserInfo(mockInput);

      expect(success).toBe(false);
    });
  });
});
