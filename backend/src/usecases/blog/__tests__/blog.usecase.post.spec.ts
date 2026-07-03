// src/usecases/blog/__tests__/blog.usecase.post.spec.ts

import { PostStatus } from '@app-types/models/blog/blog.types';
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

describe('BlogUsecase - Post Operations', () => {
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
    return { usecase, blogService, blogQueryService, notifyCommentUsecase, transactionRunner };
  };

  describe('createPost', () => {
    it('should create a post', async () => {
      const { usecase, blogService } = setup();
      blogService.createPost.mockResolvedValue({ id: 1, title: 'Test Post', slug: 'test-post' });

      const result = await usecase.createPost({
        data: { title: 'Test Post', slug: 'test-post', content: 'Content' },
      });

      expect(result.post.id).toBe(1);
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const { usecase, blogService } = setup();
      blogService.updatePost.mockResolvedValue();

      const result = await usecase.updatePost({
        id: 1,
        data: { title: 'Updated Title', status: PostStatus.PUBLISHED },
      });

      expect(result.success).toBe(true);
    });

    it('should update post with tags', async () => {
      const { usecase, blogService } = setup();
      blogService.updatePost.mockResolvedValue();
      blogService.clearPostTags.mockResolvedValue();
      blogService.addTagsToPost.mockResolvedValue();

      const result = await usecase.updatePost({
        id: 1,
        data: { title: 'Updated Title', tagIds: [1, 2, 3] },
      });

      expect(result.success).toBe(true);
      expect(blogService.clearPostTags).toHaveBeenCalled();
    });

    it('should throw when post update fails', async () => {
      const { usecase, blogService } = setup();
      blogService.updatePost.mockRejectedValue(new Error('Update failed'));

      await expect(usecase.updatePost({ id: 1, data: { title: 'Updated Title' } })).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const { usecase, blogService } = setup();
      blogService.deletePost.mockResolvedValue(true);

      const result = await usecase.deletePost({ id: 1 });

      expect(result.success).toBe(true);
    });

    it('should return success even when post does not exist', async () => {
      const { usecase, blogService } = setup();
      blogService.deletePost.mockResolvedValue(false);

      const result = await usecase.deletePost({ id: 999 });

      expect(result.success).toBe(true);
    });

    it('should throw when delete fails with error', async () => {
      const { usecase, blogService } = setup();
      blogService.deletePost.mockRejectedValue(new Error('Database error'));

      await expect(usecase.deletePost({ id: 1 })).rejects.toThrow('Database error');
    });
  });

  describe('publishPost', () => {
    it('should publish a post', async () => {
      const { usecase, blogService } = setup();
      blogService.updatePost.mockResolvedValue();

      const result = await usecase.publishPost({ id: 1 });

      expect(result.success).toBe(true);
      expect(blogService.updatePost).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: PostStatus.PUBLISHED },
        }),
      );
    });
  });

  describe('unpublishPost', () => {
    it('should unpublish a post', async () => {
      const { usecase, blogService } = setup();
      blogService.updatePost.mockResolvedValue();

      const result = await usecase.unpublishPost({ id: 1 });

      expect(result.success).toBe(true);
      expect(blogService.updatePost).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: PostStatus.DRAFT },
        }),
      );
    });
  });

  describe('viewPost', () => {
    it('should increment view count and return post', async () => {
      const { usecase, blogService, blogQueryService } = setup();
      blogService.incrementViewCount.mockResolvedValue();
      blogQueryService.getPostById.mockResolvedValue(mockPost);

      const result = await usecase.viewPost({ id: 1 });

      expect(result?.id).toBe(1);
      expect(blogService.incrementViewCount).toHaveBeenCalled();
    });

    it('should return null when post does not exist', async () => {
      const { usecase, blogService, blogQueryService } = setup();
      blogService.incrementViewCount.mockResolvedValue();
      blogQueryService.getPostById.mockResolvedValue(null);

      const result = await usecase.viewPost({ id: 999 });

      expect(result).toBeNull();
      expect(blogService.incrementViewCount).toHaveBeenCalled();
    });
  });

  describe('likePost', () => {
    it('should increment like count', async () => {
      const { usecase, blogService } = setup();
      blogService.incrementLikeCount.mockResolvedValue();

      await usecase.likePost({ id: 1 });

      expect(blogService.incrementLikeCount).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
      );
    });
  });
});
