// src/features/settings/application/hooks/usePublicSettings.ts

import { useQuery } from '@apollo/client/react';

import { GET_PUBLIC_SETTINGS } from '../../infrastructure/graphql/queries';

export interface PublicSettings {
  announcement: string | null;
}

export function usePublicSettings() {
  const { data, loading, error } = useQuery<{ publicSettings: PublicSettings }>(
    GET_PUBLIC_SETTINGS,
    { fetchPolicy: 'cache-first', context: { authMode: 'none' } },
  );

  return {
    announcement: data?.publicSettings?.announcement ?? null,
    loading,
    error,
  };
}
