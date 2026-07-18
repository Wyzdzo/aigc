// src/features/auth/application/hooks/useUpdateUserInfo.ts

import { useMutation } from '@apollo/client/react';

import { UPDATE_USER_INFO } from '../../infrastructure/graphql/mutations';

export interface UpdateUserInfoInput {
  nickname?: string;
  avatarUrl?: string | null;
  signature?: string | null;
}

interface UpdateUserInfoResult {
  updateUserInfo: {
    isUpdated: boolean;
    userInfo: {
      accountId: number;
      nickname: string;
      avatarUrl: string | null;
      signature: string | null;
      email: string | null;
    };
  };
}

export function useUpdateUserInfo() {
  const [mutate, { loading }] = useMutation<
    UpdateUserInfoResult,
    { input: UpdateUserInfoInput }
  >(UPDATE_USER_INFO);

  const updateUserInfo = async (input: UpdateUserInfoInput): Promise<boolean> => {
    try {
      const result = await mutate({ variables: { input } });
      return result.data?.updateUserInfo.isUpdated ?? false;
    } catch {
      return false;
    }
  };

  return { updateUserInfo, loading };
}
