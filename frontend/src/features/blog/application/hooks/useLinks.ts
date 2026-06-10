// src/features/blog/application/hooks/useLinks.ts
import { executeGraphQL } from '@/shared/graphql/request';
import { GET_LINKS, GET_ACTIVE_LINKS } from '../../infrastructure/graphql/queries';
import type { BlogLink } from '@/entities/blog';

interface LinksResponse {
  links: BlogLink[];
}

interface ActiveLinksResponse {
  activeLinks: BlogLink[];
}

export function useLinks() {
  const fetchLinks = async () => {
    try {
      const data = await executeGraphQL<LinksResponse, Record<string, never>>(GET_LINKS.loc?.source.body || '', {});

      return data?.links || [];
    } catch (error) {
      console.error('Failed to fetch links:', error);
      return [];
    }
  };

  return {
    fetchLinks,
  };
}

export function useActiveLinks() {
  const fetchActiveLinks = async () => {
    try {
      const data = await executeGraphQL<ActiveLinksResponse, Record<string, never>>(GET_ACTIVE_LINKS.loc?.source.body || '', {});

      return data?.activeLinks || [];
    } catch (error) {
      console.error('Failed to fetch active links:', error);
      return [];
    }
  };

  return {
    fetchActiveLinks,
  };
}