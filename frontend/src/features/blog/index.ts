// src/features/blog/index.ts

// Entities
export * from '@/entities/blog';

// Application - Hooks
export * from './application/hooks/useCategories';
export * from './application/hooks/useComments';
export * from './application/hooks/useAdminComments';
export * from './application/hooks/useCreateCategory';
export * from './application/hooks/useCreateComment';
export * from './application/hooks/useCreateTag';
export * from './application/hooks/useDeleteCategory';
export * from './application/hooks/useDeletePost';
export * from './application/hooks/useDeleteTag';
export * from './application/hooks/useLikePost';
export * from './application/hooks/useLinks';
export * from './application/hooks/useLinkMutations';
export * from './application/hooks/usePost';
export * from './application/hooks/usePosts';
export * from './application/hooks/usePublishPost';
export * from './application/hooks/useSearch';
export * from './application/hooks/useTags';
export * from './application/hooks/useUnpublishPost';
export * from './application/hooks/useUpdateCategory';
export * from './application/hooks/useUpdateTag';
export * from './application/hooks/useViewPost';
export * from './application/hooks/useCreatePost';
export * from './application/hooks/useUpdatePost';
export * from './application/hooks/useDashboardStats';

// Infrastructure - GraphQL (for testing only)
// Note: These are exported for testing purposes only. Production code should use hooks from application layer.
export { CREATE_COMMENT, LIKE_POST } from './infrastructure/graphql/mutations';
export { GET_CATEGORIES, GET_CATEGORY_TREE, GET_COMMENT_STATS, GET_COMMENTS, GET_POST_BY_SLUG, GET_POSTS, GET_TAGS } from './infrastructure/graphql/queries';