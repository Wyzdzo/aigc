// src/modules/blog/blog.service.ts
import type { PersistenceTransactionContext } from '@app-types/common/transaction.types';
import { BlogPostModel, PostStatus, CommentStatus } from '@app-types/models/blog/blog.types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTypeOrmEntityManager } from '@src/infrastructure/database/transaction/typeorm-persistence-transaction-context';
import { Repository, In } from 'typeorm';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogCommentEntity } from './entities/blog-comment.entity';
import { BlogLinkEntity } from './entities/blog-link.entity';
import { BlogPostEntity } from './entities/blog-post.entity';
import { BlogPostTagEntity } from './entities/blog-post-tag.entity';
import { BlogTagEntity } from './entities/blog-tag.entity';

export interface CreatePostData {
  title: string;
  slug: string;
  content: string;
  summary?: string | null;
  coverImage?: string | null;
  status?: PostStatus;
  isTop?: boolean;
  categoryId?: number | null;
  tagIds?: number[];
}

export interface UpdatePostData {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string | null;
  coverImage?: string | null;
  status?: PostStatus;
  isTop?: boolean;
  categoryId?: number | null;
  tagIds?: number[];
}

export interface CreateCommentData {
  postId: number;
  parentId?: number | null;
  nickname: string;
  email?: string | null;
  avatar?: string | null;
  content: string;
}

@Injectable()
export class BlogService {
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

  // ==================== Post Operations ====================

