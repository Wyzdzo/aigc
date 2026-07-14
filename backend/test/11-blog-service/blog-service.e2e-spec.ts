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
    await dataSource.getRepository(BlogCommentEntity).clear();
    await dataSource.getRepository(BlogLinkEntity).clear();
    await dataSource.getRepository(BlogTagEntity).clear();
    await dataSource.getRepository(BlogCategoryEntity).clear();
    await dataSource.getRepository(BlogPostEntity).clear();
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
          }
        }
      `;

      // First view
      await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: viewMutation })
        .expect(200);

      // Verify view count incremented via direct DB query
      const afterFirst = await postRepo.findOne({ where: { id: savedPost.id } });
      expect(afterFirst?.viewCount).toBe(1);

      // Second view
      await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: viewMutation })
        .expect(200);

      const afterSecond = await postRepo.findOne({ where: { id: savedPost.id } });
      expect(afterSecond?.viewCount).toBe(2);
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

    it('should update a category', async () => {
      const categoryRepo = dataSource.getRepository(BlogCategoryEntity);
      const saved = await categoryRepo.save({
        name: 'Original Cat',
        slug: 'original-cat-e2e',
        description: 'Old desc',
        sortOrder: 0,
      });

      const updateMutation = `
        mutation {
          updateCategory(id: ${saved.id}, name: "Updated Cat", description: "New desc", sortOrder: 5) {
            id
            name
            slug
            description
            sortOrder
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: updateMutation })
        .expect(200);

      expect(response.body.data.updateCategory.name).toBe('Updated Cat');
      expect(response.body.data.updateCategory.slug).toBe('original-cat-e2e');
      expect(response.body.data.updateCategory.description).toBe('New desc');
      expect(response.body.data.updateCategory.sortOrder).toBe(5);
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

    it('should update a tag', async () => {
      const tagRepo = dataSource.getRepository(BlogTagEntity);
      const saved = await tagRepo.save({ name: 'Original Tag', slug: 'original-tag-e2e' });

      const updateMutation = `
        mutation {
          updateTag(id: ${saved.id}, name: "Updated Tag") {
            id
            name
            slug
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: updateMutation })
        .expect(200);

      expect(response.body.data.updateTag.name).toBe('Updated Tag');
      expect(response.body.data.updateTag.slug).toBe('original-tag-e2e');
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
            items {
              id
              nickname
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.comments.items.length).toBe(2);
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

    it('should update comment status to APPROVED', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const commentRepo = dataSource.getRepository(BlogCommentEntity);

      const savedPost = await postRepo.save({
        title: 'Post for Status Update',
        slug: 'post-status-update-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      const savedComment = await commentRepo.save({
        postId: savedPost.id,
        nickname: 'User',
        content: 'Pending comment',
        status: CommentStatus.PENDING,
        likeCount: 0,
      });

      const updateMutation = `
        mutation {
          updateCommentStatus(id: ${savedComment.id}, status: APPROVED) {
            id
            status
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: updateMutation })
        .expect(200);

      expect(response.body.data.updateCommentStatus.id).toBe(savedComment.id);
      expect(response.body.data.updateCommentStatus.status).toBe('APPROVED');
    });

    it('should update comment status to REJECTED', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const commentRepo = dataSource.getRepository(BlogCommentEntity);

      const savedPost = await postRepo.save({
        title: 'Post for Reject',
        slug: 'post-reject-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      const savedComment = await commentRepo.save({
        postId: savedPost.id,
        nickname: 'Spammer',
        content: 'Spam comment',
        status: CommentStatus.PENDING,
        likeCount: 0,
      });

      const updateMutation = `
        mutation {
          updateCommentStatus(id: ${savedComment.id}, status: REJECTED) {
            id
            status
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: updateMutation })
        .expect(200);

      expect(response.body.data.updateCommentStatus.status).toBe('REJECTED');
    });

    it('should delete a comment', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const commentRepo = dataSource.getRepository(BlogCommentEntity);

      const savedPost = await postRepo.save({
        title: 'Post for Delete Comment',
        slug: 'post-delete-comment-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });

      const savedComment = await commentRepo.save({
        postId: savedPost.id,
        nickname: 'User',
        content: 'Comment to delete',
        status: CommentStatus.PENDING,
        likeCount: 0,
      });

      const deleteMutation = `
        mutation {
          deleteComment(id: ${savedComment.id})
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: deleteMutation })
        .expect(200);

      expect(response.body.data.deleteComment).toBe(true);

      const found = await commentRepo.findOne({ where: { id: savedComment.id } });
      expect(found).toBeNull();
    });
  });

  describe('Guestbook Comments', () => {
    it('should create a guestbook comment with postId=0', async () => {
      const createMutation = `
        mutation {
          createComment(input: {
            postId: 0,
            nickname: "Guestbook User",
            email: "guest@example.com",
            content: "Guestbook message"
          }) {
            id
            postId
            nickname
            content
            status
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createMutation })
        .expect(200);

      expect(response.body.data.createComment).toBeDefined();
      expect(response.body.data.createComment.postId).toBe(0);
      expect(response.body.data.createComment.nickname).toBe('Guestbook User');
      expect(response.body.data.createComment.content).toBe('Guestbook message');
      expect(response.body.data.createComment.status).toBe('PENDING');
    });

    it('should query guestbook comments with postId=0', async () => {
      const commentRepo = dataSource.getRepository(BlogCommentEntity);

      await commentRepo.save({
        postId: 0,
        nickname: 'Guest 1',
        content: 'Guestbook entry 1',
        status: CommentStatus.APPROVED,
      });

      await commentRepo.save({
        postId: 0,
        nickname: 'Guest 2',
        content: 'Guestbook entry 2',
        status: CommentStatus.APPROVED,
      });

      const query = `
        query {
          comments(postId: 0) {
            items {
              id
              postId
              nickname
              content
              status
            }
            total
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.comments.items.length).toBe(2);
      expect(response.body.data.comments.total).toBe(2);
      expect(response.body.data.comments.items.every((c: any) => c.postId === 0)).toBe(true);
    });

    it('should create a reply to a guestbook comment (nested guestbook comments)', async () => {
      // Create root guestbook comment via GraphQL
      const createRootMutation = `
        mutation {
          createComment(input: {
            postId: 0,
            nickname: "Guestbook User",
            email: "guest@example.com",
            content: "Guestbook message"
          }) {
            id
            parentId
          }
        }
      `;

      const rootRes = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createRootMutation })
        .expect(200);

      const parentId = rootRes.body.data.createComment.id;
      expect(rootRes.body.data.createComment.parentId).toBeNull();

      // Create reply to root guestbook comment
      const createReplyMutation = `
        mutation {
          createComment(input: {
            postId: 0,
            parentId: ${parentId},
            nickname: "Reply User",
            content: "Reply to guestbook"
          }) {
            id
            parentId
            nickname
            content
          }
        }
      `;

      const replyRes = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createReplyMutation })
        .expect(200);

      expect(replyRes.body.data.createComment.parentId).toBe(parentId);
      expect(replyRes.body.data.createComment.nickname).toBe('Reply User');
      expect(replyRes.body.data.createComment.content).toBe('Reply to guestbook');
    });

    it('should query comments with postId=0 and status filter', async () => {
      const commentRepo = dataSource.getRepository(BlogCommentEntity);

      await commentRepo.save({
        postId: 0,
        nickname: 'Approved Guest',
        content: 'Approved entry',
        status: CommentStatus.APPROVED,
      });

      await commentRepo.save({
        postId: 0,
        nickname: 'Pending Guest',
        content: 'Pending entry',
        status: CommentStatus.PENDING,
      });

      await commentRepo.save({
        postId: 0,
        nickname: 'Rejected Guest',
        content: 'Rejected entry',
        status: CommentStatus.REJECTED,
      });

      const query = `
        query {
          comments(postId: 0, status: APPROVED) {
            items {
              id
              nickname
              status
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.comments.items.length).toBe(1);
      expect(response.body.data.comments.items[0].nickname).toBe('Approved Guest');
      expect(response.body.data.comments.items[0].status).toBe('APPROVED');
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
          activeLinks {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(200);

      expect(response.body.data.activeLinks.length).toBe(2);
    });

    it('should update a link', async () => {
      const linkRepo = dataSource.getRepository(BlogLinkEntity);
      const saved = await linkRepo.save({
        title: 'Original Link',
        url: 'https://original.com',
        status: LinkStatus.ACTIVE,
      });

      const updateMutation = `
        mutation {
          updateLink(id: ${saved.id}, title: "Updated Link", description: "New description", sortOrder: 10) {
            id
            title
            url
            description
            sortOrder
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: updateMutation })
        .expect(200);

      expect(response.body.data.updateLink.title).toBe('Updated Link');
      expect(response.body.data.updateLink.url).toBe('https://original.com');
      expect(response.body.data.updateLink.description).toBe('New description');
      expect(response.body.data.updateLink.sortOrder).toBe(10);
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

    it('should list pinned posts before non-pinned posts regardless of other sort order', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);

      // 非置顶但更新的文章
      await postRepo.save({
        title: 'Normal New Post',
        slug: 'normal-new-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
        isTop: false,
        viewCount: 100,
      });

      // 置顶但更旧的文章
      await postRepo.save({
        title: 'Pinned Old Post',
        slug: 'pinned-old-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
        isTop: true,
        viewCount: 1,
      });

      // 验证：无论 viewCount 排序如何，置顶文章始终在前
      const query = `
        query {
          posts(orderBy: "viewCount", orderDirection: "DESC") {
            items {
              title
              isTop
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const items = response.body.data.posts.items;
      expect(items.length).toBe(2);
      // 置顶文章排在第一个，即使 viewCount 更低
      expect(items[0].title).toBe('Pinned Old Post');
      expect(items[0].isTop).toBe(true);
      expect(items[1].title).toBe('Normal New Post');
      expect(items[1].isTop).toBe(false);
    });
  });

  describe('Stats Queries', () => {
    it('should return postStats with correct structure', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      await postRepo.save({
        title: 'Published Stat Post',
        slug: 'published-stat-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });
      await postRepo.save({
        title: 'Draft Stat Post',
        slug: 'draft-stat-e2e',
        content: 'Content',
        status: PostStatus.DRAFT,
      });

      const query = `
        query {
          postStats {
            total
            published
            draft
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const stats = response.body.data.postStats;
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.published).toBe('number');
      expect(typeof stats.draft).toBe('number');
      expect(stats.total).toBeGreaterThanOrEqual(2);
      expect(stats.published).toBeGreaterThanOrEqual(1);
      expect(stats.draft).toBeGreaterThanOrEqual(1);
    });

    it('should return commentStats with correct structure', async () => {
      const postRepo = dataSource.getRepository(BlogPostEntity);
      const commentRepo = dataSource.getRepository(BlogCommentEntity);

      const savedPost = await postRepo.save({
        title: 'Post for Comment Stats',
        slug: 'post-comment-stats-e2e',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      });
      await commentRepo.save({
        postId: savedPost.id,
        nickname: 'User 1',
        content: 'Approved comment',
        status: CommentStatus.APPROVED,
      });
      await commentRepo.save({
        postId: savedPost.id,
        nickname: 'User 2',
        content: 'Pending comment',
        status: CommentStatus.PENDING,
      });
      await commentRepo.save({
        postId: savedPost.id,
        nickname: 'User 3',
        content: 'Rejected comment',
        status: CommentStatus.REJECTED,
      });

      const query = `
        query {
          commentStats {
            total
            pending
            approved
            rejected
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const stats = response.body.data.commentStats;
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.pending).toBe('number');
      expect(typeof stats.approved).toBe('number');
      expect(typeof stats.rejected).toBe('number');
      expect(stats.total).toBeGreaterThanOrEqual(3);
      expect(stats.pending).toBeGreaterThanOrEqual(1);
      expect(stats.approved).toBeGreaterThanOrEqual(1);
      expect(stats.rejected).toBeGreaterThanOrEqual(1);
    });

    it('should return categoryStats with correct structure', async () => {
      const categoryRepo = dataSource.getRepository(BlogCategoryEntity);
      await categoryRepo.save({ name: 'Stats Cat 1', slug: 'stats-cat-1-e2e' });
      await categoryRepo.save({ name: 'Stats Cat 2', slug: 'stats-cat-2-e2e' });

      const query = `
        query {
          categoryStats {
            total
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const stats = response.body.data.categoryStats;
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBeGreaterThanOrEqual(2);
    });

    it('should return tagStats with correct structure', async () => {
      const tagRepo = dataSource.getRepository(BlogTagEntity);
      await tagRepo.save({ name: 'Stats Tag 1', slug: 'stats-tag-1-e2e' });
      await tagRepo.save({ name: 'Stats Tag 2', slug: 'stats-tag-2-e2e' });

      const query = `
        query {
          tagStats {
            total
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const stats = response.body.data.tagStats;
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBeGreaterThanOrEqual(2);
    });

    it('should return linkStats with correct structure', async () => {
      const linkRepo = dataSource.getRepository(BlogLinkEntity);
      await linkRepo.save({
        title: 'Stats Link 1',
        url: 'https://stats1.com',
        status: LinkStatus.ACTIVE,
      });
      await linkRepo.save({
        title: 'Stats Link 2',
        url: 'https://stats2.com',
        status: LinkStatus.ACTIVE,
      });

      const query = `
        query {
          linkStats {
            total
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const stats = response.body.data.linkStats;
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBeGreaterThanOrEqual(2);
    });

    it('should return zero stats when no data exists', async () => {
      const query = `
        query {
          postStats { total published draft }
          commentStats { total pending approved rejected }
          categoryStats { total }
          tagStats { total }
          linkStats { total }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      // After cleanup, all stats should be zero or at least numeric
      const data = response.body.data;
      expect(data.postStats.total).toBe(0);
      expect(data.postStats.published).toBe(0);
      expect(data.postStats.draft).toBe(0);
      expect(data.commentStats.total).toBe(0);
      expect(data.commentStats.pending).toBe(0);
      expect(data.commentStats.approved).toBe(0);
      expect(data.commentStats.rejected).toBe(0);
      expect(data.categoryStats.total).toBe(0);
      expect(data.tagStats.total).toBe(0);
      expect(data.linkStats.total).toBe(0);
    });
  });
});
