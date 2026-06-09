// src/adapters/api/graphql/blog/dto/blog-dtos.spec.ts
import 'reflect-metadata';
import { PostStatus, CommentStatus, LinkStatus } from '@app-types/models/blog/blog.types';
import { BlogCategoryDTO } from './blog-category.dto';
import { BlogCommentDTO } from './blog-comment.dto';
import { BlogLinkDTO } from './blog-link.dto';
import { BlogPostDTO } from './blog-post.dto';
import { BlogPostsArgs } from './blog-posts.args';
import { BlogPostsResult } from './blog-posts.result';
import { BlogTagDTO } from './blog-tag.dto';
import { CreateBlogCommentInput } from './create-blog-comment.input';
import { CreateBlogPostInput } from './create-blog-post.input';
import { UpdateBlogPostInput } from './update-blog-post.input';

describe('Blog GraphQL DTOs', () => {
  describe('BlogPostDTO', () => {
    it('should have all required fields with correct types', () => {
      const dto = new BlogPostDTO();
      expect(dto).toHaveProperty('id');
      expect(dto).toHaveProperty('title');
      expect(dto).toHaveProperty('slug');
      expect(dto).toHaveProperty('content');
      expect(dto).toHaveProperty('summary');
      expect(dto).toHaveProperty('coverImage');
      expect(dto).toHaveProperty('status');
      expect(dto).toHaveProperty('isTop');
      expect(dto).toHaveProperty('viewCount');
      expect(dto).toHaveProperty('likeCount');
      expect(dto).toHaveProperty('categoryId');
      expect(dto).toHaveProperty('createdAt');
      expect(dto).toHaveProperty('updatedAt');
    });

    it('should accept valid PostStatus values', () => {
      const dto = new BlogPostDTO();
      dto.status = PostStatus.DRAFT;
      expect(dto.status).toBe(PostStatus.DRAFT);
      dto.status = PostStatus.PUBLISHED;
      expect(dto.status).toBe(PostStatus.PUBLISHED);
      dto.status = PostStatus.ARCHIVED;
      expect(dto.status).toBe(PostStatus.ARCHIVED);
      dto.status = PostStatus.DELETED;
      expect(dto.status).toBe(PostStatus.DELETED);
    });
  });

  describe('BlogCategoryDTO', () => {
    it('should have all required fields', () => {
      const dto = new BlogCategoryDTO();
      expect(dto).toHaveProperty('id');
      expect(dto).toHaveProperty('name');
      expect(dto).toHaveProperty('slug');
      expect(dto).toHaveProperty('description');
      expect(dto).toHaveProperty('parentId');
      expect(dto).toHaveProperty('sortOrder');
      expect(dto).toHaveProperty('createdAt');
      expect(dto).toHaveProperty('updatedAt');
    });
  });

  describe('BlogTagDTO', () => {
    it('should have all required fields', () => {
      const dto = new BlogTagDTO();
      expect(dto).toHaveProperty('id');
      expect(dto).toHaveProperty('name');
      expect(dto).toHaveProperty('slug');
      expect(dto).toHaveProperty('createdAt');
    });
  });

  describe('BlogCommentDTO', () => {
    it('should have all required fields', () => {
      const dto = new BlogCommentDTO();
      expect(dto).toHaveProperty('id');
      expect(dto).toHaveProperty('postId');
      expect(dto).toHaveProperty('parentId');
      expect(dto).toHaveProperty('nickname');
      expect(dto).toHaveProperty('email');
      expect(dto).toHaveProperty('avatar');
      expect(dto).toHaveProperty('content');
      expect(dto).toHaveProperty('status');
      expect(dto).toHaveProperty('likeCount');
      expect(dto).toHaveProperty('createdAt');
    });

    it('should accept valid CommentStatus values', () => {
      const dto = new BlogCommentDTO();
      dto.status = CommentStatus.PENDING;
      expect(dto.status).toBe(CommentStatus.PENDING);
      dto.status = CommentStatus.APPROVED;
      expect(dto.status).toBe(CommentStatus.APPROVED);
      dto.status = CommentStatus.REJECTED;
      expect(dto.status).toBe(CommentStatus.REJECTED);
      dto.status = CommentStatus.DELETED;
      expect(dto.status).toBe(CommentStatus.DELETED);
    });
  });

  describe('BlogLinkDTO', () => {
    it('should have all required fields', () => {
      const dto = new BlogLinkDTO();
      expect(dto).toHaveProperty('id');
      expect(dto).toHaveProperty('title');
      expect(dto).toHaveProperty('url');
      expect(dto).toHaveProperty('description');
      expect(dto).toHaveProperty('logo');
      expect(dto).toHaveProperty('sortOrder');
      expect(dto).toHaveProperty('status');
      expect(dto).toHaveProperty('createdAt');
      expect(dto).toHaveProperty('updatedAt');
    });

    it('should accept valid LinkStatus values', () => {
      const dto = new BlogLinkDTO();
      dto.status = LinkStatus.ACTIVE;
      expect(dto.status).toBe(LinkStatus.ACTIVE);
      dto.status = LinkStatus.INACTIVE;
      expect(dto.status).toBe(LinkStatus.INACTIVE);
    });
  });

  describe('CreateBlogPostInput', () => {
    it('should have required fields (title, slug, content)', () => {
      const input = new CreateBlogPostInput();
      expect(input).toHaveProperty('title');
      expect(input).toHaveProperty('slug');
      expect(input).toHaveProperty('content');
    });

    it('should have optional fields', () => {
      const input = new CreateBlogPostInput();
      expect(input).toHaveProperty('summary');
      expect(input).toHaveProperty('coverImage');
      expect(input).toHaveProperty('status');
      expect(input).toHaveProperty('isTop');
      expect(input).toHaveProperty('categoryId');
      expect(input).toHaveProperty('tagIds');
    });

    it('should allow creating post with minimal required fields', () => {
      const input = new CreateBlogPostInput();
      input.title = 'Test Post';
      input.slug = 'test-post';
      input.content = 'Test content';
      expect(input.title).toBe('Test Post');
      expect(input.slug).toBe('test-post');
      expect(input.content).toBe('Test content');
    });

    it('should allow creating post with all fields', () => {
      const input = new CreateBlogPostInput();
      input.title = 'Full Post';
      input.slug = 'full-post';
      input.content = 'Full content';
      input.summary = 'Summary';
      input.coverImage = 'https://example.com/image.png';
      input.status = PostStatus.PUBLISHED;
      input.isTop = true;
      input.categoryId = 1;
      input.tagIds = [1, 2, 3];
      expect(input.summary).toBe('Summary');
      expect(input.status).toBe(PostStatus.PUBLISHED);
      expect(input.tagIds).toEqual([1, 2, 3]);
    });
  });

  describe('UpdateBlogPostInput', () => {
    it('should have all optional fields', () => {
      const input = new UpdateBlogPostInput();
      expect(input).toHaveProperty('title');
      expect(input).toHaveProperty('slug');
      expect(input).toHaveProperty('content');
      expect(input).toHaveProperty('summary');
      expect(input).toHaveProperty('coverImage');
      expect(input).toHaveProperty('status');
      expect(input).toHaveProperty('isTop');
      expect(input).toHaveProperty('categoryId');
      expect(input).toHaveProperty('tagIds');
    });

    it('should allow partial updates', () => {
      const input = new UpdateBlogPostInput();
      input.title = 'Updated Title';
      input.status = PostStatus.PUBLISHED;
      expect(input.title).toBe('Updated Title');
      expect(input.content).toBeUndefined();
    });
  });

  describe('CreateBlogCommentInput', () => {
    it('should have required fields (postId, nickname, content)', () => {
      const input = new CreateBlogCommentInput();
      expect(input).toHaveProperty('postId');
      expect(input).toHaveProperty('nickname');
      expect(input).toHaveProperty('content');
    });

    it('should have optional fields', () => {
      const input = new CreateBlogCommentInput();
      expect(input).toHaveProperty('parentId');
      expect(input).toHaveProperty('email');
      expect(input).toHaveProperty('avatar');
    });

    it('should allow creating comment with minimal required fields', () => {
      const input = new CreateBlogCommentInput();
      input.postId = 1;
      input.nickname = 'User';
      input.content = 'Comment content';
      expect(input.postId).toBe(1);
      expect(input.nickname).toBe('User');
      expect(input.content).toBe('Comment content');
    });

    it('should allow creating nested comment', () => {
      const input = new CreateBlogCommentInput();
      input.postId = 1;
      input.parentId = 10;
      input.nickname = 'User';
      input.content = 'Reply content';
      expect(input.parentId).toBe(10);
    });
  });

  describe('BlogPostsArgs', () => {
    it('should have all filter fields', () => {
      const args = new BlogPostsArgs();
      expect(args).toHaveProperty('categoryId');
      expect(args).toHaveProperty('tagId');
      expect(args).toHaveProperty('status');
      expect(args).toHaveProperty('keyword');
      expect(args).toHaveProperty('page');
      expect(args).toHaveProperty('pageSize');
    });

    it('should allow filtering by category', () => {
      const args = new BlogPostsArgs();
      args.categoryId = 1;
      expect(args.categoryId).toBe(1);
    });

    it('should allow filtering by tag', () => {
      const args = new BlogPostsArgs();
      args.tagId = 2;
      expect(args.tagId).toBe(2);
    });

    it('should allow filtering by status', () => {
      const args = new BlogPostsArgs();
      args.status = PostStatus.PUBLISHED;
      expect(args.status).toBe(PostStatus.PUBLISHED);
    });

    it('should allow keyword search', () => {
      const args = new BlogPostsArgs();
      args.keyword = 'test';
      expect(args.keyword).toBe('test');
    });

    it('should allow pagination', () => {
      const args = new BlogPostsArgs();
      args.page = 2;
      args.pageSize = 20;
      expect(args.page).toBe(2);
      expect(args.pageSize).toBe(20);
    });
  });

  describe('BlogPostsResult', () => {
    it('should have all pagination result fields', () => {
      const result = new BlogPostsResult();
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('pageSize');
    });

    it('should accept valid result data', () => {
      const result = new BlogPostsResult();
      const post1 = new BlogPostDTO();
      post1.id = 1;
      post1.title = 'Post 1';
      const post2 = new BlogPostDTO();
      post2.id = 2;
      post2.title = 'Post 2';
      result.items = [post1, post2];
      result.total = 100;
      result.page = 1;
      result.pageSize = 10;
      expect(result.items.length).toBe(2);
      expect(result.total).toBe(100);
    });
  });
});
