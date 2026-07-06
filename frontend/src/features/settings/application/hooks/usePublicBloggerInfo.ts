// src/features/settings/application/hooks/usePublicBloggerInfo.ts

import { useQuery } from '@apollo/client/react';

import { GET_PUBLIC_BLOGGER_INFO } from '../../infrastructure/graphql/queries';

export interface PublicBloggerInfo {
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
}

export function usePublicBloggerInfo() {
  const { data, loading, error } = useQuery<{ publicBloggerInfo: PublicBloggerInfo | null }>(
    GET_PUBLIC_BLOGGER_INFO,
    { fetchPolicy: 'cache-first', context: { authMode: 'none' } },
  );

  return {
    bloggerInfo: data?.publicBloggerInfo ?? null,
    loading,
    error,
  };
}
