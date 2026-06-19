// src/usecases/blog/__tests__/blog.usecase.comment.reply2.spec.ts
import { CommentStatus } from '@app-types/models/blog/blog.types';
import { BlogUsecase } from '../blog.usecase';

const siteUrl = 'https://test-blog.com';
const ownerEmail = 'admin@test.com';

const createBlogServiceMock = () => ({
  createPost: jest.fn(), updatePost: jest.fn(), deletePost: jest.fn(),
  incrementViewCount: jest.fn(), incrementLikeCount: jest.fn(),
  clearPostTags: jest.fn(), addTagsToPost: jest.fn(),
  createComment: jest.fn(), incrementCommentLikeCount: jest.fn(),
});

const createBlogQueryServiceMock = () => ({
  getPostById: jest.fn(), getPostBySlug: jest.fn(), getCommentById: jest.fn(),
});

const createNotifyCommentUsecaseMock = () => ({
  notifyNewComment: jest.fn(), notifyCommentReply: jest.fn(),
});

const createTransactionRunnerMock = () => ({
  run: jest.fn((fn: any) => fn({} as any)),
});

const mockPost = Object.freeze({ id: 1, title: 'Test Post', slug: 'test-post' });

describe('BlogUsecase - Comment Reply 2', () => {
  it('should not notify self when replying to own comment', async () => {
    const blogService = createBlogServiceMock();
    const blogQueryService = createBlogQueryServiceMock();
    const notifyCommentUsecase = createNotifyCommentUsecaseMock();
    const usecase = new BlogUsecase(
      blogService as any, blogQueryService as any, notifyCommentUsecase as any,
      siteUrl, ownerEmail, createTransactionRunnerMock(),
    );
    const parent = { id: 10, postId: 1, parentId: null, nickname: 'Same', email: 'same@test.com', content: 'Original', createdAt: new Date() };
    const reply = { id: 11, postId: 1, parentId: 10, nickname: 'Same', email: 'same@test.com', content: 'Self reply', status: CommentStatus.PENDING, createdAt: new Date() };
    blogQueryService.getPostById.mockResolvedValue(mockPost);
    blogQueryService.getCommentById.mockResolvedValue(parent);
    blogService.createComment.mockResolvedValue(reply);
    notifyCommentUsecase.notifyNewComment.mockResolvedValue(undefined);
    notifyCommentUsecase.notifyCommentReply.mockResolvedValue(undefined);

    await usecase.createComment({
      data: { postId: 1, parentId: 10, nickname: 'Same', email: 'same@test.com', content: 'Self reply' },
    });

    expect(notifyCommentUsecase.notifyCommentReply).not.toHaveBeenCalled();
  });
});