  async createPost(params: {
    data: CreatePostData;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogPostEntity> {
    const { data, transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);

    const post = repository.create({
      title: data.title,
      slug: data.slug,
      content: data.content,
      summary: data.summary ?? null,
      coverImage: data.coverImage ?? null,
      status: data.status ?? PostStatus.DRAFT,
      isTop: data.isTop ?? false,
      viewCount: 0,
      likeCount: 0,
      categoryId: data.categoryId ?? null,
    });

    const savedPost = await repository.save(post);

    // Handle tags
    if (data.tagIds && data.tagIds.length > 0) {
      await this.addTagsToPost({
        postId: savedPost.id,
        tagIds: data.tagIds,
        transactionContext,
      });
    }

    return savedPost;
  }

  async updatePost(params: {
    id: number;
    data: UpdatePostData;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogPostEntity> {
    const { id, data, transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);

    const existingPost = await repository.findOne({ where: { id } });
    if (!existingPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    await repository.update(id, {
      ...data,
      updatedAt: new Date(),
    });

    const updated = await repository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`Post with id ${id} not found after update`);
    }
    return updated;
  }

  async deletePost(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<boolean> {
    const { id, transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);

    const existingPost = await repository.findOne({ where: { id } });
    if (!existingPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    await repository.softDelete(id);
    return true;
  }

  async incrementViewCount(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<void> {
    const { id, transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);
    await repository.increment({ id }, 'viewCount', 1);
  }

  async incrementLikeCount(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<void> {
    const { id, transactionContext } = params;
    const repository = this.getPostRepository(transactionContext);
    await repository.increment({ id }, 'likeCount', 1);
  }

  // ==================== Category Operations ====================

  async createCategory(params: {
    name: string;
    slug: string;
    description?: string | null;
    parentId?: number | null;
    sortOrder?: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogCategoryEntity> {
    const { name, slug, description, parentId, sortOrder, transactionContext } = params;
    const repository = this.getCategoryRepository(transactionContext);

    const category = repository.create({
      name,
      slug,
      description: description ?? null,
      parentId: parentId ?? null,
      sortOrder: sortOrder ?? 0,
    });

    return await repository.save(category);
  }

  async updateCategory(params: {
    id: number;
    name?: string;
    slug?: string;
    description?: string | null;
    parentId?: number | null;
    sortOrder?: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogCategoryEntity> {
    const { id, transactionContext, ...updateData } = params;
    const repository = this.getCategoryRepository(transactionContext);

    const existing = await repository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    await repository.update(id, { ...updateData, updatedAt: new Date() });
    const updated = await repository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`Category with id ${id} not found after update`);
    }
    return updated;
  }

  async deleteCategory(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<boolean> {
    const { id, transactionContext } = params;
    const repository = this.getCategoryRepository(transactionContext);

    const existing = await repository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    await repository.delete(id);
    return true;
  }

  // ==================== Tag Operations ====================

  async createTag(params: {
    name: string;
    slug: string;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogTagEntity> {
    const { name, slug, transactionContext } = params;
    const repository = this.getTagRepository(transactionContext);

    const tag = repository.create({ name, slug });
    return await repository.save(tag);
  }

  async deleteTag(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<boolean> {
    const { id, transactionContext } = params;
    const repository = this.getTagRepository(transactionContext);

    const existing = await repository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    await repository.delete(id);
    return true;
  }

  // ==================== Post-Tag Operations ====================

  async addTagsToPost(params: {
    postId: number;
    tagIds: number[];
    transactionContext?: PersistenceTransactionContext;
  }): Promise<void> {
    const { postId, tagIds, transactionContext } = params;
    const repository = this.getPostTagRepository(transactionContext);

    const postTags = tagIds.map((tagId) =>
      repository.create({ postId, tagId }),
    );

    await repository.save(postTags);
  }

  async removeTagsFromPost(params: {
    postId: number;
    tagIds: number[];
    transactionContext?: PersistenceTransactionContext;
  }): Promise<void> {
    const { postId, tagIds, transactionContext } = params;
    const repository = this.getPostTagRepository(transactionContext);

    await repository.delete({ postId, tagId: In(tagIds) });
  }

  async clearPostTags(params: {
    postId: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<void> {
    const { postId, transactionContext } = params;
    const repository = this.getPostTagRepository(transactionContext);
    await repository.delete({ postId });
  }

  // ==================== Comment Operations ====================

  async createComment(params: {
    data: CreateCommentData;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogCommentEntity> {
    const { data, transactionContext } = params;
    const repository = this.getCommentRepository(transactionContext);

    const comment = repository.create({
      postId: data.postId,
      parentId: data.parentId ?? null,
      nickname: data.nickname,
      email: data.email ?? null,
      avatar: data.avatar ?? null,
      content: data.content,
      status: CommentStatus.PENDING,
      likeCount: 0,
    });

    return await repository.save(comment);
  }

  async updateCommentStatus(params: {
    id: number;
    status: CommentStatus;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogCommentEntity> {
    const { id, status, transactionContext } = params;
    const repository = this.getCommentRepository(transactionContext);

    const existing = await repository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    await repository.update(id, { status });
    const updated = await repository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`Comment with id ${id} not found after update`);
    }
    return updated;
  }

  async deleteComment(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<boolean> {
    const { id, transactionContext } = params;
    const repository = this.getCommentRepository(transactionContext);

    const existing = await repository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    await repository.delete(id);
    return true;
  }

  async incrementCommentLikeCount(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<void> {
    const { id, transactionContext } = params;
    const repository = this.getCommentRepository(transactionContext);
    await repository.increment({ id }, 'likeCount', 1);
  }

  // ==================== Link Operations ====================

  async createLink(params: {
    title: string;
    url: string;
    description?: string | null;
    logo?: string | null;
    sortOrder?: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogLinkEntity> {
    const { title, url, description, logo, sortOrder, transactionContext } = params;
    const repository = this.getLinkRepository(transactionContext);

    const link = repository.create({
      title,
      url,
      description: description ?? null,
      logo: logo ?? null,
      sortOrder: sortOrder ?? 0,
    });

    return await repository.save(link);
  }

  async updateLink(params: {
    id: number;
    title?: string;
    url?: string;
    description?: string | null;
    logo?: string | null;
    sortOrder?: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogLinkEntity> {
    const { id, transactionContext, ...updateData } = params;
    const repository = this.getLinkRepository(transactionContext);

    const existing = await repository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Link with id ${id} not found`);
    }

    await repository.update(id, { ...updateData, updatedAt: new Date() });
    const updated = await repository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`Link with id ${id} not found after update`);
    }
    return updated;
  }

  async deleteLink(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<boolean> {
    const { id, transactionContext } = params;
    const repository = this.getLinkRepository(transactionContext);

    const existing = await repository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Link with id ${id} not found`);
    }

    await repository.delete(id);
    return true;
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
}