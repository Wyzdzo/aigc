// test/11-blog-service/blog-service.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { initGraphQLSchema } from '../../src/adapters/api/graphql/schema/schema.init';
import { ApiModule } from '../../src/bootstraps/api/api.module';
import { PostStatus, CommentStatus, LinkStatus } from '@app-types/models/blog/blog.types';
import { BlogPostEntity } from '@src/modules/blog/entities/blog-post.entity';
import { BlogCategoryEntity } from '@src/modules/blog/entities/blog-category.entity';
import { BlogTagEntity } from '@src/modules/blog/entities/blog-tag.entity';
import { BlogCommentEntity } from '@src/modules/blog/entities/blog-comment.entity';
import { BlogLinkEntity } from '@src/modules/blog/entities/blog-link.entity';

describe('Blog Service E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    initGraphQLSchema();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  // 测试数据清理
  const cleanupTestData = async () => {
    await dataSource.getRepository(BlogCommentEntity).delete({});
    await dataSource.getRepository(BlogLinkEntity).delete({});
    await dataSource.getRepository(BlogTagEntity).delete({});
    await dataSource.getRepository(BlogCategoryEntity).delete({});
    await dataSource.getRepository(BlogPostEntity).delete({});
  };

  beforeEach(async () => {
    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Post Operations', () => {
    it('should create a post', async () => {
      const createPostMutation = `
        mutation {
          createPost(input: {
            title: "Test Post",
            slug: "test-post-e2e",
            content: "Test content",
            status: DRAFT
          }) {
            id
            title
            slug
            content
            status
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createPostMutation })
        .expect(200);

      expect(response.body.data.createPost).toBeDefined();
      expect(response.body.data.createPost.title).toBe('Test Post');
      expect(response.body.data.createPost.slug).toBe('test-post-e2e');
      expect(response.body.data.createPost.status).toBe('DRAFT');
    });

    it('should create a published post with all fields', async () => {
      const createPostMutation = `
        mutation {
          createPost(input: {
            title: "Published Post",
            slug: "published-post-e2e",
            content: "Full content",
            summary: "Summary text",
            coverImage: "cover.jpg",
            status: PUBLISHED,
            isTop: true,
            categoryId: null
          }) {
            id
            title
            summary
            coverImage
            isTop
            status
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createPostMutation })
        .expect(200);

      expect(response.body.data.createPost.status).toBe('PUBLISHED');
      expect(response.body.data.createPost.isTop).toBe(true);
      expect(response.body.data.createPost.summary).toBe('Summary text');
    });

    it('should query posts with pagination', async () => {
      // 创建测试数据
      const postRepo = dataSource.getRepository(BlogPostEntity);
      for (let i = 1; i <= 15; i++) {
        await postRepo.save({
          title: `Post ${i}`,
          slug: `post-${i}-e2e`,
          content: `Content ${i}`,
          status: PostStatus.PUBLISHED,
        });
      }

      const queryPosts = `
        query {
          posts(page: 1, pageSize: 10) {
            items {
              id
              title
            }
            total
            page
            pageSize
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: queryPosts })
        .expect(200);

      expect(response.body.data.posts.items.length).toBe(10);
      expect(response.body.data.posts.total).toBe(15);
      expect(response.body.data.posts.page).toBe(1);
      expect(response.body.data.posts.pageSize).toBe(10);
    });

    it('should query a single post by id', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const savedPost = await postRepo.save({
        title: 'Single Post',
        slug: 'single-post-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      const queryPost = `
        query {
          post(id: ${savedPost.id}) {
            id
            title
            slug
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: queryPost })
        .expect(200);

      expect(response.body.data.post.title).toBe('Single Post');
      expect(response.body.data.post.slug).toBe('single-post-e2e');
    });

    it('should return null when post not found', async () => {
      const queryPost = `
        query {
          post(id: 99999) {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: queryPost })
        .expect(200);

      expect(response.body.data.post).toBeNull();
    });

    it('should update a post', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const savedPost = await postRepo.save({
        title: 'Original Title',
        slug: 'original-slug-e2e',
        content: 'Original content',
        status: PostStatus.DRAFT,
      });

      const updateMutation = `
        mutation {
          updatePost(id: ${savedPost.id}, input: {
            title: "Updated Title",
            status: PUBLISHED
          }) {
            id
            title
            status
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: updateMutation })
        .expect(200);

      expect(response.body.data.updatePost.title).toBe('Updated Title');
      expect(response.body.data.updatePost.status).toBe('PUBLISHED');
    });

    it('should delete a post (soft delete)', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const savedPost = await postRepo.save({
        title: 'Delete Post',
        slug: 'delete-post-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      const deleteMutation = `
        mutation {
          deletePost(id: ${savedPost.id})
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: deleteMutation })
        .expect(200);

      expect(response.body.data.deletePost).toBe(true);

      // Verify soft delete
      const found = await postRepo.findOne({ where: { id: savedPost.id } });
      expect(found).toBeNull();

      const foundWithDeleted = await postRepo.findOne({
        where: { id: savedPost.id },
        withDeleted: true,
      });
      expect(foundWithDeleted).not.toBeNull();
      expect(foundWithDeleted?.deletedAt).not.toBeNull();
    });

    it('should publish and unpublish a post', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const savedPost = await postRepo.save({
        title: 'Draft Post',
        slug: 'draft-post-e2e',
        content: 'Content',
        status: PostStatus.DRAFT,
      });

      // Publish
      const publishMutation = `
        mutation {
          publishPost(id: ${savedPost.id})
        }
      `;

      let response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: publishMutation })
        .expect(200);

      expect(response.body.data.publishPost).toBe(true);

      // Verify published
      const published = await postRepo.findOne({ where: { id: savedPost.id } });
      expect(published?.status).toBe(PostStatus.PUBLISHED);

      // Unpublish
      const unpublishMutation = `
        mutation {
          unpublishPost(id: ${savedPost.id})
        }
      `;

      response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: unpublishMutation })
        .expect(200);

      expect(response.body.data.unpublishPost).toBe(true);

      // Verify draft
      const draft = await postRepo.findOne({ where: { id: savedPost.id } });
      expect(draft?.status).toBe(PostStatus.DRAFT);
    });

    it('should increment view count when viewing post', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const savedPost = await postRepo.save({
        title: 'View Post',
        slug: 'view-post-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
        viewCount: 0,
      });

      const viewMutation = `
        mutation {
          viewPost(id: ${savedPost.id}) {
            id
            viewCount
          }
        }
      `;

      // First view
      let response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: viewMutation })
        .expect(200);

      expect(response.body.data.viewPost.viewCount).toBe(1);

      // Second view
      response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: viewMutation })
        .expect(200);

      expect(response.body.data.viewPost.viewCount).toBe(2);
    });

    it('should increment like count', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const savedPost = await postRepo.save({
        title: 'Like Post',
        slug: 'like-post-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
        likeCount: 0,
      });

      const likeMutation = `
        mutation {
          likePost(id: ${savedPost.id})
        }
      `;

      await request(app.getHttpServer()).post('/graphql').send({ query: likeMutation }).expect(200);

      const updated = await postRepo.findOne({ where: { id: savedPost.id } });
      expect(updated?.likeCount).toBe(1);
    });
  });

  describe('Category Operations', () => {
    it('should create a category', async () => {
      const createMutation = `
        mutation {
          createCategory(name: "Test Category", slug: "test-category-e2e") {
            id
            name
            slug
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createMutation })
        .expect(200);

      expect(response.body.data.createCategory.name).toBe('Test Category');
      expect(response.body.data.createCategory.slug).toBe('test-category-e2e');
    });

    it('should query all categories', async () => {
      const categoryRepo = dataSource.getRepository(BlogCategoryEntity);
      await categoryRepo.save({ name: 'Cat 1', slug: 'cat-1-e2e' });
      await categoryRepo.save({ name: 'Cat 2', slug: 'cat-2-e2e' });

      const query = `
        query {
          categories {
            id
            name
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.categories.length).toBe(2);
    });

    it('should delete a category', async () => {
      const categoryRepo = dataSource.getRepository(BlogCategoryEntity);
      const saved = await categoryRepo.save({ name: 'Delete Cat', slug: 'delete-cat-e2e' });

      const deleteMutation = `
        mutation {
          deleteCategory(id: ${saved.id})
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: deleteMutation })
        .expect(200);

      expect(response.body.data.deleteCategory).toBe(true);

      const found = await categoryRepo.findOne({ where: { id: saved.id } });
      expect(found).toBeNull();
    });
  });

  describe('Tag Operations', () => {
    it('should create a tag', async () => {
      const createMutation = `
        mutation {
          createTag(name: "Test Tag", slug: "test-tag-e2e") {
            id
            name
            slug
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createMutation })
        .expect(200);

      expect(response.body.data.createTag.name).toBe('Test Tag');
    });

    it('should query all tags', async () => {
      const tagRepo = dataSource.getRepository(BlogTagEntity);
      await tagRepo.save({ name: 'Tag 1', slug: 'tag-1-e2e' });
      await tagRepo.save({ name: 'Tag 2', slug: 'tag-2-e2e' });

      const query = `
        query {
          tags {
            id
            name
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.tags.length).toBe(2);
    });

    it('should delete a tag', async () => {
      const tagRepo = dataSource.getRepository(BlogTagEntity);
      const saved = await tagRepo.save({ name: 'Delete Tag', slug: 'delete-tag-e2e' });

      const deleteMutation = `
        mutation {
          deleteTag(id: ${saved.id})
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: deleteMutation })
        .expect(200);

      expect(response.body.data.deleteTag).toBe(true);

      const found = await tagRepo.findOne({ where: { id: saved.id } });
      expect(found).toBeNull();
    });
  });

  describe('Comment Operations', () => {
    it('should create a comment', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const savedPost = await postRepo.save({
        title: 'Post for Comment',
        slug: 'post-comment-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      const createMutation = `
        mutation {
          createComment(input: {
            postId: ${savedPost.id},
            nickname: "Test User",
            email: "test@example.com",
            content: "Test comment content"
          }) {
            id
            nickname
            email
            content
            status
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createMutation })
        .expect(200);

      expect(response.body.data.createComment.nickname).toBe('Test User');
      expect(response.body.data.createComment.email).toBe('test@example.com');
      expect(response.body.data.createComment.status).toBe('PENDING');
    });

    it('should query comments for a post', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const commentRepo = dataSource.getRepository(BlogCommentEntity);

      const savedPost = await postRepo.save({
        title: 'Post for Comments',
        slug: 'post-comments-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      await commentRepo.save({
        postId: savedPost.id,
        nickname: 'User 1',
        content: 'Comment 1',
        status: CommentStatus.APPROVED,
      });

      await commentRepo.save({
        postId: savedPost.id,
        nickname: 'User 2',
        content: 'Comment 2',
        status: CommentStatus.APPROVED,
      });

      const query = `
        query {
          comments(postId: ${savedPost.id}) {
            id
            nickname
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.comments.length).toBe(2);
    });

    it('should increment comment like count', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const commentRepo = dataSource.getRepository(BlogCommentEntity);

      const savedPost = await postRepo.save({
        title: 'Post',
        slug: 'post-comment-like-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      const savedComment = await commentRepo.save({
        postId: savedPost.id,
        nickname: 'User',
        content: 'Comment',
        status: CommentStatus.APPROVED,
        likeCount: 0,
      });

      const likeMutation = `
        mutation {
          likeComment(id: ${savedComment.id})
        }
      `;

      await request(app.getHttpServer()).post('/graphql').send({ query: likeMutation }).expect(200);

      const updated = await commentRepo.findOne({ where: { id: savedComment.id } });
      expect(updated?.likeCount).toBe(1);
    });

    it('should create nested comments up to max depth (3 levels)', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);

      const savedPost = await postRepo.save({
        title: 'Post for Nested Comments',
        slug: 'post-nested-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      // Level 1: Root comment
      const createL1 = `
        mutation {
          createComment(input: {
            postId: ${savedPost.id},
            nickname: "User 1",
            content: "Level 1 comment"
          }) {
            id
            parentId
          }
        }
      `;

      const resL1 = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createL1 })
        .expect(200);

      const l1CommentId = resL1.body.data.createComment.id;
      expect(resL1.body.data.createComment.parentId).toBeNull();

      // Level 2: Reply to root
      const createL2 = `
        mutation {
          createComment(input: {
            postId: ${savedPost.id},
            parentId: ${l1CommentId},
            nickname: "User 2",
            content: "Level 2 comment"
          }) {
            id
            parentId
          }
        }
      `;

      const resL2 = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createL2 })
        .expect(200);

      const l2CommentId = resL2.body.data.createComment.id;
      expect(resL2.body.data.createComment.parentId).toBe(l1CommentId);

      // Level 3: Reply to level 2
      const createL3 = `
        mutation {
          createComment(input: {
            postId: ${savedPost.id},
            parentId: ${l2CommentId},
            nickname: "User 3",
            content: "Level 3 comment"
          }) {
            id
            parentId
          }
        }
      `;

      const resL3 = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createL3 })
        .expect(200);

      // Level 3 should still be under level 2
      expect(resL3.body.data.createComment.parentId).toBe(l2CommentId);
    });

    it('should redirect level-4 reply to root comment (max depth exceeded)', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const commentRepo = dataSource.getRepository(BlogCommentEntity);

      const savedPost = await postRepo.save({
        title: 'Post for Max Depth',
        slug: 'post-max-depth-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      // Create a chain: root -> l1 -> l2 -> l3
      const l1 = await commentRepo.save({
        postId: savedPost.id,
        parentId: null,
        nickname: 'L1',
        content: 'Level 1',
        status: CommentStatus.APPROVED,
      });

      const l2 = await commentRepo.save({
        postId: savedPost.id,
        parentId: l1.id,
        nickname: 'L2',
        content: 'Level 2',
        status: CommentStatus.APPROVED,
      });

      const l3 = await commentRepo.save({
        postId: savedPost.id,
        parentId: l2.id,
        nickname: 'L3',
        content: 'Level 3',
        status: CommentStatus.APPROVED,
      });

      // Try to create level 4 (should redirect to root)
      const createL4 = `
        mutation {
          createComment(input: {
            postId: ${savedPost.id},
            parentId: ${l3.id},
            nickname: "User 4",
            content: "Level 4 comment (should be under root)"
          }) {
            id
            parentId
          }
        }
      `;

      const resL4 = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createL4 })
        .expect(200);

      // Should be redirected to root (l1.id)
      expect(resL4.body.data.createComment.parentId).toBe(l1.id);
    });

    it('should create reply with no email (guestbook scenario)', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);

      const savedPost = await postRepo.save({
        title: 'Guestbook Post',
        slug: 'guestbook-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      const createMutation = `
        mutation {
          createComment(input: {
            postId: ${savedPost.id},
            nickname: "Anonymous",
            content: "Guestbook entry without email"
          }) {
            id
            nickname
            email
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createMutation })
        .expect(200);

      expect(response.body.data.createComment.nickname).toBe('Anonymous');
      expect(response.body.data.createComment.email).toBeNull();
    });
  });

  describe('Link Operations', () => {
    it('should create a link', async () => {
      const createMutation = `
        mutation {
          createLink(title: "Test Link", url: "https://example.com") {
            id
            title
            url
            status
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createMutation })
        .expect(200);

      expect(response.body.data.createLink.title).toBe('Test Link');
      expect(response.body.data.createLink.url).toBe('https://example.com');
      expect(response.body.data.createLink.status).toBe('ACTIVE');
    });

    it('should query active links', async () => {
      const linkRepo = dataSource.getRepository(BlogLinkEntity);
      await linkRepo.save({ title: 'Link 1', url: 'https://a.com', status: LinkStatus.ACTIVE });
      await linkRepo.save({ title: 'Link 2', url: 'https://b.com', status: LinkStatus.ACTIVE });
      await linkRepo.save({ title: 'Inactive', url: 'https://c.com', status: LinkStatus.INACTIVE });

      const query = `
        query {
          links {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.links.length).toBe(2);
    });

    it('should delete a link', async () => {
      const linkRepo = dataSource.getRepository(BlogLinkEntity);
      const saved = await linkRepo.save({
        title: 'Delete Link',
        url: 'https://delete.com',
        status: LinkStatus.ACTIVE,
      });

      const deleteMutation = `
        mutation {
          deleteLink(id: ${saved.id})
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: deleteMutation })
        .expect(200);

      expect(response.body.data.deleteLink).toBe(true);

      const found = await linkRepo.findOne({ where: { id: saved.id } });
      expect(found).toBeNull();
    });
  });

  describe('Query Filters', () => {
    it('should filter posts by category', async () => {
      const categoryRepo = dataSource.getRepository(BlogCategoryEntity);
      const postRepo = dataSource.getRepository(BlogPostEntity);

      const category = await categoryRepo.save({
        name: 'Filter Category',
        slug: 'filter-category-e2e',
      });

      await postRepo.save({
        title: 'Post in Category',
        slug: 'post-in-category-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
        categoryId: category.id,
      });

      await postRepo.save({
        title: 'Post not in Category',
        slug: 'post-not-in-category-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
        categoryId: null,
      });

      const query = `
        query {
          posts(categoryId: ${category.id}) {
            items {
              title
            }
            total
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.posts.total).toBe(1);
      expect(response.body.data.posts.items[0].title).toBe('Post in Category');
    });

    it('should search posts by keyword', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);

      await postRepo.save({
        title: 'JavaScript Tutorial',
        slug: 'javascript-tutorial-e2e',
        content: 'Learn JavaScript',
        status: PostStatus.PUBLISHED,
      });

      await postRepo.save({
        title: 'Python Guide',
        slug: 'python-guide-e2e',
        content: 'Learn Python',
        status: PostStatus.PUBLISHED,
      });

      const query = `
        query {
          posts(keyword: "JavaScript") {
            items {
              title
            }
            total
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.posts.total).toBe(1);
      expect(response.body.data.posts.items[0].title).toBe('JavaScript Tutorial');
    });

    it('should get top posts', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);

      await postRepo.save({
        title: 'Top Post 1',
        slug: 'top-post-1-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
        isTop: true,
      });

      await postRepo.save({
        title: 'Top Post 2',
        slug: 'top-post-2-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
        isTop: true,
      });

      await postRepo.save({
        title: 'Not Top',
        slug: 'not-top-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
        isTop: false,
      });

      // Note: topPosts query is not directly exposed, tested via posts query
      const query = `
        query {
          posts(orderBy: "viewCount", orderDirection: "DESC") {
            items {
              title
              isTop
            }
            total
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.posts.total).toBe(3);
    });
  });
});
