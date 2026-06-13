// src/features/blog/application/hooks/useLinks.ts
import { useQuery } from '@apollo/client/react';

import type { BlogLink } from '@/entities/blog';

import { GET_ACTIVE_LINKS,GET_LINKS } from '../../infrastructure/graphql/queries';

export interface LinksResult {
  links: BlogLink[];
}

export interface ActiveLinksResult {
  activeLinks: BlogLink[];
}

export function useLinks() {
  const { data, loading, error, refetch } = useQuery<LinksResult>(GET_LINKS, {
    fetchPolicy: 'cache-first',
  });

  return {
    links: data?.links || [],
    loading,
    error,
    refetch,
  };
}

export function useActiveLinks() {
  const { data, loading, error, refetch } = useQuery<ActiveLinksResult>(GET_ACTIVE_LINKS, {
    fetchPolicy: 'cache-first',
  });

  return {
    activeLinks: data?.activeLinks || [],
    loading,
    error,
    refetch,
  };
}