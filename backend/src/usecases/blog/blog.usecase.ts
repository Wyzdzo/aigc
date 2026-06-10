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
import { BlogPostEntity } from '@src/modules/blog/entities/blog-post.entity';
import { BlogCommentEntity } from '@src/modules/blog/entities/blog-comment.entity';

export interface CreatePostResult {
  post: BlogPostEntity;
}

export interface UpdatePostResult {
  success: boolean;
}

export interface DeletePostResult {
  success: boolean;
}

export interface CreateCommentResult {
  comment: BlogCommentEntity;
}

@Injectable()
export class BlogUsecase {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogQueryService: BlogQueryService,
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
  }): Promise<BlogPostEntity | null> {
    // Increment view count
    await this.blogService.incrementViewCount({
      id: params.id,
      transactionContext: params.transactionContext,
    });

    // Return post
    return this.blogQueryService.getPostById({
      id: params.id,
      transactionContext: params.transactionContext,
    });
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
      const comment = await this.blogService.createComment({
        data: params.data,
        transactionContext: activeTransactionContext,
      });
      return { comment };
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
  }): Promise<BlogPostEntity | null> {
    return this.blogQueryService.getPostById({
      id: params.id,
      transactionContext: params.transactionContext,
    });
  }

  async getPostBySlug(params: {
    slug: string;
    transactionContext?: PersistenceTransactionContext;
  }): Promise<BlogPostEntity | null> {
    return this.blogQueryService.getPostBySlug({
      slug: params.slug,
      transactionContext: params.transactionContext,
    });
  }
}