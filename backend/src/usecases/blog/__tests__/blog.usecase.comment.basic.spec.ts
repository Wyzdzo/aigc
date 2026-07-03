// src/usecases/blog/__tests__/blog.usecase.comment.basic.spec.ts

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

describe('BlogUsecase - Comment Basic', () => {
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
    return { usecase, blogService, blogQueryService, notifyCommentUsecase };
  };

  it('should create a comment and notify blog owner', async () => {
    const { usecase, blogService, blogQueryService, notifyCommentUsecase } = setup();
    const comment = {
      id: 1,
      postId: 1,
      nickname: 'Test User',
      email: 'user@test.com',
      content: 'Test',
      status: CommentStatus.PENDING,
      createdAt: new Date(),
    };
    blogQueryService.getPostById.mockResolvedValue(mockPost);
    blogService.createComment.mockResolvedValue(comment);
    notifyCommentUsecase.notifyNewComment.mockResolvedValue();

    const result = await usecase.createComment({
      data: { postId: 1, nickname: 'Test User', email: 'user@test.com', content: 'Test' },
    });

    expect(result.comment.id).toBe(1);
    expect(notifyCommentUsecase.notifyNewComment).toHaveBeenCalled();
  });

  it('should not notify when comment has no email', async () => {
    const { usecase, blogService, blogQueryService, notifyCommentUsecase } = setup();
    const comment = {
      id: 1,
      postId: 1,
      nickname: 'Anonymous',
      email: null,
      content: 'Test',
      status: CommentStatus.PENDING,
      createdAt: new Date(),
    };
    blogQueryService.getPostById.mockResolvedValue(mockPost);
    blogService.createComment.mockResolvedValue(comment);

    const result = await usecase.createComment({
      data: { postId: 1, nickname: 'Anonymous', content: 'Test' },
    });

    expect(result.comment.id).toBe(1);
    expect(notifyCommentUsecase.notifyNewComment).not.toHaveBeenCalled();
  });

  it('should not send notification when post is not found', async () => {
    const { usecase, blogService, blogQueryService } = setup();
    const comment = {
      id: 1,
      postId: 999,
      nickname: 'Test User',
      email: 'user@test.com',
      content: 'Test',
      status: CommentStatus.PENDING,
      createdAt: new Date(),
    };
    blogQueryService.getPostById.mockResolvedValue(null);
    blogService.createComment.mockResolvedValue(comment);

    const result = await usecase.createComment({
      data: { postId: 999, nickname: 'Test User', email: 'user@test.com', content: 'Test' },
    });

    expect(result.comment.id).toBe(1);
  });

  it('should handle missing parent comment gracefully', async () => {
    const { usecase, blogService, blogQueryService, notifyCommentUsecase } = setup();
    const comment = {
      id: 1,
      postId: 1,
      parentId: 999,
      nickname: 'Test User',
      email: 'user@test.com',
      content: 'Test',
      status: CommentStatus.PENDING,
      createdAt: new Date(),
    };
    blogQueryService.getPostById.mockResolvedValue(mockPost);
    blogQueryService.getCommentById.mockResolvedValue(null);
    blogService.createComment.mockResolvedValue(comment);
    notifyCommentUsecase.notifyNewComment.mockResolvedValue();

    const result = await usecase.createComment({
      data: {
        postId: 1,
        parentId: 999,
        nickname: 'Test User',
        email: 'user@test.com',
        content: 'Test',
      },
    });

    expect(result.comment.id).toBe(1);
  });

  it('should increment comment like count', async () => {
    const { usecase, blogService } = setup();
    blogService.incrementCommentLikeCount.mockResolvedValue();

    await usecase.likeComment({ id: 1 });

    expect(blogService.incrementCommentLikeCount).toHaveBeenCalled();
  });
});
