// src/usecases/blog/__tests__/blog.usecase.query.spec.ts

import { CommentStatus } from '@app-types/models/blog/blog.types';
import { BlogUsecase } from '../blog.usecase';
import {
  createBlogServiceMock,
  createBlogQueryServiceMock,
  createNotifyCommentUsecaseMock,
  createTransactionRunnerMock,
  mockPost,
  siteUrl,
  ownerEmail,
} from './blog.usecase.mock';

describe('BlogUsecase - Query Operations', () => {
  const setup = () => {
    const blogService = createBlogServiceMock();
    const blogQueryService = createBlogQueryServiceMock();
    const notifyCommentUsecase = createNotifyCommentUsecaseMock();
    const transactionRunner = createTransactionRunnerMock();
    const usecase = new BlogUsecase(
      blogService as any,
      blogQueryService as any,
      notifyCommentUsecase as any,
      siteUrl,
      ownerEmail,
      transactionRunner,
    );
    return { usecase, blogQueryService };
  };

  describe('getPostById (notification view)', () => {
    it('should return post by id', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getPostById.mockResolvedValue(mockPost);

      const result = await usecase.getPostById({ id: 1 });

      expect(result?.id).toBe(1);
      expect(result?.title).toBe('Test Post');
    });

    it('should return null when post does not exist', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getPostById.mockResolvedValue(null);

      const result = await usecase.getPostById({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('getPostBySlug (notification view)', () => {
    it('should return post by slug', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getPostBySlug.mockResolvedValue(mockPost);

      const result = await usecase.getPostBySlug({ slug: 'test-post' });

      expect(result?.slug).toBe('test-post');
    });

    it('should return null when post does not exist', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getPostBySlug.mockResolvedValue(null);

      const result = await usecase.getPostBySlug({ slug: 'non-existent' });

      expect(result).toBeNull();
    });
  });

  describe('Read delegate methods (Resolver → Usecase → QueryService)', () => {
    it('findPostById should delegate to blogQueryService.getPostById', async () => {
      const { usecase, blogQueryService } = setup();
      const fullPost = { id: 1, title: 'Full Post', slug: 'full-post', content: 'content' };
      blogQueryService.getPostById.mockResolvedValue(fullPost);

      const result = await usecase.findPostById({ id: 1 });

      expect(blogQueryService.getPostById).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(fullPost);
    });

    it('findPostBySlug should delegate to blogQueryService.getPostBySlug', async () => {
      const { usecase, blogQueryService } = setup();
      const fullPost = { id: 1, title: 'Full Post', slug: 'full-post', content: 'content' };
      blogQueryService.getPostBySlug.mockResolvedValue(fullPost);

      const result = await usecase.findPostBySlug({ slug: 'full-post' });

      expect(blogQueryService.getPostBySlug).toHaveBeenCalledWith({ slug: 'full-post' });
      expect(result).toEqual(fullPost);
    });

    it('getPosts should delegate with correct params', async () => {
      const { usecase, blogQueryService } = setup();
      const postsResult = { items: [mockPost], total: 1, page: 1, pageSize: 10 };
      blogQueryService.getPosts.mockResolvedValue(postsResult);

      const params = { options: { page: 1, pageSize: 10 } };
      const result = await usecase.getPosts(params);

      expect(blogQueryService.getPosts).toHaveBeenCalledWith(params);
      expect(result).toEqual(postsResult);
    });

    it('getTopPosts should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getTopPosts.mockResolvedValue([mockPost]);

      const result = await usecase.getTopPosts({});

      expect(blogQueryService.getTopPosts).toHaveBeenCalledWith({});
      expect(result).toEqual([mockPost]);
    });

    it('getCommentCountByPost should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getCommentCountByPost.mockResolvedValue({ total: 5 });

      const result = await usecase.getCommentCountByPost({ postId: 1 });

      expect(blogQueryService.getCommentCountByPost).toHaveBeenCalledWith({ postId: 1 });
      expect(result).toEqual({ total: 5 });
    });

    it('getCommentCountByPosts should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getCommentCountByPosts.mockResolvedValue([{ postId: 1, total: 3 }]);

      const result = await usecase.getCommentCountByPosts({ postIds: [1, 2] });

      expect(blogQueryService.getCommentCountByPosts).toHaveBeenCalledWith({ postIds: [1, 2] });
      expect(result).toEqual([{ postId: 1, total: 3 }]);
    });

    it('getAllCategories should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      const categories = [{ id: 1, name: 'Tech' }];
      blogQueryService.getAllCategories.mockResolvedValue(categories);

      const result = await usecase.getAllCategories({});

      expect(blogQueryService.getAllCategories).toHaveBeenCalledWith({});
      expect(result).toEqual(categories);
    });

    it('getCategoryById should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      const category = { id: 1, name: 'Tech' };
      blogQueryService.getCategoryById.mockResolvedValue(category);

      const result = await usecase.getCategoryById({ id: 1 });

      expect(blogQueryService.getCategoryById).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(category);
    });

    it('getCategoryBySlug should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      const category = { id: 1, name: 'Tech', slug: 'tech' };
      blogQueryService.getCategoryBySlug.mockResolvedValue(category);

      const result = await usecase.getCategoryBySlug({ slug: 'tech' });

      expect(blogQueryService.getCategoryBySlug).toHaveBeenCalledWith({ slug: 'tech' });
      expect(result).toEqual(category);
    });

    it('getCategoryTree should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getCategoryTree.mockResolvedValue([]);

      const result = await usecase.getCategoryTree({});

      expect(blogQueryService.getCategoryTree).toHaveBeenCalledWith({});
      expect(result).toEqual([]);
    });

    it('getAllTags should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getAllTags.mockResolvedValue([]);

      const result = await usecase.getAllTags({});

      expect(blogQueryService.getAllTags).toHaveBeenCalledWith({});
      expect(result).toEqual([]);
    });

    it('getTagById should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      const tag = { id: 1, name: 'React' };
      blogQueryService.getTagById.mockResolvedValue(tag);

      const result = await usecase.getTagById({ id: 1 });

      expect(blogQueryService.getTagById).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(tag);
    });

    it('getPostTags should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getPostTags.mockResolvedValue([]);

      const result = await usecase.getPostTags({ postId: 1 });

      expect(blogQueryService.getPostTags).toHaveBeenCalledWith({ postId: 1 });
      expect(result).toEqual([]);
    });

    it('getComments should delegate with correct params', async () => {
      const { usecase, blogQueryService } = setup();
      const commentsResult = { items: [], total: 0, page: 1, pageSize: 10 };
      blogQueryService.getComments.mockResolvedValue(commentsResult);

      const params = { options: { postId: 0, status: CommentStatus.APPROVED, page: 1, pageSize: 10 } };
      const result = await usecase.getComments(params);

      expect(blogQueryService.getComments).toHaveBeenCalledWith(params);
      expect(result).toEqual(commentsResult);
    });

    it('getComments should handle guestbook postId=0', async () => {
      const { usecase, blogQueryService } = setup();
      const guestbookComments = { items: [{ id: 1, content: '留言' }], total: 1, page: 1, pageSize: 10 };
      blogQueryService.getComments.mockResolvedValue(guestbookComments);

      const result = await usecase.getComments({ options: { postId: 0 } });

      expect(blogQueryService.getComments).toHaveBeenCalledWith({ options: { postId: 0 } });
      expect(result).toEqual(guestbookComments);
    });

    it('getPostStats should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      const stats = { total: 10, published: 8, draft: 2 };
      blogQueryService.getPostStats.mockResolvedValue(stats);

      const result = await usecase.getPostStats({});

      expect(blogQueryService.getPostStats).toHaveBeenCalledWith({});
      expect(result).toEqual(stats);
    });

    it('getCommentStats should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      const stats = { total: 20, pending: 5, approved: 14, rejected: 1 };
      blogQueryService.getCommentStats.mockResolvedValue(stats);

      const result = await usecase.getCommentStats({});

      expect(blogQueryService.getCommentStats).toHaveBeenCalledWith({});
      expect(result).toEqual(stats);
    });

    it('getCategoryStats should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getCategoryStats.mockResolvedValue({ total: 3 });

      const result = await usecase.getCategoryStats({});

      expect(blogQueryService.getCategoryStats).toHaveBeenCalledWith({});
      expect(result).toEqual({ total: 3 });
    });

    it('getTagStats should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getTagStats.mockResolvedValue({ total: 7 });

      const result = await usecase.getTagStats({});

      expect(blogQueryService.getTagStats).toHaveBeenCalledWith({});
      expect(result).toEqual({ total: 7 });
    });

    it('getLinkStats should delegate', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getLinkStats.mockResolvedValue({ total: 2 });

      const result = await usecase.getLinkStats({});

      expect(blogQueryService.getLinkStats).toHaveBeenCalledWith({});
      expect(result).toEqual({ total: 2 });
    });

    it('getAllLinks should delegate with default empty params', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getAllLinks.mockResolvedValue([]);

      const result = await usecase.getAllLinks();

      expect(blogQueryService.getAllLinks).toHaveBeenCalledWith({});
      expect(result).toEqual([]);
    });

    it('getAllLinks should delegate with status param', async () => {
      const { usecase, blogQueryService } = setup();
      blogQueryService.getAllLinks.mockResolvedValue([]);

      const result = await usecase.getAllLinks({ status: 'ACTIVE' as any });

      expect(blogQueryService.getAllLinks).toHaveBeenCalledWith({ status: 'ACTIVE' });
      expect(result).toEqual([]);
    });
  });
});
