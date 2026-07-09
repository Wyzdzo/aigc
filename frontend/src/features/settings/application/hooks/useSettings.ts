// src/features/settings/application/hooks/useSettings.ts

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_SETTINGS } from '../../infrastructure/graphql/queries';
import {
  UPDATE_SITE_SETTINGS,
  UPDATE_BLOGGER_INFO,
  UPDATE_PASSWORD,
} from '../../infrastructure/graphql/mutations';

export interface SiteSetting {
  key: string;
  value: string | null;
  displayName: string | null;
  groupName: string;
}

export interface BloggerInfo {
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
}

export interface SettingsData {
  siteSettings: SiteSetting[];
  bloggerInfo: BloggerInfo | null;
}

export interface UpdateSiteSettingsInput {
  siteName?: string;
  siteDescription?: string;
  siteKeywords?: string;
  bloggerName?: string;
  bloggerBio?: string;
  bloggerAvatar?: string;
  perPage?: number;
  allowComment?: boolean;
  announcement?: string;
}

export interface UpdateBloggerInfoInput {
  nickname: string;
  bio?: string;
  avatar?: string;
}

export interface UpdatePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export function useSettings(options?: { skip?: boolean }) {
  const { data, loading, refetch } = useQuery<{ settings: SettingsData }>(GET_SETTINGS, {
    skip: options?.skip,
  });

  const [updateSiteSettings, { loading: updateSiteSettingsLoading }] = useMutation<{ updateSiteSettings: boolean }, { input: UpdateSiteSettingsInput }>(
    UPDATE_SITE_SETTINGS,
  );
  const [updateBloggerInfo, { loading: updateBloggerInfoLoading }] = useMutation<{ updateBloggerInfo: boolean }, { input: UpdateBloggerInfoInput }>(
    UPDATE_BLOGGER_INFO,
  );
  const [updatePassword, { loading: updatePasswordLoading }] = useMutation<{ updatePassword: boolean }, { input: UpdatePasswordInput }>(UPDATE_PASSWORD);

  return {
    settings: data?.settings,
    loading,
    refetch,
    updateSiteSettings: async (input: UpdateSiteSettingsInput) => {
      try {
        const result = await updateSiteSettings({ variables: { input } });
        return result.data?.updateSiteSettings ?? false;
      } catch {
        return false;
      }
    },
    updateSiteSettingsLoading,
    updateBloggerInfo: async (input: UpdateBloggerInfoInput) => {
      try {
        const result = await updateBloggerInfo({ variables: { input } });
        return result.data?.updateBloggerInfo ?? false;
      } catch {
        return false;
      }
    },
    updateBloggerInfoLoading,
    updatePassword: async (input: UpdatePasswordInput) => {
      try {
        const result = await updatePassword({ variables: { input } });
        return result.data?.updatePassword ?? false;
      } catch {
        return false;
      }
    },
    updatePasswordLoading,
  };
}
