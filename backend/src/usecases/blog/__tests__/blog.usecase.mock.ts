// src/usecases/blog/__tests__/blog.usecase.mock.ts

import { PostStatus, CommentStatus } from '@app-types/models/blog/blog.types';

export const siteUrl = 'https://test-blog.com';
export const ownerEmail = 'admin@test.com';

export type BlogServiceMock = {
  readonly createPost: jest.Mock<Promise<any>>;
  readonly updatePost: jest.Mock<Promise<void>>;
  readonly deletePost: jest.Mock<Promise<boolean>>;
  readonly incrementViewCount: jest.Mock<Promise<void>>;
  readonly incrementLikeCount: jest.Mock<Promise<void>>;
  readonly clearPostTags: jest.Mock<Promise<void>>;
  readonly addTagsToPost: jest.Mock<Promise<void>>;
  readonly createComment: jest.Mock<Promise<any>>;
  readonly incrementCommentLikeCount: jest.Mock<Promise<void>>;
};

export type BlogQueryServiceMock = {
  readonly getPostById: jest.Mock<Promise<any>>;
  readonly getPostBySlug: jest.Mock<Promise<any>>;
  readonly getCommentById: jest.Mock;
};

export type NotifyCommentUsecaseMock = {
  readonly notifyNewComment: jest.Mock<Promise<void>>;
  readonly notifyCommentReply: jest.Mock<Promise<void>>;
};

export type TransactionRunnerMock = {
  readonly run: jest.Mock<Promise<any>>;
};

export function createBlogServiceMock(): BlogServiceMock {
  return {
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    incrementViewCount: jest.fn(),
    incrementLikeCount: jest.fn(),
    clearPostTags: jest.fn(),
    addTagsToPost: jest.fn(),
    createComment: jest.fn(),
    incrementCommentLikeCount: jest.fn(),
  };
}

export function createBlogQueryServiceMock(): BlogQueryServiceMock {
  return {
    getPostById: jest.fn(),
    getPostBySlug: jest.fn(),
    getCommentById: jest.fn(),
  };
}

export function createNotifyCommentUsecaseMock(): NotifyCommentUsecaseMock {
  return {
    notifyNewComment: jest.fn(),
    notifyCommentReply: jest.fn(),
  };
}

export function createTransactionRunnerMock(): TransactionRunnerMock {
  return {
    run: jest.fn((fn: any) => fn({} as any)),
  };
}

export const mockPost = Object.freeze({
  id: 1,
  title: 'Test Post',
  slug: 'test-post',
});

export const mockComment = Object.freeze({
  id: 1,
  postId: 1,
  nickname: 'Test User',
  email: 'user@test.com',
  content: 'Test comment',
  status: CommentStatus.PENDING,
  createdAt: new Date('2024-01-01'),
});

export const mockParentComment = Object.freeze({
  id: 2,
  postId: 1,
  parentId: 1,
  nickname: 'Parent User',
  email: 'parent@test.com',
  content: 'Parent comment',
  status: CommentStatus.APPROVED,
  createdAt: new Date('2024-01-01'),
});

export const mockRootComment = Object.freeze({
  id: 3,
  postId: 1,
  parentId: null,
  nickname: 'Root User',
  email: 'root@test.com',
  content: 'Root comment',
  status: CommentStatus.APPROVED,
  createdAt: new Date('2024-01-01'),
});
