// src/usecases/blog/blog.usecase.spec.ts
import { PostStatus, CommentStatus } from '@app-types/models/blog/blog.types';
import { BlogUsecase } from './blog.usecase';

type BlogServiceMock = {
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

type BlogQueryServiceMock = {
  readonly getPostById: jest.Mock<Promise<any>>;
  readonly getPostBySlug: jest.Mock<Promise<any>>;
  readonly getCommentById: jest.Mock;
};

type NotifyCommentUsecaseMock = {
  readonly notifyNewComment: jest.Mock<Promise<void>>;
  readonly notifyCommentReply: jest.Mock<Promise<void>>;
};

type TransactionRunnerMock = {
  readonly run: jest.Mock<Promise<any>>;
};

describe('BlogUsecase', () => {
  let blogService: BlogServiceMock;
  let blogQueryService: BlogQueryServiceMock;
  let notifyCommentUsecase: NotifyCommentUsecaseMock;
  let transactionRunner: TransactionRunnerMock;
  let usecase: BlogUsecase;

  const siteUrl = 'https://test-blog.com';
  const ownerEmail = 'admin@test.com';

  beforeEach(() => {
    blogService = {
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

    blogQueryService = {
      getPostById: jest.fn(),
      getPostBySlug: jest.fn(),
      getCommentById: jest.fn(),
    };

    notifyCommentUsecase = {
      notifyNewComment: jest.fn(),
      notifyCommentReply: jest.fn(),
    };

    transactionRunner = {
      run: jest.fn((fn: any) => fn({} as any)),
    };

    usecase = new BlogUsecase(
      blogService as any,
      blogQueryService as any,
      notifyCommentUsecase as any,
      siteUrl,
      ownerEmail,
      transactionRunner,
    );
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        status: PostStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      blogService.createPost.mockResolvedValue(mockPost);

      const result = await usecase.createPost({
        data: {
          title: 'Test Post',
          slug: 'test-post',
          content: 'Content',
        },
      });

      expect(result.post.id).toBe(1);
      expect(result.post.title).toBe('Test Post');
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      blogService.updatePost.mockResolvedValue();

      const result = await usecase.updatePost({
        id: 1,
        data: {
          title: 'Updated Title',
          status: PostStatus.PUBLISHED,
        },
      });

      expect(result.success).toBe(true);
    });

    it('should update post with tags', async () => {
      blogService.updatePost.mockResolvedValue();
      blogService.clearPostTags.mockResolvedValue();
      blogService.addTagsToPost.mockResolvedValue();

      const result = await usecase.updatePost({
        id: 1,
        data: {
          title: 'Updated Title',
          tagIds: [1, 2, 3],
        },
      });

      expect(result.success).toBe(true);
      expect(blogService.clearPostTags).toHaveBeenCalled();
      expect(blogService.addTagsToPost).toHaveBeenCalled();
    });

    it('should return failure when post update fails', async () => {
      blogService.updatePost.mockRejectedValue(new Error('Update failed'));

      const result = await usecase.updatePost({
        id: 1,
        data: { title: 'Updated Title' },
      });

      expect(result.success).toBe(false);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      blogService.deletePost.mockResolvedValue(true);

      const result = await usecase.deletePost({ id: 1 });

      expect(result.success).toBe(true);
    });

    it('should return failure when post does not exist', async () => {
      blogService.deletePost.mockResolvedValue(false);

      const result = await usecase.deletePost({ id: 999 });

      expect(result.success).toBe(false);
    });
  });

  describe('publishPost', () => {
    it('should publish a post', async () => {
      blogService.updatePost.mockResolvedValue();

      const result = await usecase.publishPost({ id: 1 });

      expect(result.success).toBe(true);
    });
  });

  describe('unpublishPost', () => {
    it('should unpublish a post', async () => {
      blogService.updatePost.mockResolvedValue();

      const result = await usecase.unpublishPost({ id: 1 });

      expect(result.success).toBe(true);
    });
  });

  describe('viewPost', () => {
    it('should increment view count and return post', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        viewCount: 10,
      };

      blogService.incrementViewCount.mockResolvedValue();
      blogQueryService.getPostById.mockResolvedValue(mockPost);

      const result = await usecase.viewPost({ id: 1 });

      expect(result?.id).toBe(1);
      expect(result?.title).toBe('Test Post');
      expect(blogService.incrementViewCount).toHaveBeenCalled();
    });

    it('should return null when post does not exist', async () => {
      blogService.incrementViewCount.mockResolvedValue();
      blogQueryService.getPostById.mockResolvedValue(null);

      const result = await usecase.viewPost({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('likePost', () => {
    it('should increment like count', async () => {
      blogService.incrementLikeCount.mockResolvedValue();

      await usecase.likePost({ id: 1 });

      expect(blogService.incrementLikeCount).toHaveBeenCalled();
    });
  });

  describe('createComment', () => {
    it('should create a comment and notify blog owner', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
      };

      const mockComment = {
        id: 1,
        postId: 1,
        nickname: 'Test User',
        email: 'user@test.com',
        content: 'Test comment',
        status: CommentStatus.PENDING,
        createdAt: new Date(),
      };

      blogQueryService.getPostById.mockResolvedValue(mockPost);
      blogService.createComment.mockResolvedValue(mockComment);
      notifyCommentUsecase.notifyNewComment.mockResolvedValue();

      const result = await usecase.createComment({
        data: {
          postId: 1,
          nickname: 'Test User',
          email: 'user@test.com',
          content: 'Test comment',
        },
      });

      expect(result.comment.id).toBe(1);
      expect(result.comment.nickname).toBe('Test User');
      expect(notifyCommentUsecase.notifyNewComment).toHaveBeenCalled();
    });

    it('should create a comment and notify parent comment author when replying', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
      };

      const mockParentComment = {
        id: 10,
        postId: 1,
        nickname: 'Original User',
        email: 'original@test.com',
        content: 'Original comment',
        createdAt: new Date(),
      };

      const mockComment = {
        id: 11,
        postId: 1,
        parentId: 10,
        nickname: 'Reply User',
        email: 'reply@test.com',
        content: 'Reply comment',
        status: CommentStatus.PENDING,
        createdAt: new Date(),
      };

      blogQueryService.getPostById.mockResolvedValue(mockPost);
      blogQueryService.getCommentById.mockResolvedValue(mockParentComment);
      blogService.createComment.mockResolvedValue(mockComment);
      notifyCommentUsecase.notifyNewComment.mockResolvedValue();
      notifyCommentUsecase.notifyCommentReply.mockResolvedValue();

      const result = await usecase.createComment({
        data: {
          postId: 1,
          parentId: 10,
          nickname: 'Reply User',
          email: 'reply@test.com',
          content: 'Reply comment',
        },
      });

      expect(result.comment.id).toBe(11);
      expect(notifyCommentUsecase.notifyNewComment).toHaveBeenCalled();
      expect(notifyCommentUsecase.notifyCommentReply).toHaveBeenCalled();
    });

    it('should not notify when comment has no email', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
      };

      const mockComment = {
        id: 1,
        postId: 1,
        nickname: 'Anonymous',
        email: null,
        content: 'Test comment',
        status: CommentStatus.PENDING,
        createdAt: new Date(),
      };

      blogQueryService.getPostById.mockResolvedValue(mockPost);
      blogService.createComment.mockResolvedValue(mockComment);

      const result = await usecase.createComment({
        data: {
          postId: 1,
          nickname: 'Anonymous',
          content: 'Test comment',
        },
      });

      expect(result.comment.id).toBe(1);
      expect(notifyCommentUsecase.notifyNewComment).not.toHaveBeenCalled();
    });

    it('should not notify self when replying to own comment', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
      };

      const mockParentComment = {
        id: 10,
        postId: 1,
        nickname: 'Same User',
        email: 'same@test.com',
        content: 'Original comment',
        createdAt: new Date(),
      };

      const mockComment = {
        id: 11,
        postId: 1,
        parentId: 10,
        nickname: 'Same User',
        email: 'same@test.com',
        content: 'Self reply',
        status: CommentStatus.PENDING,
        createdAt: new Date(),
      };

      blogQueryService.getPostById.mockResolvedValue(mockPost);
      blogQueryService.getCommentById.mockResolvedValue(mockParentComment);
      blogService.createComment.mockResolvedValue(mockComment);
      notifyCommentUsecase.notifyNewComment.mockResolvedValue();
      notifyCommentUsecase.notifyCommentReply.mockResolvedValue();

      await usecase.createComment({
        data: {
          postId: 1,
          parentId: 10,
          nickname: 'Same User',
          email: 'same@test.com',
          content: 'Self reply',
        },
      });

      expect(notifyCommentUsecase.notifyNewComment).toHaveBeenCalled();
      expect(notifyCommentUsecase.notifyCommentReply).not.toHaveBeenCalled();
    });

    it('should not send notification when post is not found (guestbook scenario)', async () => {
      const mockComment = {
        id: 1,
        postId: 999,
        nickname: 'Test User',
        email: 'user@test.com',
        content: 'Test comment',
        status: CommentStatus.PENDING,
        createdAt: new Date(),
      };

      blogQueryService.getPostById.mockResolvedValue(null);
      blogService.createComment.mockResolvedValue(mockComment);

      const result = await usecase.createComment({
        data: {
          postId: 999,
          nickname: 'Test User',
          email: 'user@test.com',
          content: 'Test comment',
        },
      });

      expect(result.comment.id).toBe(1);
      expect(notifyCommentUsecase.notifyNewComment).not.toHaveBeenCalled();
    });

    it('should allow reply to root comment (depth 1)', async () => {
      const mockPost = { id: 1, title: 'Test Post', slug: 'test-post' };
      const mockRootComment = {
        id: 1,
        postId: 1,
        parentId: null,
        nickname: 'Root',
        email: 'root@test.com',
        content: 'Root',
        createdAt: new Date(),
      };
      const mockReply = {
        id: 2,
        postId: 1,
        parentId: 1,
        nickname: 'Reply User',
        email: 'reply@test.com',
        content: 'Reply to root',
        status: CommentStatus.PENDING,
        createdAt: new Date(),
      };

      blogQueryService.getPostById.mockResolvedValue(mockPost);
      blogQueryService.getCommentById.mockResolvedValue(mockRootComment);
      blogService.createComment.mockResolvedValue(mockReply);
      notifyCommentUsecase.notifyNewComment.mockResolvedValue();

      const result = await usecase.createComment({
        data: {
          postId: 1,
          parentId: 1,
          nickname: 'Reply User',
          email: 'reply@test.com',
          content: 'Reply to root',
        },
      });

      // 根评论 depth=1，回复后 depth=2，未超过限制
      expect(blogService.createComment).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ parentId: 1 }) }),
      );
      expect((result.comment as any).parentId).toBe(1);
    });

    it('should allow reply to level-2 comment (depth 2)', async () => {
      const mockPost = { id: 1, title: 'Test Post', slug: 'test-post' };
      // Level-2 comment: root(id=1) -> level1(id=2) -> level2(id=3)
      const mockLevel2Comment = {
        id: 3,
        postId: 1,
        parentId: 2,
        nickname: 'Level 2',
        email: 'level2@test.com',
        content: 'Level 2',
        createdAt: new Date(),
      };
      const mockReply = {
        id: 4,
        postId: 1,
        parentId: 3,
        nickname: 'Reply User',
        email: 'reply@test.com',
        content: 'Reply to level 2',
        status: CommentStatus.PENDING,
        createdAt: new Date(),
      };

      blogQueryService.getPostById.mockResolvedValue(mockPost);
      // Mock comment chain: id=3 -> id=2 -> id=1 -> null
      blogQueryService.getCommentById
        .mockResolvedValueOnce(mockLevel2Comment) // First call for depth check
        .mockResolvedValueOnce({
          id: 2,
          postId: 1,
          parentId: 1,
          nickname: 'L1',
          email: 'l1@test.com',
          content: 'L1',
          createdAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: 1,
          postId: 1,
          parentId: null,
          nickname: 'Root',
          email: 'root@test.com',
          content: 'Root',
          createdAt: new Date(),
        });
      blogService.createComment.mockResolvedValue(mockReply);
      notifyCommentUsecase.notifyNewComment.mockResolvedValue();

      const result = await usecase.createComment({
        data: {
          postId: 1,
          parentId: 3,
          nickname: 'Reply User',
          email: 'reply@test.com',
          content: 'Reply to level 2',
        },
      });

      // Level-2 comment depth=3，回复后 depth=4，超过限制，应该挂到根评论
      expect((result.comment as any).parentId).toBe(1); // Should redirect to root comment
    });

    it('should redirect to root comment when replying to level-3 comment', async () => {
      const mockPost = { id: 1, title: 'Test Post', slug: 'test-post' };
      // Level-3 comment chain: id=1 -> id=2 -> id=3 -> id=4
      const mockLevel3Comment = {
        id: 4,
        postId: 1,
        parentId: 3,
        nickname: 'Level 3',
        email: 'level3@test.com',
        content: 'Level 3',
        createdAt: new Date(),
      };
      const mockReply = {
        id: 5,
        postId: 1,
        parentId: 1, // Redirected to root
        nickname: 'Reply User',
        email: 'reply@test.com',
        content: 'Reply to level 3',
        status: CommentStatus.PENDING,
        createdAt: new Date(),
      };

      blogQueryService.getPostById.mockResolvedValue(mockPost);
      // Mock full comment chain
      blogQueryService.getCommentById
        .mockResolvedValueOnce(mockLevel3Comment)
        .mockResolvedValueOnce({
          id: 3,
          postId: 1,
          parentId: 2,
          nickname: 'L3',
          email: 'l3@test.com',
          content: 'L3',
          createdAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: 2,
          postId: 1,
          parentId: 1,
          nickname: 'L2',
          email: 'l2@test.com',
          content: 'L2',
          createdAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: 1,
          postId: 1,
          parentId: null,
          nickname: 'Root',
          email: 'root@test.com',
          content: 'Root',
          createdAt: new Date(),
        });
      blogService.createComment.mockResolvedValue(mockReply);
      notifyCommentUsecase.notifyNewComment.mockResolvedValue();

      const result = await usecase.createComment({
        data: {
          postId: 1,
          parentId: 4,
          nickname: 'Reply User',
          email: 'reply@test.com',
          content: 'Reply to level 3',
        },
      });

      // 验证评论被重定向到根评论
      expect(blogService.createComment).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ parentId: 1 }) }),
      );
      expect((result.comment as any).parentId).toBe(1);
    });

    it('should handle missing parent comment gracefully', async () => {
      const mockPost = { id: 1, title: 'Test Post', slug: 'test-post' };
      const mockComment = {
        id: 1,
        postId: 1,
        parentId: 999, // Non-existent parent
        nickname: 'Test User',
        email: 'user@test.com',
        content: 'Test comment',
        status: CommentStatus.PENDING,
        createdAt: new Date(),
      };

      blogQueryService.getPostById.mockResolvedValue(mockPost);
      blogQueryService.getCommentById.mockResolvedValue(null); // Parent not found
      blogService.createComment.mockResolvedValue(mockComment);
      notifyCommentUsecase.notifyNewComment.mockResolvedValue();

      const result = await usecase.createComment({
        data: {
          postId: 1,
          parentId: 999,
          nickname: 'Test User',
          email: 'user@test.com',
          content: 'Test comment',
        },
      });

      // 父评论不存在时，应该使用原始 parentId
      expect((result.comment as any).parentId).toBe(999);
      expect(notifyCommentUsecase.notifyNewComment).toHaveBeenCalled();
    });
  });

  describe('likeComment', () => {
    it('should increment comment like count', async () => {
      blogService.incrementCommentLikeCount.mockResolvedValue();

      await usecase.likeComment({ id: 1 });

      expect(blogService.incrementCommentLikeCount).toHaveBeenCalled();
    });
  });

  describe('getPostById', () => {
    it('should return post by id', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
      };

      blogQueryService.getPostById.mockResolvedValue(mockPost);

      const result = await usecase.getPostById({ id: 1 });

      expect(result?.id).toBe(1);
      expect(result?.title).toBe('Test Post');
    });

    it('should return null when post does not exist', async () => {
      blogQueryService.getPostById.mockResolvedValue(null);

      const result = await usecase.getPostById({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('getPostBySlug', () => {
    it('should return post by slug', async () => {
      const mockPost = {
        id: 1,
        slug: 'test-post',
        title: 'Test Post',
      };

      blogQueryService.getPostBySlug.mockResolvedValue(mockPost);

      const result = await usecase.getPostBySlug({ slug: 'test-post' });

      expect(result?.slug).toBe('test-post');
      expect(result?.title).toBe('Test Post');
    });

    it('should return null when post does not exist', async () => {
      blogQueryService.getPostBySlug.mockResolvedValue(null);

      const result = await usecase.getPostBySlug({ slug: 'non-existent' });

      expect(result).toBeNull();
    });
  });
});
