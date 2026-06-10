// src/usecases/blog/blog.usecase.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from '@src/modules/blog/blog.service';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import { BlogUsecase } from './blog.usecase';
import { PostStatus, CommentStatus } from '@app-types/models/blog/blog.types';
import { BlogPostEntity } from '@src/modules/blog/entities/blog-post.entity';
import { BlogCommentEntity } from '@src/modules/blog/entities/blog-comment.entity';
import { TRANSACTION_RUNNER } from '@src/usecases/common/ports/transaction-runner.contract';

describe('BlogUsecase', () => {
  let usecase: BlogUsecase;
  let blogService: BlogService;
  let blogQueryService: BlogQueryService;

  const mockTransactionRunner = {
    run: jest.fn((fn) => fn({} as any)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogUsecase,
        {
          provide: BlogService,
          useValue: {
            createPost: jest.fn(),
            updatePost: jest.fn(),
            deletePost: jest.fn(),
            incrementViewCount: jest.fn(),
            incrementLikeCount: jest.fn(),
            clearPostTags: jest.fn(),
            addTagsToPost: jest.fn(),
            createComment: jest.fn(),
            incrementCommentLikeCount: jest.fn(),
          },
        },
        {
          provide: BlogQueryService,
          useValue: {
            getPostById: jest.fn(),
            getPostBySlug: jest.fn(),
          },
        },
        {
          provide: TRANSACTION_RUNNER,
          useValue: mockTransactionRunner,
        },
      ],
    }).compile();

    usecase = module.get<BlogUsecase>(BlogUsecase);
    blogService = module.get<BlogService>(BlogService);
    blogQueryService = module.get<BlogQueryService>(BlogQueryService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const mockPost: Partial<BlogPostEntity> = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        status: PostStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(blogService, 'createPost').mockResolvedValue(mockPost as BlogPostEntity);

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
      jest.spyOn(blogService, 'updatePost').mockResolvedValue();

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
      jest.spyOn(blogService, 'updatePost').mockResolvedValue();
      jest.spyOn(blogService, 'clearPostTags').mockResolvedValue();
      jest.spyOn(blogService, 'addTagsToPost').mockResolvedValue();

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
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      jest.spyOn(blogService, 'deletePost').mockResolvedValue();

      const result = await usecase.deletePost({ id: 1 });

      expect(result.success).toBe(true);
    });
  });

  describe('publishPost', () => {
    it('should publish a post', async () => {
      jest.spyOn(blogService, 'updatePost').mockResolvedValue();

      const result = await usecase.publishPost({ id: 1 });

      expect(result.success).toBe(true);
    });
  });

  describe('unpublishPost', () => {
    it('should unpublish a post', async () => {
      jest.spyOn(blogService, 'updatePost').mockResolvedValue();

      const result = await usecase.unpublishPost({ id: 1 });

      expect(result.success).toBe(true);
    });
  });

  describe('viewPost', () => {
    it('should increment view count and return post', async () => {
      const mockPost: Partial<BlogPostEntity> = {
        id: 1,
        title: 'Test Post',
        viewCount: 10,
      };

      jest.spyOn(blogService, 'incrementViewCount').mockResolvedValue();
      jest.spyOn(blogQueryService, 'getPostById').mockResolvedValue(mockPost as BlogPostEntity);

      const result = await usecase.viewPost({ id: 1 });

      expect(result?.id).toBe(1);
      expect(blogService.incrementViewCount).toHaveBeenCalled();
    });
  });

  describe('likePost', () => {
    it('should increment like count', async () => {
      jest.spyOn(blogService, 'incrementLikeCount').mockResolvedValue();

      await usecase.likePost({ id: 1 });

      expect(blogService.incrementLikeCount).toHaveBeenCalled();
    });
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const mockComment: Partial<BlogCommentEntity> = {
        id: 1,
        postId: 1,
        nickname: 'Test User',
        content: 'Test comment',
        status: CommentStatus.PENDING,
        createdAt: new Date(),
      };

      jest.spyOn(blogService, 'createComment').mockResolvedValue(mockComment as BlogCommentEntity);

      const result = await usecase.createComment({
        data: {
          postId: 1,
          nickname: 'Test User',
          content: 'Test comment',
        },
      });

      expect(result.comment.id).toBe(1);
      expect(result.comment.status).toBe(CommentStatus.PENDING);
    });
  });

  describe('likeComment', () => {
    it('should increment comment like count', async () => {
      jest.spyOn(blogService, 'incrementCommentLikeCount').mockResolvedValue();

      await usecase.likeComment({ id: 1 });

      expect(blogService.incrementCommentLikeCount).toHaveBeenCalled();
    });
  });

  describe('getPostById', () => {
    it('should return post by id', async () => {
      const mockPost: Partial<BlogPostEntity> = {
        id: 1,
        title: 'Test Post',
      };

      jest.spyOn(blogQueryService, 'getPostById').mockResolvedValue(mockPost as BlogPostEntity);

      const result = await usecase.getPostById({ id: 1 });

      expect(result?.id).toBe(1);
    });
  });

  describe('getPostBySlug', () => {
    it('should return post by slug', async () => {
      const mockPost: Partial<BlogPostEntity> = {
        id: 1,
        slug: 'test-post',
      };

      jest.spyOn(blogQueryService, 'getPostBySlug').mockResolvedValue(mockPost as BlogPostEntity);

      const result = await usecase.getPostBySlug({ slug: 'test-post' });

      expect(result?.slug).toBe('test-post');
    });
  });
});