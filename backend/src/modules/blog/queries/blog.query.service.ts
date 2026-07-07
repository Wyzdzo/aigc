// src/modules/blog/queries/blog.query.service.ts
import type { PersistenceTransactionContext } from '@app-types/common/transaction.types';
import { PostStatus, CommentStatus, LinkStatus } from '@app-types/models/blog/blog.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTypeOrmEntityManager } from '@src/infrastructure/database/transaction/typeorm-persistence-transaction-context';
import { Repository, In } from 'typeorm';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { BlogCommentEntity } from '../entities/blog-comment.entity';
import { BlogLinkEntity } from '../entities/blog-link.entity';
import { BlogPostEntity } from '../entities/blog-post.entity';
import { BlogPostTagEntity } from '../entities/blog-post-tag.entity';
import { BlogTagEntity } from '../entities/blog-tag.entity';

export interface PostQueryOptions {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  tagId?: number;
  status?: PostStatus;
  keyword?: string;
  orderBy?: 'createdAt' | 'viewCount' | 'likeCount';
  orderDirection?: 'ASC' | 'DESC';
}

export interface CommentQueryOptions {
  postId?: number;
  parentId?: number;
  status?: CommentStatus;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class BlogQueryService {
  constructor(
    @InjectRepository(BlogPostEntity)
    private readonly postRepository: Repository<BlogPostEntity>,
    @InjectRepository(BlogCategoryEntity)
    private readonly categoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogTagEntity)
    private readonly tagRepository: Repository<BlogTagEntity>,
    @InjectRepository(BlogPostTagEntity)
    private readonly postTagRepository: Repository<BlogPostTagEntity>,
    @InjectRepository(BlogCommentEntity)
    private readonly commentRepository: Repository<BlogCommentEntity>,
    @InjectRepository(BlogLinkEntity)
    private readonly linkRepository: Repository<BlogLinkEntity>,
  ) {}

  // ==================== Post Queries ====================

