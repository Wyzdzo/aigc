// src/features/media/application/hooks/useMediaList.ts

import { useQuery } from '@apollo/client/react';
import { GET_MEDIA_LIST } from '../../infrastructure/graphql/queries';

export interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaListResult {
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
}

export function useMediaList(page: number = 1, pageSize: number = 20, keyword?: string) {
  const { data, loading, error, refetch } = useQuery<{ mediaList: MediaListResult }>(
    GET_MEDIA_LIST,
    {
      variables: { page, pageSize, keyword },
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    mediaList: data?.mediaList,
    loading,
    error,
    refetch,
  };
}
