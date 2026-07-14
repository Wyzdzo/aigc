// src/modules/blog/queries/blog.query.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostStatus, CommentStatus, LinkStatus } from '@app-types/models/blog/blog.types';
import { BlogQueryService } from './blog.query.service';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { BlogCommentEntity } from '../entities/blog-comment.entity';
import { BlogLinkEntity } from '../entities/blog-link.entity';
import { BlogPostEntity } from '../entities/blog-post.entity';
import { BlogPostTagEntity } from '../entities/blog-post-tag.entity';
import { BlogTagEntity } from '../entities/blog-tag.entity';

describe('BlogQueryService', () => {
  let service: BlogQueryService;
  let postRepository: Repository<BlogPostEntity>;
  let categoryRepository: Repository<BlogCategoryEntity>;
  let tagRepository: Repository<BlogTagEntity>;
  let postTagRepository: Repository<BlogPostTagEntity>;
  let commentRepository: Repository<BlogCommentEntity>;
  let linkRepository: Repository<BlogLinkEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogQueryService,
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

    service = module.get<BlogQueryService>(BlogQueryService);
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

  describe('getPostById', () => {
    it('should return post when found', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      } as BlogPostEntity;

      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);

      const result = await service.getPostById({ id: 1 });

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.title).toBe('Test Post');
    });

    it('should return null when post not found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      const result = await service.getPostById({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('getPostBySlug', () => {
    it('should return post by slug', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      } as BlogPostEntity;

      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);

      const result = await service.getPostBySlug({ slug: 'test-post' });

      expect(result?.slug).toBe('test-post');
    });

    it('should return null when slug not found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      const result = await service.getPostBySlug({ slug: 'not-found' });

      expect(result).toBeNull();
    });
  });

  describe('getPosts', () => {
    /** 创建通用 queryBuilder mock（含 addOrderBy） */
    function createQueryBuilderMock(overrides: Record<string, any> = {}) {
      return {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
        ...overrides,
      };
    }

    it('should return paginated posts', async () => {
      const mockPosts: Partial<BlogPostEntity>[] = [
        { id: 1, title: 'Post 1', slug: 'post-1', status: PostStatus.PUBLISHED },
        { id: 2, title: 'Post 2', slug: 'post-2', status: PostStatus.PUBLISHED },
      ];

      const queryBuilderMock = createQueryBuilderMock({
        getManyAndCount: jest.fn().mockResolvedValue([mockPosts, 10]),
      });

      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      const result = await service.getPosts({
        options: { page: 1, pageSize: 10 },
      });

      expect(result.items.length).toBe(2);
      expect(result.total).toBe(10);
      expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
    });

    it('should filter posts by category', async () => {
      const queryBuilderMock = createQueryBuilderMock();

      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      await service.getPosts({
        options: { categoryId: 1 },
      });

      expect(queryBuilderMock.where).toHaveBeenCalledWith('post.categoryId = :categoryId', {
        categoryId: 1,
      });
    });

    it('should filter posts by keyword', async () => {
      const queryBuilderMock = createQueryBuilderMock();

      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      await service.getPosts({
        options: { keyword: 'test' },
      });

      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        '(post.title LIKE :keyword OR post.content LIKE :keyword)',
        { keyword: '%test%' },
      );
    });

    it('should filter posts by tag', async () => {
      const queryBuilderMock = createQueryBuilderMock();

      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      await service.getPosts({
        options: { tagId: 1 },
      });

      expect(queryBuilderMock.innerJoin).toHaveBeenCalledWith(
        'blog_post_tag',
        'pt',
        'pt.postId = post.id',
      );
    });

    it('should order by isTop DESC first, then by specified field', async () => {
      const queryBuilderMock = createQueryBuilderMock();

      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      await service.getPosts({
        options: { orderBy: 'createdAt', orderDirection: 'DESC' },
      });

      // 置顶优先排序
      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('post.isTop', 'DESC');
      // 其次按指定字段排序
      expect(queryBuilderMock.addOrderBy).toHaveBeenCalledWith('post.createdAt', 'DESC');
    });

    it('should default to createdAt DESC when no orderBy specified', async () => {
      const queryBuilderMock = createQueryBuilderMock();

      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      await service.getPosts({ options: {} });

      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('post.isTop', 'DESC');
      expect(queryBuilderMock.addOrderBy).toHaveBeenCalledWith('post.createdAt', 'DESC');
    });

    it('should support ordering by viewCount ASC with isTop priority', async () => {
      const queryBuilderMock = createQueryBuilderMock();

      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      await service.getPosts({
        options: { orderBy: 'viewCount', orderDirection: 'ASC' },
      });

      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('post.isTop', 'DESC');
      expect(queryBuilderMock.addOrderBy).toHaveBeenCalledWith('post.viewCount', 'ASC');
    });
  });

  describe('getTopPosts', () => {
    it('should return top posts', async () => {
      const mockPosts: Partial<BlogPostEntity>[] = [
        { id: 1, title: 'Top Post 1', isTop: true, status: PostStatus.PUBLISHED },
        { id: 2, title: 'Top Post 2', isTop: true, status: PostStatus.PUBLISHED },
      ];

      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockPosts),
      };

      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      const result = await service.getTopPosts({ limit: 5 });

      expect(result.length).toBe(2);
      expect(queryBuilderMock.where).toHaveBeenCalledWith('post.isTop = :isTop', { isTop: true });
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('post.status = :status', {
        status: PostStatus.PUBLISHED,
      });
    });
  });

  describe('getPostTags', () => {
    it('should return tags for a post', async () => {
      const mockPostTags = [
        { postId: 1, tagId: 1 },
        { postId: 1, tagId: 2 },
      ];
      const mockTags = [
        { id: 1, name: 'Tag 1', slug: 'tag-1' },
        { id: 2, name: 'Tag 2', slug: 'tag-2' },
      ];

      jest.spyOn(postTagRepository, 'find').mockResolvedValue(mockPostTags as any);
      jest.spyOn(tagRepository, 'find').mockResolvedValue(mockTags as any);

      const result = await service.getPostTags({ postId: 1 });

      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Tag 1');
    });

    it('should return empty array when no tags', async () => {
      jest.spyOn(postTagRepository, 'find').mockResolvedValue([]);

      const result = await service.getPostTags({ postId: 1 });

      expect(result).toEqual([]);
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories sorted', async () => {
      const mockCategories = [
        { id: 1, name: 'Cat 1', sortOrder: 2 },
        { id: 2, name: 'Cat 2', sortOrder: 1 },
      ];

      jest.spyOn(categoryRepository, 'find').mockResolvedValue(mockCategories as any);

      const result = await service.getAllCategories({});

      expect(result.length).toBe(2);
    });
  });

  describe('getCategoryTree', () => {
    it('should build category tree', async () => {
      const mockCategories: BlogCategoryEntity[] = [
        {
          id: 1,
          name: 'Root 1',
          slug: 'root-1',
          description: null,
          parentId: null,
          sortOrder: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Child 1',
          slug: 'child-1',
          description: null,
          parentId: 1,
          sortOrder: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Root 2',
          slug: 'root-2',
          description: null,
          parentId: null,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(categoryRepository, 'find').mockResolvedValue(mockCategories);

      const result = await service.getCategoryTree({});

      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Root 1');
      expect((result[0] as any).children?.length).toBe(1);
      expect((result[0] as any).children?.[0].name).toBe('Child 1');
    });
  });

  describe('getAllTags', () => {
    it('should return all tags', async () => {
      const mockTags = [
        { id: 1, name: 'Tag 1', slug: 'tag-1', createdAt: new Date() },
        { id: 2, name: 'Tag 2', slug: 'tag-2', createdAt: new Date() },
      ];

      jest.spyOn(tagRepository, 'find').mockResolvedValue(mockTags as any);

      const result = await service.getAllTags({});

      expect(result.length).toBe(2);
    });
  });

  describe('getComments', () => {
    it('should return comments for a post', async () => {
      const mockComments: Partial<BlogCommentEntity>[] = [
        { id: 1, postId: 1, content: 'Comment 1', status: CommentStatus.APPROVED },
        { id: 2, postId: 1, content: 'Comment 2', status: CommentStatus.APPROVED },
      ];

      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockComments, 10]),
      };

      jest.spyOn(commentRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      const result = await service.getComments({
        options: { postId: 1, page: 1, pageSize: 20 },
      });

      expect(result.items.length).toBe(2);
      expect(result.total).toBe(10);
    });

    it('should filter by postId=0 for guestbook comments', async () => {
      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      jest.spyOn(commentRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      await service.getComments({
        options: { postId: 0, status: CommentStatus.APPROVED, page: 1, pageSize: 20 },
      });

      // postId=0 should still trigger the WHERE clause (not be treated as falsy)
      expect(queryBuilderMock.where).toHaveBeenCalledWith('comment.postId = :postId', { postId: 0 });
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('comment.status = :status', { status: CommentStatus.APPROVED });
    });
  });

  describe('getCommentCountByPost', () => {
    it('should return comment count', async () => {
      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(5),
      };

      jest.spyOn(commentRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      const result = await service.getCommentCountByPost({ postId: 1 });

      expect(result).toBe(5);
    });
  });

  describe('getPostStats', () => {
    it('should return total, published, draft counts with view/like aggregation', async () => {
      jest
        .spyOn(postRepository, 'count')
        .mockResolvedValueOnce(20) // total
        .mockResolvedValueOnce(15) // published
        .mockResolvedValueOnce(5); // draft

      const queryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          totalViewCount: '1500',
          totalLikeCount: '320',
        }),
      };
      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      const result = await service.getPostStats({});

      expect(result.total).toBe(20);
      expect(result.published).toBe(15);
      expect(result.draft).toBe(5);
      expect(result.totalViewCount).toBe(1500);
      expect(result.totalLikeCount).toBe(320);
      expect(queryBuilderMock.select).toHaveBeenCalledWith(
        'COALESCE(SUM(post.viewCount), 0)',
        'totalViewCount',
      );
      expect(queryBuilderMock.addSelect).toHaveBeenCalledWith(
        'COALESCE(SUM(post.likeCount), 0)',
        'totalLikeCount',
      );
    });

    it('should return zero view/like counts when no posts exist', async () => {
      jest
        .spyOn(postRepository, 'count')
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const queryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          totalViewCount: '0',
          totalLikeCount: '0',
        }),
      };
      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      const result = await service.getPostStats({});

      expect(result.totalViewCount).toBe(0);
      expect(result.totalLikeCount).toBe(0);
    });

    it('should handle getRawOne returning undefined gracefully', async () => {
      jest
        .spyOn(postRepository, 'count')
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const queryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      const result = await service.getPostStats({});

      expect(result.totalViewCount).toBe(0);
      expect(result.totalLikeCount).toBe(0);
    });
  });

  describe('getCommentStats', () => {
    it('should return total, pending, approved, and rejected counts', async () => {
      jest.spyOn(commentRepository, 'count').mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(10) // pending
        .mockResolvedValueOnce(35) // approved
        .mockResolvedValueOnce(5); // rejected

      const result = await service.getCommentStats({});

      expect(result.total).toBe(50);
      expect(result.pending).toBe(10);
      expect(result.approved).toBe(35);
      expect(result.rejected).toBe(5);
      expect(commentRepository.count).toHaveBeenCalledTimes(4);
    });
  });

  describe('getCategoryStats', () => {
    it('should return total count', async () => {
      jest.spyOn(categoryRepository, 'count').mockResolvedValue(8);

      const result = await service.getCategoryStats({});

      expect(result.total).toBe(8);
      expect(categoryRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTagStats', () => {
    it('should return total count', async () => {
      jest.spyOn(tagRepository, 'count').mockResolvedValue(12);

      const result = await service.getTagStats({});

      expect(result.total).toBe(12);
      expect(tagRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLinkStats', () => {
    it('should return total count', async () => {
      jest.spyOn(linkRepository, 'count').mockResolvedValue(5);

      const result = await service.getLinkStats({});

      expect(result.total).toBe(5);
      expect(linkRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllLinks', () => {
    it('should return active links sorted', async () => {
      const mockLinks: Partial<BlogLinkEntity>[] = [
        {
          id: 1,
          title: 'Link 1',
          url: 'https://example.com',
          status: LinkStatus.ACTIVE,
          sortOrder: 2,
        },
        {
          id: 2,
          title: 'Link 2',
          url: 'https://test.com',
          status: LinkStatus.ACTIVE,
          sortOrder: 1,
        },
      ];

      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockLinks),
      };

      jest.spyOn(linkRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      const result = await service.getAllLinks({ status: LinkStatus.ACTIVE });

      expect(result.length).toBe(2);
    });
  });
});
