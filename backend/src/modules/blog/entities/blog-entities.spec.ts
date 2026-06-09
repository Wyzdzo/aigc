// src/modules/blog/entities/blog-entities.spec.ts
import 'reflect-metadata';
import { PostStatus, CommentStatus, LinkStatus } from '@app-types/models/blog/blog.types';
import { BlogCategoryEntity } from './blog-category.entity';
import { BlogCommentEntity } from './blog-comment.entity';
import { BlogLinkEntity } from './blog-link.entity';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostTagEntity } from './blog-post-tag.entity';
import { BlogTagEntity } from './blog-tag.entity';

describe('Blog Entities', () => {
  describe('BlogCategoryEntity', () => {
    it('should implement BlogCategoryModel interface', () => {
      const entity = new BlogCategoryEntity();
      expect(entity).toHaveProperty('id');
      expect(entity).toHaveProperty('name');
      expect(entity).toHaveProperty('slug');
      expect(entity).toHaveProperty('description');
      expect(entity).toHaveProperty('parentId');
      expect(entity).toHaveProperty('sortOrder');
      expect(entity).toHaveProperty('createdAt');
      expect(entity).toHaveProperty('updatedAt');
    });

    it('should allow setting all properties', () => {
      const entity = new BlogCategoryEntity();
      entity.name = 'Test Category';
      entity.slug = 'test-category';
      entity.description = 'Test description';
      entity.parentId = null;
      entity.sortOrder = 1;
      expect(entity.name).toBe('Test Category');
      expect(entity.slug).toBe('test-category');
      expect(entity.description).toBe('Test description');
      expect(entity.parentId).toBeNull();
      expect(entity.sortOrder).toBe(1);
    });
  });

  describe('BlogTagEntity', () => {
    it('should implement BlogTagModel interface', () => {
      const entity = new BlogTagEntity();
      expect(entity).toHaveProperty('id');
      expect(entity).toHaveProperty('name');
      expect(entity).toHaveProperty('slug');
      expect(entity).toHaveProperty('createdAt');
    });

    it('should allow setting all properties', () => {
      const entity = new BlogTagEntity();
      entity.name = 'Test Tag';
      entity.slug = 'test-tag';
      expect(entity.name).toBe('Test Tag');
      expect(entity.slug).toBe('test-tag');
    });
  });

  describe('BlogPostEntity', () => {
    it('should implement BlogPostModel interface', () => {
      const entity = new BlogPostEntity();
      expect(entity).toHaveProperty('id');
      expect(entity).toHaveProperty('title');
      expect(entity).toHaveProperty('slug');
      expect(entity).toHaveProperty('content');
      expect(entity).toHaveProperty('summary');
      expect(entity).toHaveProperty('coverImage');
      expect(entity).toHaveProperty('status');
      expect(entity).toHaveProperty('isTop');
      expect(entity).toHaveProperty('viewCount');
      expect(entity).toHaveProperty('likeCount');
      expect(entity).toHaveProperty('categoryId');
      expect(entity).toHaveProperty('createdAt');
      expect(entity).toHaveProperty('updatedAt');
      expect(entity).toHaveProperty('deletedAt');
    });

    it('should allow setting all properties', () => {
      const entity = new BlogPostEntity();
      entity.title = 'Test Post';
      entity.slug = 'test-post';
      entity.content = 'Test content';
      entity.summary = 'Test summary';
      entity.coverImage = 'https://example.com/image.png';
      entity.status = PostStatus.PUBLISHED;
      entity.isTop = true;
      entity.viewCount = 100;
      entity.likeCount = 50;
      entity.categoryId = 1;
      expect(entity.title).toBe('Test Post');
      expect(entity.status).toBe(PostStatus.PUBLISHED);
      expect(entity.isTop).toBe(true);
      expect(entity.viewCount).toBe(100);
    });

    it('should accept all PostStatus values', () => {
      const entity = new BlogPostEntity();
      entity.status = PostStatus.DRAFT;
      expect(entity.status).toBe(PostStatus.DRAFT);
      entity.status = PostStatus.PUBLISHED;
      expect(entity.status).toBe(PostStatus.PUBLISHED);
      entity.status = PostStatus.ARCHIVED;
      expect(entity.status).toBe(PostStatus.ARCHIVED);
      entity.status = PostStatus.DELETED;
      expect(entity.status).toBe(PostStatus.DELETED);
    });
  });

  describe('BlogPostTagEntity', () => {
    it('should implement BlogPostTagModel interface', () => {
      const entity = new BlogPostTagEntity();
      expect(entity).toHaveProperty('postId');
      expect(entity).toHaveProperty('tagId');
    });

    it('should allow setting composite key properties', () => {
      const entity = new BlogPostTagEntity();
      entity.postId = 1;
      entity.tagId = 2;
      expect(entity.postId).toBe(1);
      expect(entity.tagId).toBe(2);
    });
  });

  describe('BlogCommentEntity', () => {
    it('should implement BlogCommentModel interface', () => {
      const entity = new BlogCommentEntity();
      expect(entity).toHaveProperty('id');
      expect(entity).toHaveProperty('postId');
      expect(entity).toHaveProperty('parentId');
      expect(entity).toHaveProperty('nickname');
      expect(entity).toHaveProperty('email');
      expect(entity).toHaveProperty('avatar');
      expect(entity).toHaveProperty('content');
      expect(entity).toHaveProperty('status');
      expect(entity).toHaveProperty('likeCount');
      expect(entity).toHaveProperty('createdAt');
    });

    it('should allow setting all properties', () => {
      const entity = new BlogCommentEntity();
      entity.postId = 1;
      entity.parentId = null;
      entity.nickname = 'Test User';
      entity.email = 'test@example.com';
      entity.avatar = 'https://example.com/avatar.png';
      entity.content = 'Test comment';
      entity.status = CommentStatus.APPROVED;
      entity.likeCount = 10;
      expect(entity.postId).toBe(1);
      expect(entity.nickname).toBe('Test User');
      expect(entity.status).toBe(CommentStatus.APPROVED);
    });

    it('should accept all CommentStatus values', () => {
      const entity = new BlogCommentEntity();
      entity.status = CommentStatus.PENDING;
      expect(entity.status).toBe(CommentStatus.PENDING);
      entity.status = CommentStatus.APPROVED;
      expect(entity.status).toBe(CommentStatus.APPROVED);
      entity.status = CommentStatus.REJECTED;
      expect(entity.status).toBe(CommentStatus.REJECTED);
      entity.status = CommentStatus.DELETED;
      expect(entity.status).toBe(CommentStatus.DELETED);
    });

    it('should allow nested comments via parentId', () => {
      const entity = new BlogCommentEntity();
      entity.postId = 1;
      entity.parentId = 10;
      expect(entity.parentId).toBe(10);
    });
  });

  describe('BlogLinkEntity', () => {
    it('should implement BlogLinkModel interface', () => {
      const entity = new BlogLinkEntity();
      expect(entity).toHaveProperty('id');
      expect(entity).toHaveProperty('title');
      expect(entity).toHaveProperty('url');
      expect(entity).toHaveProperty('description');
      expect(entity).toHaveProperty('logo');
      expect(entity).toHaveProperty('sortOrder');
      expect(entity).toHaveProperty('status');
      expect(entity).toHaveProperty('createdAt');
      expect(entity).toHaveProperty('updatedAt');
    });

    it('should allow setting all properties', () => {
      const entity = new BlogLinkEntity();
      entity.title = 'Test Link';
      entity.url = 'https://example.com';
      entity.description = 'Test link description';
      entity.logo = 'https://example.com/logo.png';
      entity.sortOrder = 1;
      entity.status = LinkStatus.ACTIVE;
      expect(entity.title).toBe('Test Link');
      expect(entity.url).toBe('https://example.com');
      expect(entity.status).toBe(LinkStatus.ACTIVE);
    });

    it('should accept all LinkStatus values', () => {
      const entity = new BlogLinkEntity();
      entity.status = LinkStatus.ACTIVE;
      expect(entity.status).toBe(LinkStatus.ACTIVE);
      entity.status = LinkStatus.INACTIVE;
      expect(entity.status).toBe(LinkStatus.INACTIVE);
    });
  });

  describe('Entity purity (no GraphQL decorators)', () => {
    it('BlogCategoryEntity should not have GraphQL imports', () => {
      const entitySource = BlogCategoryEntity.toString();
      expect(entitySource).not.toContain('@ObjectType');
      expect(entitySource).not.toContain('@Field');
      expect(entitySource).not.toContain('@nestjs/graphql');
    });

    it('BlogPostEntity should not have GraphQL imports', () => {
      const entitySource = BlogPostEntity.toString();
      expect(entitySource).not.toContain('@ObjectType');
      expect(entitySource).not.toContain('@Field');
      expect(entitySource).not.toContain('@nestjs/graphql');
    });

    it('BlogCommentEntity should not have GraphQL imports', () => {
      const entitySource = BlogCommentEntity.toString();
      expect(entitySource).not.toContain('@ObjectType');
      expect(entitySource).not.toContain('@Field');
      expect(entitySource).not.toContain('@nestjs/graphql');
    });

    it('BlogLinkEntity should not have GraphQL imports', () => {
      const entitySource = BlogLinkEntity.toString();
      expect(entitySource).not.toContain('@ObjectType');
      expect(entitySource).not.toContain('@Field');
      expect(entitySource).not.toContain('@nestjs/graphql');
    });

    it('BlogTagEntity should not have GraphQL imports', () => {
      const entitySource = BlogTagEntity.toString();
      expect(entitySource).not.toContain('@ObjectType');
      expect(entitySource).not.toContain('@Field');
      expect(entitySource).not.toContain('@nestjs/graphql');
    });

    it('BlogPostTagEntity should not have GraphQL imports', () => {
      const entitySource = BlogPostTagEntity.toString();
      expect(entitySource).not.toContain('@ObjectType');
      expect(entitySource).not.toContain('@Field');
      expect(entitySource).not.toContain('@nestjs/graphql');
    });
  });
});
