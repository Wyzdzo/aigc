// src/usecases/blog/blog.usecase.ts

import type { PersistenceTransactionContext } from '@app-types/common/transaction.types';
import { PostStatus, CommentStatus, LinkStatus } from '@app-types/models/blog/blog.types';
import { Inject, Injectable } from '@nestjs/common';
import {
  BlogService,
  type CreatePostData,
  type UpdatePostData,
  type CreateCommentData,
} from '@src/modules/blog/blog.service';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import {
  TRANSACTION_RUNNER,
  type TransactionRunner,
} from '@src/usecases/common/ports/transaction-runner.contract';
import {
  NotifyCommentUsecase,
  type CommentNotificationData,
  type CommentReplyNotificationData,
  type CommentNotificationPostView,
  type CommentNotificationCommentView,
} from './notification';

export interface CreatePostResult {
  post: {
    id: number;
    title: string;
    slug: string;
    content: string;
    summary: string | null;
    coverImage: string | null;
    status: PostStatus;
    isTop: boolean;
    viewCount: number;
    likeCount: number;
    categoryId: number | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface UpdatePostResult {
  success: boolean;
}

export interface DeletePostResult {
  success: boolean;
}

export interface CommentResult {
  id: number;
  postId: number;
  parentId: number | null;
  nickname: string;
  email: string | null;
  avatar: string | null;
  content: string;
  status: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryResult {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagResult {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface LinkResult {
  id: number;
  title: string;
  url: string;
  description: string | null;
  logo: string | null;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentResult {
  comment: {
    id: number;
    postId: number;
    parentId: number | null;
    nickname: string;
    email: string | null;
    avatar: string | null;
    content: string;
    status: string;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class BlogUsecase {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogQueryService: BlogQueryService,
    private readonly notifyCommentUsecase: NotifyCommentUsecase,
    @Inject('BLOG_SITE_URL') private readonly siteUrl: string,
    @Inject('BLOG_OWNER_EMAIL') private readonly blogOwnerEmail: string,
    @Inject(TRANSACTION_RUNNER)
    private readonly transactionRunner: TransactionRunner,
  ) {}

  // ==================== Post Operations ====================

  async createPost(params: {
    data: CreatePostData;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<CreatePostResult> {
    const run = async (activeTransactionContext: PersistenceTransactionContext) => {
      const post = await this.blogService.createPost({
        data: params.data,
        transactionContext: activeTransactionContext,
      });
      return { post };
    };

    return params.transactionContext
      ? await run(params.transactionContext)
      : await this.transactionRunner.run(run);
  }

  async updatePost(params: {
    id: number;
    data: UpdatePostData;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<UpdatePostResult> {
    const run = async (activeTransactionContext: PersistenceTransactionContext) => {
      await this.blogService.updatePost({
        id: params.id,
        data: params.data,
        transactionContext: activeTransactionContext,
      });

      // 如果更新了 slug，需要清理旧的关联标签并重新关联
      if (params.data.tagIds) {
        await this.blogService.clearPostTags({
          postId: params.id,
          transactionContext: activeTransactionContext,
        });
        await this.blogService.addTagsToPost({
          postId: params.id,
          tagIds: params.data.tagIds,
          transactionContext: activeTransactionContext,
        });
      }

      return { success: true };
    };

    return params.transactionContext
      ? await run(params.transactionContext)
      : await this.transactionRunner.run(run);
  }

  async deletePost(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<DeletePostResult> {
    const run = async (activeTransactionContext: PersistenceTransactionContext) => {
      await this.blogService.deletePost({
        id: params.id,
        transactionContext: activeTransactionContext,
      });
      return { success: true };
    };

    return params.transactionContext
      ? await run(params.transactionContext)
      : await this.transactionRunner.run(run);
  }

  async publishPost(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<UpdatePostResult> {
    return this.updatePost({
      id: params.id,
      data: { status: PostStatus.PUBLISHED },
      transactionContext: params.transactionContext,
    });
  }

  async unpublishPost(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<UpdatePostResult> {
    return this.updatePost({
      id: params.id,
      data: { status: PostStatus.DRAFT },
      transactionContext: params.transactionContext,
    });
  }

  async viewPost(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<CommentNotificationPostView | null> {
    // Increment view count
    await this.blogService.incrementViewCount({
      id: params.id,
      transactionContext: params.transactionContext,
    });

    // Return post
    const post = await this.blogQueryService.getPostById({
      id: params.id,
      transactionContext: params.transactionContext,
    });

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
    };
  }

  async likePost(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<void> {
    await this.blogService.incrementLikeCount({
      id: params.id,
      transactionContext: params.transactionContext,
    });
  }

  /** 评论最大嵌套层级 */
  private static readonly MAX_COMMENT_DEPTH = 3;

  // ==================== Comment Operations ====================

  async createComment(params: {
    data: CreateCommentData;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<CreateCommentResult> {
    const run = async (activeTransactionContext: PersistenceTransactionContext) => {
      // 获取文章信息用于通知
      const post = await this.blogQueryService.getPostById({
        id: params.data.postId,
        transactionContext: activeTransactionContext,
      });

      // 获取被回复的评论（如果有），并处理嵌套层级限制
      let parentComment: CommentNotificationCommentView | null = null;
      let effectiveParentId: number | null | undefined = params.data.parentId;

      if (params.data.parentId) {
        const resolved = await this.resolveCommentParent({
          parentId: params.data.parentId,
          transactionContext: activeTransactionContext,
        });
        if (resolved) {
          effectiveParentId = resolved.effectiveParentId;
          parentComment = resolved.parentComment;
        }
      }

      // 创建评论
      const comment = await this.blogService.createComment({
        data: { ...params.data, parentId: effectiveParentId },
        transactionContext: activeTransactionContext,
      });

      // 准备返回的视图
      const commentView: CreateCommentResult['comment'] = {
        id: comment.id,
        postId: comment.postId,
        parentId: comment.parentId,
        nickname: comment.nickname,
        email: comment.email,
        avatar: comment.avatar,
        content: comment.content,
        status: comment.status,
        likeCount: comment.likeCount,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };

      // 准备文章视图用于通知
      const postView: CommentNotificationPostView | null = post
        ? { id: post.id, title: post.title, slug: post.slug }
        : null;

      // 异步发送通知（不阻塞评论创建）
      this.sendCommentNotifications({
        comment: commentView,
        post: postView,
        parentComment,
      });

      return { comment: commentView };
    };

    return params.transactionContext
      ? await run(params.transactionContext)
      : await this.transactionRunner.run(run);
  }

  async likeComment(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<void> {
    await this.blogService.incrementCommentLikeCount({
      id: params.id,
      transactionContext: params.transactionContext,
    });
  }

  async updateCommentStatus(params: {
    id: number;
    status: string;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<CommentResult> {
    const comment = await this.blogService.updateCommentStatus({
      id: params.id,
      status: params.status as CommentStatus,
      transactionContext: params.transactionContext,
    });

    return {
      id: comment.id,
      postId: comment.postId,
      parentId: comment.parentId,
      nickname: comment.nickname,
      email: comment.email,
      avatar: comment.avatar,
      content: comment.content,
      status: comment.status,
      likeCount: comment.likeCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  async deleteComment(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<boolean> {
    return this.blogService.deleteComment({
      id: params.id,
      transactionContext: params.transactionContext,
    });
  }

  // ==================== Category Operations ====================

  async createCategory(params: {
    name: string;
    slug: string;
    description?: string | null;
    parentId?: number | null;
    sortOrder?: number;
  }): Promise<CategoryResult> {
    const category = await this.blogService.createCategory(params);
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async updateCategory(params: {
    id: number;
    name?: string;
    slug?: string;
    description?: string | null;
    parentId?: number | null;
    sortOrder?: number;
  }): Promise<CategoryResult> {
    const category = await this.blogService.updateCategory(params);
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async deleteCategory(params: { id: number }): Promise<boolean> {
    return this.blogService.deleteCategory({
      id: params.id,
    });
  }

  // ==================== Tag Operations ====================

  async createTag(params: { name: string; slug: string }): Promise<TagResult> {
    const tag = await this.blogService.createTag(params);
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      createdAt: tag.createdAt,
    };
  }

  async updateTag(params: { id: number; name?: string; slug?: string }): Promise<TagResult> {
    const tag = await this.blogService.updateTag(params);
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      createdAt: tag.createdAt,
    };
  }

  async deleteTag(params: { id: number }): Promise<boolean> {
    return this.blogService.deleteTag({
      id: params.id,
    });
  }

  // ==================== Link Operations ====================

  async createLink(params: {
    title: string;
    url: string;
    description?: string | null;
    logo?: string | null;
    sortOrder?: number;
  }): Promise<LinkResult> {
    const link = await this.blogService.createLink(params);
    return {
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
      logo: link.logo,
      sortOrder: link.sortOrder,
      status: link.status,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }

  async updateLink(params: {
    id: number;
    title?: string;
    url?: string;
    description?: string | null;
    logo?: string | null;
    sortOrder?: number;
  }): Promise<LinkResult> {
    const link = await this.blogService.updateLink(params);
    return {
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
      logo: link.logo,
      sortOrder: link.sortOrder,
      status: link.status,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }

  async deleteLink(params: { id: number }): Promise<boolean> {
    return this.blogService.deleteLink({
      id: params.id,
    });
  }

  // ==================== Query Operations ====================

  async getAdjacentPosts(params: {
    slug: string;
    transactionContext?: PersistenceTransactionContext;
  }) {
    return this.blogQueryService.getAdjacentPosts({
      slug: params.slug,
      transactionContext: params.transactionContext,
    });
  }

  async getPostById(params: {
    id: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<CommentNotificationPostView | null> {
    const post = await this.blogQueryService.getPostById({
      id: params.id,
      transactionContext: params.transactionContext,
    });

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
    };
  }

  async getPostBySlug(params: {
    slug: string;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<CommentNotificationPostView | null> {
    const post = await this.blogQueryService.getPostBySlug({
      slug: params.slug,
      transactionContext: params.transactionContext,
    });

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
    };
  }

  /** 读委托：返回完整实体供 Resolver 映射 DTO */
  async findPostById(params: { id: number; transactionContext?: PersistenceTransactionContext }) {
    return this.blogQueryService.getPostById(params);
  }

  /** 读委托：返回完整实体供 Resolver 映射 DTO */
  async findPostBySlug(params: {
    slug: string;
    transactionContext?: PersistenceTransactionContext;
  }) {
    return this.blogQueryService.getPostBySlug(params);
  }

  /** @deprecated Resolver should call this via Usecase; will be the only path after migration */
  async getPosts(params: {
    options: {
      page?: number;
      pageSize?: number;
      categoryId?: number;
      tagId?: number;
      status?: PostStatus;
      keyword?: string;
      orderBy?: 'createdAt' | 'viewCount' | 'likeCount';
      orderDirection?: 'ASC' | 'DESC';
    };
    transactionContext?: PersistenceTransactionContext;
  }) {
    return this.blogQueryService.getPosts(params);
  }

  async getTopPosts(params: Record<string, unknown>) {
    return this.blogQueryService.getTopPosts(params);
  }

  async getCommentCountByPost(params: { postId: number }) {
    return this.blogQueryService.getCommentCountByPost(params);
  }

  async getCommentCountByPosts(params: { postIds: number[] }) {
    return this.blogQueryService.getCommentCountByPosts(params);
  }

  async getAllCategories(params: Record<string, unknown>) {
    return this.blogQueryService.getAllCategories(params);
  }

  async getCategoryById(params: { id: number }) {
    return this.blogQueryService.getCategoryById(params);
  }

  async getCategoryBySlug(params: { slug: string }) {
    return this.blogQueryService.getCategoryBySlug(params);
  }

  async getCategoryTree(params: Record<string, unknown>) {
    return this.blogQueryService.getCategoryTree(params);
  }

  async getAllTags(params: Record<string, unknown>) {
    return this.blogQueryService.getAllTags(params);
  }

  async getTagById(params: { id: number }) {
    return this.blogQueryService.getTagById(params);
  }

  async getPostTags(params: { postId: number }) {
    return this.blogQueryService.getPostTags(params);
  }

  async getComments(params: {
    options: {
      postId?: number;
      status?: CommentStatus;
      page?: number;
      pageSize?: number;
    };
    transactionContext?: PersistenceTransactionContext;
  }) {
    return this.blogQueryService.getComments(params);
  }

  async getPostStats(params: Record<string, unknown>) {
    return this.blogQueryService.getPostStats(params);
  }

  async getCommentStats(params: Record<string, unknown>) {
    return this.blogQueryService.getCommentStats(params);
  }

  async getCategoryStats(params: Record<string, unknown>) {
    return this.blogQueryService.getCategoryStats(params);
  }

  async getTagStats(params: Record<string, unknown>) {
    return this.blogQueryService.getTagStats(params);
  }

  async getLinkStats(params: Record<string, unknown>) {
    return this.blogQueryService.getLinkStats(params);
  }

  async getAllLinks(params: { status?: LinkStatus; transactionContext?: PersistenceTransactionContext } = {}) {
    return this.blogQueryService.getAllLinks(params);
  }

  // ==================== Notification Helpers ====================

  /**
   * 发送评论通知（异步，不阻塞主流程）
   */
  private sendCommentNotifications(params: {
    comment: { nickname: string; email: string | null; content: string; createdAt: Date };
    post: CommentNotificationPostView | null;
    parentComment: CommentNotificationCommentView | null;
  }): void {
    const { comment, post, parentComment } = params;

    // 如果没有关联的文章（如留言板），跳过通知
    if (!post) {
      return;
    }

    const postUrl = `${this.siteUrl}/blog/${post.slug}`;

    // 1. 通知博主有新评论
    if (comment.email) {
      const newCommentData: CommentNotificationData = {
        postTitle: post.title,
        postUrl,
        commenterNickname: comment.nickname,
        commentContent: comment.content,
        commentTime: comment.createdAt,
      };

      // 通知操作不阻塞主流程，错误在 NotifyCommentUsecase 内部处理
      this.notifyCommentUsecase
        .notifyNewComment({
          to: this.blogOwnerEmail,
          data: newCommentData,
        })
        .catch(() => {
          // 错误已在 NotifyCommentUsecase 内部记录日志，此处静默处理
        });
    }

    // 2. 如果是回复，通知被回复者
    if (parentComment && parentComment.email && parentComment.email !== comment.email) {
      const replyData: CommentReplyNotificationData = {
        replyToNickname: parentComment.nickname,
        postTitle: post.title,
        postUrl,
        replierNickname: comment.nickname,
        replyContent: comment.content,
        replyTime: comment.createdAt,
      };

      this.notifyCommentUsecase
        .notifyCommentReply({
          to: parentComment.email,
          data: replyData,
        })
        .catch(() => {
          // 错误已在 NotifyCommentUsecase 内部记录日志，此处静默处理
        });
    }
  }

  /**
   * 获取评论的嵌套深度
   * @returns 深度值（1表示根评论，2表示一级回复，3表示二级回复）
   */
  private async getCommentDepth(params: {
    commentId: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<number> {
    let depth = 1;
    let currentId: number | null = params.commentId;

    while (currentId !== null && depth <= BlogUsecase.MAX_COMMENT_DEPTH) {
      const comment = await this.blogQueryService.getCommentById({
        id: currentId,
        transactionContext: params.transactionContext,
      });

      if (!comment) {
        break;
      }

      if (comment.parentId === null) {
        break;
      }

      currentId = comment.parentId;
      depth++;
    }

    return depth;
  }

  /**
   * 获取评论的根评论ID
   * @returns 根评论的ID，如果没有父评论则返回当前评论ID
   */
  private async getRootCommentId(params: {
    commentId: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<number | null> {
    let currentId: number | null = params.commentId;

    while (currentId !== null) {
      const comment = await this.blogQueryService.getCommentById({
        id: currentId,
        transactionContext: params.transactionContext,
      });

      if (!comment) {
        return null;
      }

      if (comment.parentId === null) {
        return comment.id;
      }

      currentId = comment.parentId;
    }

    return null;
  }

  /**
   * 处理评论嵌套层级，获取实际的父评论ID和父评论视图
   * @returns 包含 effectiveParentId 和 updatedParentComment 的结果
   */
  private async resolveCommentParent(params: {
    parentId: number;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<{
    effectiveParentId: number;
    parentComment: CommentNotificationCommentView;
  } | null> {
    const rawParent = await this.blogQueryService.getCommentById({
      id: params.parentId,
      transactionContext: params.transactionContext,
    });

    if (!rawParent) {
      return null;
    }

    let effectiveParentId = params.parentId;
    let parentComment: CommentNotificationCommentView = {
      id: rawParent.id,
      nickname: rawParent.nickname,
      email: rawParent.email,
      content: rawParent.content,
      createdAt: rawParent.createdAt,
    };

    const depth = await this.getCommentDepth({
      commentId: params.parentId,
      transactionContext: params.transactionContext,
    });

    if (depth >= BlogUsecase.MAX_COMMENT_DEPTH) {
      const rootCommentId = await this.getRootCommentId({
        commentId: params.parentId,
        transactionContext: params.transactionContext,
      });

      if (rootCommentId !== null && rootCommentId !== params.parentId) {
        const rootComment = await this.blogQueryService.getCommentById({
          id: rootCommentId,
          transactionContext: params.transactionContext,
        });

        if (rootComment) {
          effectiveParentId = rootComment.id;
          parentComment = {
            id: rootComment.id,
            nickname: rootComment.nickname,
            email: rootComment.email,
            content: rootComment.content,
            createdAt: rootComment.createdAt,
          };
        }
      }
    }

    return { effectiveParentId, parentComment };
  }
}
