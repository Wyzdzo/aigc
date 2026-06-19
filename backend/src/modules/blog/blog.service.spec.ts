// src/modules/blog/blog.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostStatus, CommentStatus, LinkStatus } from '@app-types/models/blog/blog.types';
import { BlogService } from './blog.service';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogCommentEntity } from './entities/blog-comment.entity';
import { BlogLinkEntity } from './entities/blog-link.entity';
import { BlogPostEntity } from './entities/blog-post.entity';
import { BlogPostTagEntity } from './entities/blog-post-tag.entity';
import { BlogTagEntity } from './entities/blog-tag.entity';

describe('BlogService', () => {
  let service: BlogService;
  let postRepository: Repository<BlogPostEntity>;
  let categoryRepository: Repository<BlogCategoryEntity>;
  let tagRepository: Repository<BlogTagEntity>;
  let postTagRepository: Repository<BlogPostTagEntity>;
  let commentRepository: Repository<BlogCommentEntity>;
  let linkRepository: Repository<BlogLinkEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(BlogPostEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BlogCategoryEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BlogTagEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BlogPostTagEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BlogCommentEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BlogLinkEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    postRepository = module.get<Repository<BlogPostEntity>>(getRepositoryToken(BlogPostEntity));
    categoryRepository = module.get<Repository<BlogCategoryEntity>>(
      getRepositoryToken(BlogCategoryEntity),
    );
    tagRepository = module.get<Repository<BlogTagEntity>>(getRepositoryToken(BlogTagEntity));
    postTagRepository = module.get<Repository<BlogPostTagEntity>>(
      getRepositoryToken(BlogPostTagEntity),
    );
    commentRepository = module.get<Repository<BlogCommentEntity>>(
      getRepositoryToken(BlogCommentEntity),
    );
    linkRepository = module.get<Repository<BlogLinkEntity>>(getRepositoryToken(BlogLinkEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post with default values', async () => {
      const createSpy = jest.spyOn(postRepository, 'create').mockReturnValue({
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        summary: null,
        coverImage: null,
        status: PostStatus.DRAFT,
        isTop: false,
        viewCount: 0,
        likeCount: 0,
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const saveSpy = jest.spyOn(postRepository, 'save').mockResolvedValue({
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        summary: null,
        coverImage: null,
        status: PostStatus.DRAFT,
        isTop: false,
        viewCount: 0,
        likeCount: 0,
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await service.createPost({
        data: {
          title: 'Test Post',
          slug: 'test-post',
          content: 'Content',
        },
      });

      expect(createSpy).toHaveBeenCalledWith({
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        summary: null,
        coverImage: null,
        status: PostStatus.DRAFT,
        isTop: false,
        viewCount: 0,
        likeCount: 0,
        categoryId: null,
      });
      expect(saveSpy).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.status).toBe(PostStatus.DRAFT);
    });

    it('should create a post with custom values', async () => {
      jest.spyOn(postRepository, 'create').mockReturnValue({
        id: 1,
        title: 'Custom Post',
        slug: 'custom-post',
        content: 'Custom Content',
        summary: 'Summary',
        coverImage: 'image.jpg',
        status: PostStatus.PUBLISHED,
        isTop: true,
        viewCount: 0,
        likeCount: 0,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(postRepository, 'save').mockResolvedValue({
        id: 1,
        title: 'Custom Post',
        slug: 'custom-post',
        content: 'Custom Content',
        summary: 'Summary',
        coverImage: 'image.jpg',
        status: PostStatus.PUBLISHED,
        isTop: true,
        viewCount: 0,
        likeCount: 0,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const addTagsSpy = jest.spyOn(service as any, 'addTagsToPost').mockResolvedValue(undefined);

      const result = await service.createPost({
        data: {
          title: 'Custom Post',
          slug: 'custom-post',
          content: 'Custom Content',
          summary: 'Summary',
          coverImage: 'image.jpg',
          status: PostStatus.PUBLISHED,
          isTop: true,
          categoryId: 1,
          tagIds: [1, 2, 3],
        },
      });

      expect(result.status).toBe(PostStatus.PUBLISHED);
      expect(result.isTop).toBe(true);
      expect(result.categoryId).toBe(1);
      expect(addTagsSpy).toHaveBeenCalledWith({
        postId: 1,
        tagIds: [1, 2, 3],
        transactionContext: undefined,
      });
    });
  });

  describe('updatePost', () => {
    it('should update post fields', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue({ id: 1 } as any);
      const updateSpy = jest
        .spyOn(postRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      await service.updatePost({
        id: 1,
        data: {
          title: 'Updated Title',
          status: PostStatus.PUBLISHED,
        },
      });

      expect(updateSpy).toHaveBeenCalledWith(1, {
        title: 'Updated Title',
        status: PostStatus.PUBLISHED,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException when post does not exist', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updatePost({
          id: 999,
          data: { title: 'Updated Title' },
        }),
      ).rejects.toThrow('Post with id 999 not found');
    });
  });

  describe('deletePost', () => {
    it('should soft delete a post and return true', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue({ id: 1 } as any);
      const softDeleteSpy = jest
        .spyOn(postRepository, 'softDelete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.deletePost({ id: 1 });

      expect(softDeleteSpy).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deletePost({ id: 999 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count', async () => {
      const incrementSpy = jest
        .spyOn(postRepository, 'increment')
        .mockResolvedValue({ affected: 1 } as any);

      await service.incrementViewCount({ id: 1 });

      expect(incrementSpy).toHaveBeenCalledWith({ id: 1 }, 'viewCount', 1);
    });
  });

  describe('incrementLikeCount', () => {
    it('should increment like count', async () => {
      const incrementSpy = jest
        .spyOn(postRepository, 'increment')
        .mockResolvedValue({ affected: 1 } as any);

      await service.incrementLikeCount({ id: 1 });

      expect(incrementSpy).toHaveBeenCalledWith({ id: 1 }, 'likeCount', 1);
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      jest.spyOn(categoryRepository, 'create').mockReturnValue({
        id: 1,
        name: 'Test Category',
        slug: 'test-category',
        description: null,
        parentId: null,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(categoryRepository, 'save').mockResolvedValue({
        id: 1,
        name: 'Test Category',
        slug: 'test-category',
        description: null,
        parentId: null,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.createCategory({
        name: 'Test Category',
        slug: 'test-category',
      });

      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Category');
    });
  });

  describe('createTag', () => {
    it('should create a tag', async () => {
      jest.spyOn(tagRepository, 'create').mockReturnValue({
        id: 1,
        name: 'Test Tag',
        slug: 'test-tag',
        createdAt: new Date(),
      });

      jest.spyOn(tagRepository, 'save').mockResolvedValue({
        id: 1,
        name: 'Test Tag',
        slug: 'test-tag',
        createdAt: new Date(),
      });

      const result = await service.createTag({
        name: 'Test Tag',
        slug: 'test-tag',
      });

      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Tag');
    });
  });

  describe('createComment', () => {
    it('should create a comment with default status', async () => {
      jest.spyOn(commentRepository, 'create').mockReturnValue({
        id: 1,
        postId: 1,
        parentId: null,
        nickname: 'Test User',
        email: null,
        avatar: null,
        content: 'Test comment',
        status: CommentStatus.PENDING,
        likeCount: 0,
        createdAt: new Date(),
      });

      jest.spyOn(commentRepository, 'save').mockResolvedValue({
        id: 1,
        postId: 1,
        parentId: null,
        nickname: 'Test User',
        email: null,
        avatar: null,
        content: 'Test comment',
        status: CommentStatus.PENDING,
        likeCount: 0,
        createdAt: new Date(),
      });

      const result = await service.createComment({
        data: {
          postId: 1,
          nickname: 'Test User',
          content: 'Test comment',
        },
      });

      expect(result.status).toBe(CommentStatus.PENDING);
      expect(result.likeCount).toBe(0);
    });
  });

  describe('createLink', () => {
    it('should create a link with default status', async () => {
      jest.spyOn(linkRepository, 'create').mockReturnValue({
        id: 1,
        title: 'Test Link',
        url: 'https://example.com',
        description: null,
        logo: null,
        sortOrder: 0,
        status: LinkStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(linkRepository, 'save').mockResolvedValue({
        id: 1,
        title: 'Test Link',
        url: 'https://example.com',
        description: null,
        logo: null,
        sortOrder: 0,
        status: LinkStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.createLink({
        title: 'Test Link',
        url: 'https://example.com',
      });

      expect(result.status).toBe(LinkStatus.ACTIVE);
    });
  });

  describe('addTagsToPost', () => {
    it('should add tags to post', async () => {
      const createSpy = jest.spyOn(postTagRepository, 'create').mockImplementation((dto) => dto as BlogPostTagEntity);
      const saveSpy = jest.spyOn(postTagRepository, 'save').mockResolvedValue({} as any);

      await service.addTagsToPost({ postId: 1, tagIds: [1, 2, 3] });

      expect(createSpy).toHaveBeenCalledTimes(3);
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('clearPostTags', () => {
    it('should clear all tags from post', async () => {
      const deleteSpy = jest
        .spyOn(postTagRepository, 'delete')
        .mockResolvedValue({ affected: 3 } as any);

      await service.clearPostTags({ postId: 1 });

      expect(deleteSpy).toHaveBeenCalledWith({ postId: 1 });
    });
  });
});
