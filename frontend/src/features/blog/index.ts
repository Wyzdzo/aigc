// src/features/blog/index.ts

// Entities
export * from '@/entities/blog';

// Application - Hooks
export * from './application/hooks/useCategories';
export * from './application/hooks/useComments';
export * from './application/hooks/useCreateComment';
export * from './application/hooks/useLikePost';
export * from './application/hooks/useLinks';
export * from './application/hooks/usePost';
export * from './application/hooks/usePosts';
export * from './application/hooks/useSearch';
export * from './application/hooks/useTags';

// Infrastructure - GraphQL (for testing)
export { CREATE_COMMENT, LIKE_POST } from './infrastructure/graphql/mutations';
export { GET_CATEGORY_TREE, GET_COMMENT_STATS, GET_COMMENTS, GET_POST_BY_SLUG, GET_POSTS, GET_TAGS } from './infrastructure/graphql/queries';