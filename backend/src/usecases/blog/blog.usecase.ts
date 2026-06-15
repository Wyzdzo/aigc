// src/usecases/blog/blog.usecase.ts

import type { PersistenceTransactionContext } from '@app-types/common/transaction.types';
import { PostStatus } from '@app-types/models/blog/blog.types';
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
  post: { id: number; title: string; slug: string };
}

export interface UpdatePostResult {
  success: boolean;
}

export interface DeletePostResult {
  success: boolean;
}

export interface CreateCommentResult {
  comment: { id: number; nickname: string; email: string | null; content: string; createdAt: Date };
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
      return { post: { id: post.id, title: post.title, slug: post.slug } };
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

      // 获取被回复的评论（如果有）
      let parentComment: CommentNotificationCommentView | null = null;
      if (params.data.parentId) {
        const rawParent = await this.blogQueryService.getCommentById({
          id: params.data.parentId,
          transactionContext: activeTransactionContext,
        });
        if (rawParent) {
          parentComment = {
            id: rawParent.id,
            nickname: rawParent.nickname,
            email: rawParent.email,
            content: rawParent.content,
            createdAt: rawParent.createdAt,
          };
        }
      }

      // 创建评论
      const comment = await this.blogService.createComment({
        data: params.data,
        transactionContext: activeTransactionContext,
      });

      // 准备返回的视图
      const commentView: CreateCommentResult['comment'] = {
        id: comment.id,
        nickname: comment.nickname,
        email: comment.email,
        content: comment.content,
        createdAt: comment.createdAt,
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

  // ==================== Query Operations ====================

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

      // 使用 setImmediate 异步执行，不阻塞主流程
      void this.notifyCommentUsecase.notifyNewComment({
        to: this.blogOwnerEmail,
        data: newCommentData,
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

      void this.notifyCommentUsecase.notifyCommentReply({
        to: parentComment.email,
        data: replyData,
      });
    }
  }
}
