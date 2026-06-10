// src/features/blog/application/hooks/hooks.spec.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { executeGraphQL } from '@/shared/graphql/request';
import { usePosts } from './usePosts';
import { usePostById, usePostBySlug } from './usePost';
import { useCategories } from './useCategories';
import { useTags, usePostTags } from './useTags';
import { useComments, useCommentStats } from './useComments';
import { useLinks } from './useLinks';
import { mockPosts, mockCategories, mockTags, mockComments, mockLinks } from '../../infrastructure/mock/mock';

vi.mock('@/shared/graphql/request', () => ({
  executeGraphQL: vi.fn(),
}));

describe('Blog Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('usePosts', () => {
    it('should fetch posts successfully', async () => {
      const mockResponse = {
        posts: {
          items: mockPosts,
          total: mockPosts.length,
          page: 1,
          pageSize: 10,
        },
      };
      (executeGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { fetchPosts } = usePosts({ page: 1, pageSize: 10 });
      const result = await fetchPosts();

      expect(executeGraphQL).toHaveBeenCalled();
      expect(result.posts).toEqual(mockPosts);
      expect(result.total).toBe(mockPosts.length);
      expect(result.currentPage).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should return empty result on error', async () => {
      (executeGraphQL as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const { fetchPosts } = usePosts({ page: 1, pageSize: 10 });
      const result = await fetchPosts();

      expect(result.posts).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.currentPage).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should fetch posts with category filter', async () => {
      const mockResponse = {
        posts: {
          items: mockPosts.slice(0, 2),
          total: 2,
          page: 1,
          pageSize: 10,
        },
      };
      (executeGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { fetchPosts } = usePosts({ categoryId: 1, page: 1, pageSize: 10 });
      await fetchPosts();

      expect(executeGraphQL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ categoryId: 1 }),
      );
    });
  });

  describe('usePostById', () => {
    it('should fetch post by id successfully', async () => {
      const mockResponse = { post: mockPosts[0] };
      (executeGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { fetchPostById } = usePostById(1);
      const result = await fetchPostById();

      expect(executeGraphQL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ id: 1 }),
      );
      expect(result).toEqual(mockPosts[0]);
    });

    it('should return null when id is 0', async () => {
      const { fetchPostById } = usePostById(0);
      const result = await fetchPostById();

      expect(executeGraphQL).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      (executeGraphQL as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Post not found'));

      const { fetchPostById } = usePostById(999);
      const result = await fetchPostById();

      expect(result).toBeNull();
    });
  });

  describe('usePostBySlug', () => {
    it('should fetch post by slug successfully', async () => {
      const mockResponse = { postBySlug: mockPosts[0] };
      (executeGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { fetchPostBySlug } = usePostBySlug('first-post');
      const result = await fetchPostBySlug();

      expect(executeGraphQL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ slug: 'first-post' }),
      );
      expect(result).toEqual(mockPosts[0]);
    });

    it('should return null when slug is empty', async () => {
      const { fetchPostBySlug } = usePostBySlug('');
      const result = await fetchPostBySlug();

      expect(executeGraphQL).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      (executeGraphQL as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Post not found'));

      const { fetchPostBySlug } = usePostBySlug('non-existent-slug');
      const result = await fetchPostBySlug();

      expect(result).toBeNull();
    });
  });

  describe('useCategories', () => {
    it('should fetch categories successfully', async () => {
      const mockResponse = { categories: mockCategories };
      (executeGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { fetchCategories } = useCategories();
      const result = await fetchCategories();

      expect(executeGraphQL).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });

    it('should return empty array on error', async () => {
      (executeGraphQL as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const { fetchCategories } = useCategories();
      const result = await fetchCategories();

      expect(result).toEqual([]);
    });
  });

  describe('useTags', () => {
    it('should fetch tags successfully', async () => {
      const mockResponse = { tags: mockTags };
      (executeGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { fetchTags } = useTags();
      const result = await fetchTags();

      expect(executeGraphQL).toHaveBeenCalled();
      expect(result).toEqual(mockTags);
    });

    it('should return empty array on error', async () => {
      (executeGraphQL as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const { fetchTags } = useTags();
      const result = await fetchTags();

      expect(result).toEqual([]);
    });
  });

  describe('usePostTags', () => {
    it('should fetch tags for a specific post', async () => {
      const mockResponse = { postTags: mockTags.slice(0, 3) };
      (executeGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { fetchPostTags } = usePostTags(1);
      const result = await fetchPostTags();

      expect(executeGraphQL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ postId: 1 }),
      );
      expect(result).toEqual(mockTags.slice(0, 3));
    });

    it('should return empty array when postId is 0', async () => {
      const { fetchPostTags } = usePostTags(0);
      const result = await fetchPostTags();

      expect(executeGraphQL).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('useComments', () => {
    it('should fetch comments successfully', async () => {
      const mockResponse = {
        comments: {
          items: mockComments,
          total: mockComments.length,
          page: 1,
          pageSize: 10,
        },
      };
      (executeGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { fetchComments } = useComments(1, 'APPROVED', 1, 10);
      const result = await fetchComments();

      expect(executeGraphQL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ postId: 1, status: 'APPROVED' }),
      );
      expect(result.items).toEqual(mockComments);
      expect(result.total).toBe(mockComments.length);
    });

    it('should return empty result when postId is 0', async () => {
      const { fetchComments } = useComments(0);
      const result = await fetchComments();

      expect(executeGraphQL).not.toHaveBeenCalled();
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should return empty result on error', async () => {
      (executeGraphQL as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const { fetchComments } = useComments(1);
      const result = await fetchComments();

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('useCommentStats', () => {
    it('should fetch comment stats successfully', async () => {
      const mockResponse = {
        commentStats: {
          total: 10,
          pending: 2,
          approved: 7,
          rejected: 1,
        },
      };
      (executeGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { fetchCommentStats } = useCommentStats(1);
      const result = await fetchCommentStats();

      expect(executeGraphQL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ postId: 1 }),
      );
      expect(result).toEqual({ total: 10, pending: 2, approved: 7, rejected: 1 });
    });

    it('should return default stats when postId is 0', async () => {
      const { fetchCommentStats } = useCommentStats(0);
      const result = await fetchCommentStats();

      expect(executeGraphQL).not.toHaveBeenCalled();
      expect(result).toEqual({ total: 0, pending: 0, approved: 0, rejected: 0 });
    });
  });

  describe('useLinks', () => {
    it('should fetch links successfully', async () => {
      const mockResponse = { links: mockLinks };
      (executeGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { fetchLinks } = useLinks();
      const result = await fetchLinks();

      expect(executeGraphQL).toHaveBeenCalled();
      expect(result).toEqual(mockLinks);
    });

    it('should return empty array on error', async () => {
      (executeGraphQL as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const { fetchLinks } = useLinks();
      const result = await fetchLinks();

      expect(result).toEqual([]);
    });
  });
});