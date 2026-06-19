// src/usecases/blog/__tests__/blog.usecase.comment.reply3.spec.ts
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

const commentsById: Record<number, any> = {
  1: { id: 1, postId: 1, parentId: null, nickname: 'Root', email: 'root@test.com', content: 'Root', createdAt: new Date() },
  2: { id: 2, postId: 1, parentId: 1, nickname: 'L2', email: 'l2@test.com', content: 'L2', createdAt: new Date() },
  3: { id: 3, postId: 1, parentId: 2, nickname: 'L3', email: 'l3@test.com', content: 'L3', createdAt: new Date() },
  4: { id: 4, postId: 1, parentId: 3, nickname: 'L4', email: 'l4@test.com', content: 'L4', createdAt: new Date() },
};

describe('BlogUsecase - Comment Reply 3', () => {
  it('should redirect deep replies to root comment', async () => {
    const blogService = createBlogServiceMock();
    const blogQueryService = createBlogQueryServiceMock();
    const notifyCommentUsecase = createNotifyCommentUsecaseMock();
    const usecase = new BlogUsecase(
      blogService as any, blogQueryService as any, notifyCommentUsecase as any,
      siteUrl, ownerEmail, createTransactionRunnerMock(),
    );
    const reply = { id: 5, postId: 1, parentId: 1, nickname: 'Reply', email: 'reply@test.com', content: 'Reply', status: CommentStatus.PENDING, createdAt: new Date() };
    blogQueryService.getPostById.mockResolvedValue(mockPost);
    blogQueryService.getCommentById.mockImplementation((params: { id: number }) => {
      return Promise.resolve(commentsById[params.id] ?? null);
    });
    blogService.createComment.mockResolvedValue(reply);
    notifyCommentUsecase.notifyNewComment.mockResolvedValue(undefined);
    notifyCommentUsecase.notifyCommentReply.mockResolvedValue(undefined);

    const result = await usecase.createComment({
      data: { postId: 1, parentId: 4, nickname: 'Reply', email: 'reply@test.com', content: 'Reply' },
    });

    expect(blogService.createComment).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ parentId: 1 }) }),
    );
    expect(result.comment.id).toBe(5);
  });
});
