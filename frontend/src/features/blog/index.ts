// src/features/blog/index.ts

// Entities
export * from '@/entities/blog';

// Application - Hooks
export * from './application/hooks/usePosts';
export * from './application/hooks/usePost';
export * from './application/hooks/useCategories';
export * from './application/hooks/useTags';
export * from './application/hooks/useComments';
export * from './application/hooks/useLinks';

// Infrastructure - GraphQL (for testing)
export { GET_POSTS } from './infrastructure/graphql/queries';