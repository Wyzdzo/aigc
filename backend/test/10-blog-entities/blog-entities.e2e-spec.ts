// test/10-blog-entities/blog-entities.e2e-spec.ts
import { PostStatus, CommentStatus, LinkStatus } from '@app-types/models/blog/blog.types';
import { BlogCategoryEntity } from '@src/modules/blog/entities/blog-category.entity';
import { BlogCommentEntity } from '@src/modules/blog/entities/blog-comment.entity';
import { BlogLinkEntity } from '@src/modules/blog/entities/blog-link.entity';
import { BlogPostEntity } from '@src/modules/blog/entities/blog-post.entity';
import { BlogPostTagEntity } from '@src/modules/blog/entities/blog-post-tag.entity';
import { BlogTagEntity } from '@src/modules/blog/entities/blog-tag.entity';
import { ApiModule } from '@src/bootstraps/api/api.module';
import { DataSource, QueryRunner } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { initGraphQLSchema } from '@src/adapters/api/graphql/schema/schema.init';

describe('Blog Entities E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  const tableExists = async (tableName: string): Promise<boolean> => {
    const result = await queryRunner.query(
      `SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?`,
      [tableName],
    );
    return result.length > 0;
  };

  const getTableColumns = async (tableName: string): Promise<string[]> => {
    const rows = await queryRunner.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? ORDER BY ordinal_position`,
      [tableName],
    );
    return rows.map((r: any) => (r.column_name || r.COLUMN_NAME) as string);
  };

  const getTableIndexes = async (tableName: string): Promise<string[]> => {
    const rows = await queryRunner.query(
      `SELECT index_name FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = ?`,
      [tableName],
    );
    return rows.map((r: any) => (r.index_name || r.INDEX_NAME) as string);
  };

  beforeAll(async () => {
    initGraphQLSchema();

    const moduleFixture = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();

    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
  }, 30000);

  afterAll(async () => {
    if (queryRunner) {
      await queryRunner.release();
    }
    if (app) {
      await app.close();
    }
  });

  describe('Table existence', () => {
    it('blog_category table should exist', async () => {
      const exists = await tableExists('blog_category');
      expect(exists).toBe(true);
    });

    it('blog_tag table should exist', async () => {
      const exists = await tableExists('blog_tag');
      expect(exists).toBe(true);
    });

    it('blog_post table should exist', async () => {
      const exists = await tableExists('blog_post');
      expect(exists).toBe(true);
    });

    it('blog_post_tag table should exist', async () => {
      const exists = await tableExists('blog_post_tag');
      expect(exists).toBe(true);
    });

    it('blog_comment table should exist', async () => {
      const exists = await tableExists('blog_comment');
      expect(exists).toBe(true);
    });

    it('blog_link table should exist', async () => {
      const exists = await tableExists('blog_link');
      expect(exists).toBe(true);
    });
  });

  describe('BlogCategoryEntity columns', () => {
    it('should have all required columns', async () => {
      const columns = await getTableColumns('blog_category');
      expect(columns).toContain('id');
      expect(columns).toContain('name');
      expect(columns).toContain('slug');
      expect(columns).toContain('description');
      expect(columns).toContain('parent_id');
      expect(columns).toContain('sort_order');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should have unique index on slug', async () => {
      const indexes = await getTableIndexes('blog_category');
      expect(indexes).toContain('uk_category_slug');
    });
  });

  describe('BlogTagEntity columns', () => {
    it('should have all required columns', async () => {
      const columns = await getTableColumns('blog_tag');
      expect(columns).toContain('id');
      expect(columns).toContain('name');
      expect(columns).toContain('slug');
      expect(columns).toContain('created_at');
    });

    it('should have unique index on slug', async () => {
      const indexes = await getTableIndexes('blog_tag');
      expect(indexes).toContain('uk_tag_slug');
    });
  });

  describe('BlogPostEntity columns', () => {
    it('should have all required columns including soft delete', async () => {
      const columns = await getTableColumns('blog_post');
      expect(columns).toContain('id');
      expect(columns).toContain('title');
      expect(columns).toContain('slug');
      expect(columns).toContain('content');
      expect(columns).toContain('summary');
      expect(columns).toContain('cover_image');
      expect(columns).toContain('status');
      expect(columns).toContain('is_top');
      expect(columns).toContain('view_count');
      expect(columns).toContain('like_count');
      expect(columns).toContain('category_id');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
      expect(columns).toContain('deleted_at');
    });

    it('should have unique index on slug', async () => {
      const indexes = await getTableIndexes('blog_post');
      expect(indexes).toContain('uk_post_slug');
    });

    it('should have index on category_id', async () => {
      const indexes = await getTableIndexes('blog_post');
      expect(indexes).toContain('idx_post_category');
    });

    it('should have index on status', async () => {
      const indexes = await getTableIndexes('blog_post');
      expect(indexes).toContain('idx_post_status');
    });

    it('should have index on is_top', async () => {
      const indexes = await getTableIndexes('blog_post');
      expect(indexes).toContain('idx_post_is_top');
    });
  });

  describe('BlogPostTagEntity columns', () => {
    it('should have composite primary key columns', async () => {
      const columns = await getTableColumns('blog_post_tag');
      expect(columns).toContain('post_id');
      expect(columns).toContain('tag_id');
    });

    it('should have index on post_id', async () => {
      const indexes = await getTableIndexes('blog_post_tag');
      expect(indexes).toContain('idx_post_tag_post');
    });

    it('should have index on tag_id', async () => {
      const indexes = await getTableIndexes('blog_post_tag');
      expect(indexes).toContain('idx_post_tag_tag');
    });
  });

  describe('BlogCommentEntity columns', () => {
    it('should have all required columns', async () => {
      const columns = await getTableColumns('blog_comment');
      expect(columns).toContain('id');
      expect(columns).toContain('post_id');
      expect(columns).toContain('parent_id');
      expect(columns).toContain('nickname');
      expect(columns).toContain('email');
      expect(columns).toContain('avatar');
      expect(columns).toContain('content');
      expect(columns).toContain('status');
      expect(columns).toContain('like_count');
      expect(columns).toContain('created_at');
    });

    it('should have index on post_id', async () => {
      const indexes = await getTableIndexes('blog_comment');
      expect(indexes).toContain('idx_comment_post');
    });

    it('should have index on parent_id', async () => {
      const indexes = await getTableIndexes('blog_comment');
      expect(indexes).toContain('idx_comment_parent');
    });

    it('should have index on status', async () => {
      const indexes = await getTableIndexes('blog_comment');
      expect(indexes).toContain('idx_comment_status');
    });

    it('should have index on created_at', async () => {
      const indexes = await getTableIndexes('blog_comment');
      expect(indexes).toContain('idx_comment_created_at');
    });
  });

  describe('BlogLinkEntity columns', () => {
    it('should have all required columns', async () => {
      const columns = await getTableColumns('blog_link');
      expect(columns).toContain('id');
      expect(columns).toContain('title');
      expect(columns).toContain('url');
      expect(columns).toContain('description');
      expect(columns).toContain('logo');
      expect(columns).toContain('sort_order');
      expect(columns).toContain('status');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should have index on status', async () => {
      const indexes = await getTableIndexes('blog_link');
      expect(indexes).toContain('idx_link_status');
    });
  });

  describe('Entity operations', () => {
    it('should be able to insert and query BlogCategoryEntity', async () => {
      const categoryRepo = dataSource.getRepository(BlogCategoryEntity);
      const category = categoryRepo.create({
        name: 'Test Category',
        slug: 'test-category-e2e',
        description: 'Test description',
        parentId: null,
        sortOrder: 0,
      });
      const saved = await categoryRepo.save(category);
      expect(saved.id).toBeDefined();
      expect(saved.name).toBe('Test Category');

      const found = await categoryRepo.findOne({ where: { slug: 'test-category-e2e' } });
      expect(found).toBeDefined();
      expect(found?.name).toBe('Test Category');

      await categoryRepo.delete(saved.id);
    });

    it('should be able to insert and query BlogTagEntity', async () => {
      const tagRepo = dataSource.getRepository(BlogTagEntity);
      const tag = tagRepo.create({
        name: 'Test Tag',
        slug: 'test-tag-e2e',
      });
      const saved = await tagRepo.save(tag);
      expect(saved.id).toBeDefined();

      const found = await tagRepo.findOne({ where: { slug: 'test-tag-e2e' } });
      expect(found).toBeDefined();

      await tagRepo.delete(saved.id);
    });

    it('should be able to insert BlogPostEntity with soft delete', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const post = postRepo.create({
        title: 'Test Post',
        slug: 'test-post-e2e-soft-delete',
        content: 'Test content',
        status: PostStatus.DRAFT,
        isTop: false,
        viewCount: 0,
        likeCount: 0,
        categoryId: null,
      });
      const saved = await postRepo.save(post);
      expect(saved.id).toBeDefined();
      expect(saved.deletedAt).toBeNull();

      // Soft delete
      await postRepo.softDelete(saved.id);

      // Should not be found with normal query
      const notFound = await postRepo.findOne({ where: { slug: 'test-post-e2e-soft-delete' } });
      expect(notFound).toBeNull();

      // Should be found with including deleted
      const foundDeleted = await postRepo.findOne({
        where: { slug: 'test-post-e2e-soft-delete' },
        withDeleted: true,
      });
      expect(foundDeleted).toBeDefined();
      expect(foundDeleted?.deletedAt).not.toBeNull();

      // Restore
      await postRepo.restore(saved.id);
      const restored = await postRepo.findOne({ where: { slug: 'test-post-e2e-soft-delete' } });
      expect(restored).toBeDefined();
      expect(restored?.deletedAt).toBeNull();

      // Hard delete
      await postRepo.delete(saved.id);
    });

    it('should be able to insert BlogPostTagEntity with composite key', async () => {
      const postTagRepo = dataSource.getRepository(BlogPostTagEntity);

      // First create a post and tag
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const tagRepo = dataSource.getRepository(BlogTagEntity);

      const post = postRepo.create({
        title: 'Post for Tag Test',
        slug: 'post-for-tag-test-e2e',
        content: 'Content',
        status: PostStatus.DRAFT,
      });
      const savedPost = await postRepo.save(post);

      const tag = tagRepo.create({
        name: 'Tag for Post Test',
        slug: 'tag-for-post-test-e2e',
      });
      const savedTag = await tagRepo.save(tag);

      // Create post-tag relation
      const postTag = postTagRepo.create({
        postId: savedPost.id,
        tagId: savedTag.id,
      });
      await postTagRepo.save(postTag);

      // Query the relation
      const found = await postTagRepo.findOne({
        where: { postId: savedPost.id, tagId: savedTag.id },
      });
      expect(found).toBeDefined();

      // Delete relation
      await postTagRepo.delete({ postId: savedPost.id, tagId: savedTag.id });

      // Cleanup
      await postRepo.delete(savedPost.id);
      await tagRepo.delete(savedTag.id);
    });

    it('should be able to insert BlogCommentEntity', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const commentRepo = dataSource.getRepository(BlogCommentEntity);

      const post = postRepo.create({
        title: 'Post for Comment Test',
        slug: 'post-for-comment-test-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });
      const savedPost = await postRepo.save(post);

      const comment = commentRepo.create({
        postId: savedPost.id,
        parentId: null,
        nickname: 'Test User',
        email: 'test@example.com',
        content: 'Test comment',
        status: CommentStatus.PENDING,
        likeCount: 0,
      });
      const savedComment = await commentRepo.save(comment);
      expect(savedComment.id).toBeDefined();
      expect(savedComment.status).toBe(CommentStatus.PENDING);

      // Create nested comment
      const nestedComment = commentRepo.create({
        postId: savedPost.id,
        parentId: savedComment.id,
        nickname: 'Nested User',
        content: 'Nested comment',
        status: CommentStatus.PENDING,
        likeCount: 0,
      });
      const savedNested = await commentRepo.save(nestedComment);
      expect(savedNested.parentId).toBe(savedComment.id);

      // Cleanup
      await commentRepo.delete(savedNested.id);
      await commentRepo.delete(savedComment.id);
      await postRepo.delete(savedPost.id);
    });

    it('should be able to insert BlogLinkEntity', async () => {
      const linkRepo = dataSource.getRepository(BlogLinkEntity);
      const link = linkRepo.create({
        title: 'Test Link',
        url: 'https://example.com',
        description: 'Test link description',
        sortOrder: 0,
        status: LinkStatus.ACTIVE,
      });
      const saved = await linkRepo.save(link);
      expect(saved.id).toBeDefined();
      expect(saved.status).toBe(LinkStatus.ACTIVE);

      const found = await linkRepo.findOne({ where: { url: 'https://example.com' } });
      expect(found).toBeDefined();

      await linkRepo.delete(saved.id);
    });
  });

  describe('Error handling', () => {
    it('should reject duplicate slug for BlogCategoryEntity', async () => {
      const categoryRepo = dataSource.getRepository(BlogCategoryEntity);

      const category1 = categoryRepo.create({
        name: 'Category 1',
        slug: 'duplicate-slug-category-e2e',
      });
      await categoryRepo.save(category1);

      const category2 = categoryRepo.create({
        name: 'Category 2',
        slug: 'duplicate-slug-category-e2e',
      });

      await expect(categoryRepo.save(category2)).rejects.toThrow();

      await categoryRepo.delete(category1.id);
    });

    it('should reject duplicate slug for BlogPostEntity', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);

      const post1 = postRepo.create({
        title: 'Post 1',
        slug: 'duplicate-slug-post-e2e',
        content: 'Content 1',
        status: PostStatus.DRAFT,
      });
      await postRepo.save(post1);

      const post2 = postRepo.create({
        title: 'Post 2',
        slug: 'duplicate-slug-post-e2e',
        content: 'Content 2',
        status: PostStatus.DRAFT,
      });

      await expect(postRepo.save(post2)).rejects.toThrow();

      await postRepo.delete(post1.id);
    });

    it('should reject duplicate post_tag relation', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const tagRepo = dataSource.getRepository(BlogTagEntity);
      const postTagRepo = dataSource.getRepository(BlogPostTagEntity);

      const post = postRepo.create({
        title: 'Post for Duplicate Tag',
        slug: 'post-duplicate-tag-e2e',
        content: 'Content',
        status: PostStatus.DRAFT,
      });
      const savedPost = await postRepo.save(post);

      const tag = tagRepo.create({
        name: 'Tag for Duplicate',
        slug: 'tag-duplicate-e2e',
      });
      const savedTag = await tagRepo.save(tag);

      const postTag1 = postTagRepo.create({
        postId: savedPost.id,
        tagId: savedTag.id,
      });
      await postTagRepo.save(postTag1);

      const postTag2 = postTagRepo.create({
        postId: savedPost.id,
        tagId: savedTag.id,
      });

      let saved = false;
      try {
        await postTagRepo.save(postTag2);
        saved = true;
      } catch {
      }

      if (saved) {
        const count = await postTagRepo.count({ where: { postId: savedPost.id, tagId: savedTag.id } });
        expect(count).toBe(1);
      }

      await postTagRepo.delete({ postId: savedPost.id, tagId: savedTag.id });
      await postRepo.delete(savedPost.id);
      await tagRepo.delete(savedTag.id);
    });
  });
});