  async getPostById(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogPostEntity | null> {
    const { id, transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);
    return await repository.findOne({ where: { id } });
  }

  async getPostBySlug(params: {
    slug: string;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogPostEntity | null> {
    const { slug, transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);
    return await repository.findOne({ where: { slug } });
  }

  async getPosts(params: {
    options?: PostQueryOptions;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<{ items: BlogPostEntity[]; total: number }> {
    const { options = {}, transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);

    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const queryBuilder = repository.createQueryBuilder('post');

    // Filters
    if (options.categoryId) {
      queryBuilder.where('post.categoryId = :categoryId', { categoryId: options.categoryId });
    }

    if (options.status) {
      const whereClause = options.categoryId ? 'AND' : 'WHERE';
      queryBuilder[whereClause === 'WHERE' ? 'where' : 'andWhere']('post.status = :status', {
        status: options.status,
      });
    }

    if (options.keyword) {
      const whereClause = options.categoryId || options.status ? 'AND' : 'WHERE';
      queryBuilder[whereClause === 'WHERE' ? 'where' : 'andWhere'](
        '(post.title LIKE :keyword OR post.content LIKE :keyword)',
        { keyword: `%${options.keyword}%` },
      );
    }

    // Tag filter
    if (options.tagId) {
      queryBuilder
        .innerJoin('blog_post_tag', 'pt', 'pt.postId = post.id')
        .where('pt.tagId = :tagId', { tagId: options.tagId });
    }

    // Order
    const orderBy = options.orderBy ?? 'createdAt';
    const orderDirection = options.orderDirection ?? 'DESC';
    queryBuilder.orderBy(`post.${orderBy}`, orderDirection);

    // Pagination
    queryBuilder.skip(skip).take(pageSize);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  /**
   * 获取相邻文章（上一篇/下一篇）
   * 基于 id 排序（自增 ID 天然反映创建顺序），仅返回已发布的文章
   */
  async getAdjacentPosts(params: {
    slug: string;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<{ prev: BlogPostEntity | null; next: BlogPostEntity | null }> {
    const { slug, transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);

    const currentPost = await repository.findOne({
      where: { slug, status: PostStatus.PUBLISHED },
      select: { id: true },
    });

    if (!currentPost) {
      return { prev: null, next: null };
    }

    // 上一篇（列表中更靠前的文章，即更新发布的，id 更大）
    const prev = await repository
      .createQueryBuilder('post')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .andWhere('post.id > :id', { id: currentPost.id })
      .orderBy('post.id', 'ASC')
      .take(1)
      .getOne();

    // 下一篇（列表中更靠后的文章，即更早发布的，id 更小）
    const next = await repository
      .createQueryBuilder('post')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .andWhere('post.id < :id', { id: currentPost.id })
      .orderBy('post.id', 'DESC')
      .take(1)
      .getOne();

    return { prev, next };
  }

  async getTopPosts(params: {
    limit?: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogPostEntity[]> {
    const { limit = 5, transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);

    return await repository
      .createQueryBuilder('post')
      .where('post.isTop = :isTop', { isTop: true })
      .andWhere('post.status = :status', { status: PostStatus.PUBLISHED })
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async getPostTags(params: {
    postId: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogTagEntity[]> {
    const { postId, transactionContext } = params;
    const tagRepository = this.getTagRepository(transactionContext);
    const postTagRepository = this.getPostTagRepository(transactionContext);

    const postTags = await postTagRepository.find({ where: { postId } });
    const tagIds = postTags.map((pt) => pt.tagId);

    if (tagIds.length === 0) {
      return [];
    }

    return await tagRepository.find({ where: { id: In(tagIds) } });
  }

  // ==================== Category Queries ====================

  async getAllCategories(params: {
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogCategoryEntity[]> {
    const { transactionContext } = params;
    const repository = this.getCategoryRepository(transactionContext);

    return await repository.find({ order: { sortOrder: 'ASC', createdAt: 'DESC' } });
  }

  async getCategoryById(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogCategoryEntity | null> {
    const { id, transactionContext } = params;
    const repository = this.getCategoryRepository(transactionContext);
    return await repository.findOne({ where: { id } });
  }

  async getCategoryBySlug(params: {
    slug: string;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogCategoryEntity | null> {
    const { slug, transactionContext } = params;
    const repository = this.getCategoryRepository(transactionContext);
    return await repository.findOne({ where: { slug } });
  }

  async getCategoryTree(params: {
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogCategoryEntity[]> {
    const { transactionContext } = params;
    const repository = this.getCategoryRepository(transactionContext);

    const categories = await repository.find({ order: { sortOrder: 'ASC' } });
    return this.buildTree(categories);
  }

  // ==================== Tag Queries ====================

  async getAllTags(params: {
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogTagEntity[]> {
    const { transactionContext } = params;
    const repository = this.getTagRepository(transactionContext);
    return await repository.find({ order: { createdAt: 'DESC' } });
  }

  async getTagById(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogTagEntity | null> {
    const { id, transactionContext } = params;
    const repository = this.getTagRepository(transactionContext);
    return await repository.findOne({ where: { id } });
  }

  async getTagBySlug(params: {
    slug: string;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogTagEntity | null> {
    const { slug, transactionContext } = params;
    const repository = this.getTagRepository(transactionContext);
    return await repository.findOne({ where: { slug } });
  }

  // ==================== Comment Queries ====================

  async getComments(params: {
    options?: CommentQueryOptions;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<{ items: BlogCommentEntity[]; total: number }> {
    const { options = {}, transactionContext } = params;
    const repository = this.getCommentRepository(transactionContext);

    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const queryBuilder = repository.createQueryBuilder('comment');

    if (options.postId) {
      queryBuilder.where('comment.postId = :postId', { postId: options.postId });
    }

    if (options.parentId !== undefined) {
      const whereClause = options.postId ? 'AND' : 'WHERE';
      queryBuilder[whereClause === 'WHERE' ? 'where' : 'andWhere']('comment.parentId = :parentId', {
        parentId: options.parentId,
      });
    }

    if (options.status) {
      const whereClause = options.postId || options.parentId !== undefined ? 'AND' : 'WHERE';
      queryBuilder[whereClause === 'WHERE' ? 'where' : 'andWhere']('comment.status = :status', {
        status: options.status,
      });
    }

    queryBuilder.orderBy('comment.createdAt', 'DESC').skip(skip).take(pageSize);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async getCommentById(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogCommentEntity | null> {
    const { id, transactionContext } = params;
    const repository = this.getCommentRepository(transactionContext);
    return await repository.findOne({ where: { id } });
  }

  async getCommentCountByPost(params: {
    postId: number;
    status?: CommentStatus;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<number> {
    const { postId, status, transactionContext } = params;
    const repository = this.getCommentRepository(transactionContext);

    const query = repository
      .createQueryBuilder('comment')
      .where('comment.postId = :postId', { postId });

    if (status) {
      query.andWhere('comment.status = :status', { status });
    }

    return await query.getCount();
  }

  // ==================== Link Queries ====================

  async getAllLinks(params: {
    status?: LinkStatus;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogLinkEntity[]> {
    const { status, transactionContext } = params;
    const repository = this.getLinkRepository(transactionContext);

    const query = repository.createQueryBuilder('link');

    if (status) {
      query.where('link.status = :status', { status });
    }

    query.orderBy('link.sortOrder', 'ASC');

    return await query.getMany();
  }

  // ==================== Stats Queries ====================

  async getPostStats(params: { transactionContext?: PersistenceTransactionContext }): Promise<{
    total: number;
    published: number;
    draft: number;
    totalViewCount: number;
    totalLikeCount: number;
  }> {
    const { transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);

    const total = await repository.count();
    const published = await repository.count({ where: { status: PostStatus.PUBLISHED } });
    const draft = await repository.count({ where: { status: PostStatus.DRAFT } });

    // 聚合总阅读量和总点赞量
    const sumResult: { totalViewCount: string; totalLikeCount: string } | undefined =
      await repository
        .createQueryBuilder('post')
        .select('COALESCE(SUM(post.viewCount), 0)', 'totalViewCount')
        .addSelect('COALESCE(SUM(post.likeCount), 0)', 'totalLikeCount')
        .getRawOne();

    return {
      total,
      published,
      draft,
      totalViewCount: Number(sumResult?.totalViewCount ?? 0),
      totalLikeCount: Number(sumResult?.totalLikeCount ?? 0),
    };
  }

  async getCommentStats(params: {
    transactionContext?: PersistenceTransactionContext;
  }): Promise<{ total: number; pending: number; approved: number; rejected: number }> {
    const { transactionContext } = params;
    const repository = this.getCommentRepository(transactionContext);

    const total = await repository.count();
    const pending = await repository.count({ where: { status: CommentStatus.PENDING } });
    const approved = await repository.count({ where: { status: CommentStatus.APPROVED } });
    const rejected = await repository.count({ where: { status: CommentStatus.REJECTED } });

    return { total, pending, approved, rejected };
  }

  async getCategoryStats(params: {
    transactionContext?: PersistenceTransactionContext;
  }): Promise<{ total: number }> {
    const { transactionContext } = params;
    const repository = this.getCategoryRepository(transactionContext);
    const total = await repository.count();
    return { total };
  }

  async getTagStats(params: {
    transactionContext?: PersistenceTransactionContext;
  }): Promise<{ total: number }> {
    const { transactionContext } = params;
    const repository = this.getTagRepository(transactionContext);
    const total = await repository.count();
    return { total };
  }

  async getLinkStats(params: {
    transactionContext?: PersistenceTransactionContext;
  }): Promise<{ total: number }> {
    const { transactionContext } = params;
    const repository = this.getLinkRepository(transactionContext);
    const total = await repository.count();
    return { total };
  }

  // ==================== Repository Helpers ====================

  private getPostRepository(
    transactionContext?: PersistenceTransactionContext,
  ): Repository<BlogPostEntity> {
    return transactionContext
      ? getTypeOrmEntityManager(transactionContext).getRepository(BlogPostEntity)
      : this.postRepository;
  }

  private getCategoryRepository(
    transactionContext?: PersistenceTransactionContext,
  ): Repository<BlogCategoryEntity> {
    return transactionContext
      ? getTypeOrmEntityManager(transactionContext).getRepository(BlogCategoryEntity)
      : this.categoryRepository;
  }

  private getTagRepository(
    transactionContext?: PersistenceTransactionContext,
  ): Repository<BlogTagEntity> {
    return transactionContext
      ? getTypeOrmEntityManager(transactionContext).getRepository(BlogTagEntity)
      : this.tagRepository;
  }

  private getPostTagRepository(
    transactionContext?: PersistenceTransactionContext,
  ): Repository<BlogPostTagEntity> {
    return transactionContext
      ? getTypeOrmEntityManager(transactionContext).getRepository(BlogPostTagEntity)
      : this.postTagRepository;
  }

  private getCommentRepository(
    transactionContext?: PersistenceTransactionContext,
  ): Repository<BlogCommentEntity> {
    return transactionContext
      ? getTypeOrmEntityManager(transactionContext).getRepository(BlogCommentEntity)
      : this.commentRepository;
  }

  private getLinkRepository(
    transactionContext?: PersistenceTransactionContext,
  ): Repository<BlogLinkEntity> {
    return transactionContext
      ? getTypeOrmEntityManager(transactionContext).getRepository(BlogLinkEntity)
      : this.linkRepository;
  }

  private buildTree(
    categories: BlogCategoryEntity[],
  ): (BlogCategoryEntity & { children?: BlogCategoryEntity[] })[] {
    interface CategoryWithChildren extends BlogCategoryEntity {
      children?: BlogCategoryEntity[];
    }

    const map = new Map<number, CategoryWithChildren>();
    const roots: CategoryWithChildren[] = [];

    categories.forEach((category) => {
      map.set(category.id, { ...category });
    });

    categories.forEach((category) => {
      if (category.parentId && map.has(category.parentId)) {
        const parent = map.get(category.parentId)!;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(map.get(category.id)!);
      } else {
        roots.push(map.get(category.id)!);
      }
    });

    return roots;
  }
}
