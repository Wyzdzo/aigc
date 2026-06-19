// src/usecases/blog/__tests__/blog.usecase.query.spec.ts

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

  describe('getPostById', () => {
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

  describe('getPostBySlug', () => {
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
});
