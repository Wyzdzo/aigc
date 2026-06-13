// src/features/blog/infrastructure/mock/mock.spec.ts
import { describe, expect, it } from 'vitest';

import { CommentStatus, LinkStatus,PostStatus } from '@/entities/blog';

import { mockCategories, mockComments, mockLinks, mockPosts, mockPostTags,mockTags } from './mock';

describe('Mock Data Integrity', () => {
  describe('mockPosts', () => {
    it('should have 10 posts', () => {
      expect(mockPosts).toHaveLength(10);
    });

    it('should have unique ids', () => {
      const ids = mockPosts.map(post => post.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have unique slugs', () => {
      const slugs = mockPosts.map(post => post.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it('should have valid status values', () => {
      mockPosts.forEach(post => {
        expect(Object.values(PostStatus)).toContain(post.status);
      });
    });

    it('should have valid category references', () => {
      const categoryIds = mockCategories.map(cat => cat.id);
      mockPosts.forEach(post => {
        if (post.categoryId) {
          expect(categoryIds).toContain(post.categoryId);
        }
      });
    });

    it('should have proper date format', () => {
      mockPosts.forEach(post => {
        expect(post.createdAt).toBeInstanceOf(Date);
        expect(post.updatedAt).toBeInstanceOf(Date);
      });
    });

    it('should have at least one top post', () => {
      expect(mockPosts.some(post => post.isTop)).toBe(true);
    });

    it('should have at least one draft post', () => {
      expect(mockPosts.some(post => post.status === PostStatus.DRAFT)).toBe(true);
    });
  });

  describe('mockCategories', () => {
    it('should have 5 categories', () => {
      expect(mockCategories).toHaveLength(5);
    });

    it('should have unique ids', () => {
      const ids = mockCategories.map(cat => cat.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have unique slugs', () => {
      const slugs = mockCategories.map(cat => cat.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it('should have valid parent references', () => {
      const parentIds = mockCategories.filter(cat => cat.parentId !== null).map(cat => cat.parentId!);
      const categoryIds = mockCategories.map(cat => cat.id);
      parentIds.forEach(parentId => {
        expect(categoryIds).toContain(parentId);
      });
    });
  });

  describe('mockTags', () => {
    it('should have 10 tags', () => {
      expect(mockTags).toHaveLength(10);
    });

    it('should have unique ids', () => {
      const ids = mockTags.map(tag => tag.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have unique slugs', () => {
      const slugs = mockTags.map(tag => tag.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });
  });

  describe('mockComments', () => {
    it('should have valid post references', () => {
      const postIds = mockPosts.map(post => post.id);
      mockComments.forEach(comment => {
        expect(postIds).toContain(comment.postId);
      });
    });

    it('should have valid parent references', () => {
      const commentIds = mockComments.map(c => c.id);
      mockComments.forEach(comment => {
        if (comment.parentId !== null) {
          expect(commentIds).toContain(comment.parentId);
        }
      });
    });

    it('should have valid status values', () => {
      mockComments.forEach(comment => {
        expect(Object.values(CommentStatus)).toContain(comment.status);
      });
    });

    it('should have comments with different statuses', () => {
      const statuses = new Set(mockComments.map(c => c.status));
      expect(statuses.size).toBeGreaterThan(1);
    });
  });

  describe('mockLinks', () => {
    it('should have 5 links', () => {
      expect(mockLinks).toHaveLength(5);
    });

    it('should have valid status values', () => {
      mockLinks.forEach(link => {
        expect(Object.values(LinkStatus)).toContain(link.status);
      });
    });

    it('should have unique urls', () => {
      const urls = mockLinks.map(link => link.url);
      expect(new Set(urls).size).toBe(urls.length);
    });
  });

  describe('mockPostTags', () => {
    it('should reference valid post ids', () => {
      const postIds = mockPosts.map(post => post.id);
      Object.keys(mockPostTags).forEach(postId => {
        expect(postIds).toContain(parseInt(postId));
      });
    });

    it('should reference valid tag ids', () => {
      const tagIds = mockTags.map(tag => tag.id);
      Object.values(mockPostTags).forEach(tagIdsForPost => {
        tagIdsForPost.forEach(tagId => {
          expect(tagIds).toContain(tagId);
        });
      });
    });

    it('should have tags for all published posts', () => {
      const publishedPostIds = mockPosts
        .filter(post => post.status === PostStatus.PUBLISHED)
        .map(post => post.id);
      publishedPostIds.forEach(postId => {
        expect(mockPostTags[postId]).toBeDefined();
        expect(mockPostTags[postId].length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data Consistency', () => {
    it('should have comments distributed across multiple posts', () => {
      const postsWithComments = new Set(mockComments.map(c => c.postId));
      expect(postsWithComments.size).toBeGreaterThan(1);
    });

    it('should have posts in each category', () => {
      const categoriesWithPosts = new Set(mockPosts.map(p => p.categoryId));
      expect(categoriesWithPosts.size).toBeGreaterThan(1);
    });
  });
});