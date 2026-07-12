// src/adapters/api/graphql/blog/blog.resolver.ts
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogPostDTO } from './dto/blog-post.dto';
import { BlogCategoryDTO } from './dto/blog-category.dto';
import { BlogTagDTO } from './dto/blog-tag.dto';
import { BlogCommentDTO } from './dto/blog-comment.dto';
import { BlogLinkDTO } from './dto/blog-link.dto';
import { CreateBlogPostInput } from './dto/create-blog-post.input';
import { UpdateBlogPostInput } from './dto/update-blog-post.input';
import { CreateBlogCommentInput } from './dto/create-blog-comment.input';
import { BlogPostsArgs } from './dto/blog-posts.args';
import { BlogPostsResult } from './dto/blog-posts.result';
import { BlogPostNavigationDTO } from './dto/blog-post-navigation.dto';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import {
  BlogUsecase,
  type CategoryResult,
  type TagResult,
  type CommentResult,
  type LinkResult,
} from '@src/usecases/blog/blog.usecase';
import { PostStatsDTO, CommentStatsDTO, CategoryStatsDTO, TagStatsDTO, LinkStatsDTO } from './dto/blog-stats.dto';
import { BlogCommentsResult } from './dto/blog-comments.result';
import { PostStatus, CommentStatus, LinkStatus } from '@app-types/models/blog/blog.types';

type OrderByType = 'createdAt' | 'viewCount' | 'likeCount';
type OrderDirectionType = 'ASC' | 'DESC';

@Resolver(() => BlogPostDTO)
export class BlogResolver {
  constructor(
    private readonly blogQueryService: BlogQueryService,
    private readonly blogUsecase: BlogUsecase,
  ) {}

  // ==================== Post Queries ====================

  @Query(() => BlogPostsResult, { description: '查询文章列表' })
  async posts(@Args() args: BlogPostsArgs): Promise<BlogPostsResult> {
    const result = await this.blogQueryService.getPosts({
      options: {
        page: args.page,
        pageSize: args.pageSize,
        categoryId: args.categoryId,
        tagId: args.tagId,
        status: args.status,
        keyword: args.keyword,
        orderBy: args.orderBy as OrderByType,
        orderDirection: args.orderDirection as OrderDirectionType,
      },
    });

    // 批量获取评论数，避免 N+1 查询
    const postIds = result.items.map((p: any) => p.id);
    const commentCountMap = await this.blogQueryService.getCommentCountByPosts({ postIds });

    return {
      items: result.items.map((p: any) => this.toPostDTO(p, commentCountMap.get(p.id) ?? 0)),
      total: result.total,
      page: args.page ?? 1,
      pageSize: args.pageSize ?? 10,
    };
  }

  @Query(() => BlogPostDTO, { description: '根据 ID 查询文章', nullable: true })
  async post(@Args('id', { type: () => Int }) id: number): Promise<BlogPostDTO | null> {
    const post = await this.blogQueryService.getPostById({ id });
    if (!post) return null;
    const commentCount = await this.blogQueryService.getCommentCountByPost({ postId: id });
    return this.toPostDTO(post, commentCount);
  }

  @Query(() => BlogPostDTO, { description: '根据 slug 查询文章', nullable: true })
  async postBySlug(@Args('slug') slug: string): Promise<BlogPostDTO | null> {
    const post = await this.blogQueryService.getPostBySlug({ slug });
    if (!post) return null;
    const commentCount = await this.blogQueryService.getCommentCountByPost({ postId: post.id });
    return this.toPostDTO(post, commentCount);
  }

  @Query(() => [BlogPostDTO], { description: '查询置顶文章' })
  async topPosts(): Promise<BlogPostDTO[]> {
    const posts = await this.blogQueryService.getTopPosts({});
    const postIds = posts.map((p: any) => p.id);
    const commentCountMap = await this.blogQueryService.getCommentCountByPosts({ postIds });
    return posts.map((p: any) => this.toPostDTO(p, commentCountMap.get(p.id) ?? 0));
  }

  @Query(() => BlogPostNavigationDTO, { description: '查询相邻文章（上一篇/下一篇）' })
  async adjacentPosts(@Args('slug') slug: string): Promise<BlogPostNavigationDTO> {
    const { prev, next } = await this.blogUsecase.getAdjacentPosts({ slug });
    return {
      prev: prev ? this.toPostDTO(prev) : null,
      next: next ? this.toPostDTO(next) : null,
    };
  }

  // ==================== Category Queries ====================

  @Query(() => [BlogCategoryDTO], { description: '查询所有分类' })
  async categories(): Promise<BlogCategoryDTO[]> {
    const categories = await this.blogQueryService.getAllCategories({});
    return categories.map(this.toCategoryDTO);
  }

  @Query(() => BlogCategoryDTO, { description: '根据 ID 查询分类', nullable: true })
  async category(@Args('id', { type: () => Int }) id: number): Promise<BlogCategoryDTO | null> {
    const category = await this.blogQueryService.getCategoryById({ id });
    return category ? this.toCategoryDTO(category) : null;
  }

  @Query(() => BlogCategoryDTO, { description: '根据 slug 查询分类', nullable: true })
  async categoryBySlug(@Args('slug') slug: string): Promise<BlogCategoryDTO | null> {
    const category = await this.blogQueryService.getCategoryBySlug({ slug });
    return category ? this.toCategoryDTO(category) : null;
  }

  @Query(() => [BlogCategoryDTO], { description: '查询分类树' })
  async categoryTree(): Promise<BlogCategoryDTO[]> {
    const categories = await this.blogQueryService.getCategoryTree({});
    return categories.map((c) => this.toCategoryDTO(c));
  }

  // ==================== Tag Queries ====================

  @Query(() => [BlogTagDTO], { description: '查询所有标签' })
  async tags(): Promise<BlogTagDTO[]> {
    const tags = await this.blogQueryService.getAllTags({});
    return tags.map(this.toTagDTO);
  }

  @Query(() => BlogTagDTO, { description: '根据 ID 查询标签', nullable: true })
  async tag(@Args('id', { type: () => Int }) id: number): Promise<BlogTagDTO | null> {
    const tag = await this.blogQueryService.getTagById({ id });
    return tag ? this.toTagDTO(tag) : null;
  }

  @Query(() => [BlogTagDTO], { description: '查询文章标签' })
  async postTags(@Args('postId', { type: () => Int }) postId: number): Promise<BlogTagDTO[]> {
    const tags = await this.blogQueryService.getPostTags({ postId });
    return tags.map(this.toTagDTO);
  }

  // ==================== Comment Queries ====================

  @Query(() => BlogCommentsResult, { description: '查询评论列表' })
  async comments(
    @Args('postId', { type: () => Int, nullable: true }) postId?: number,
    @Args('status', { type: () => CommentStatus, nullable: true }) status?: CommentStatus,
    @Args('page', { type: () => Int, defaultValue: 1 }) page?: number,
    @Args('pageSize', { type: () => Int, defaultValue: 20 }) pageSize?: number,
  ): Promise<BlogCommentsResult> {
    const result = await this.blogQueryService.getComments({
      options: {
        postId,
        status,
        page,
        pageSize,
      },
    });
    return {
      items: result.items.map(this.toCommentDTO),
      total: result.total,
      page: page ?? 1,
      pageSize: pageSize ?? 20,
    };
  }

  // ==================== Stats Queries ====================

  @Query(() => PostStatsDTO, { description: '文章统计' })
  async postStats(): Promise<PostStatsDTO> {
    return await this.blogQueryService.getPostStats({});
  }

  @Query(() => CommentStatsDTO, { description: '评论统计' })
  async commentStats(): Promise<CommentStatsDTO> {
    return await this.blogQueryService.getCommentStats({});
  }

  @Query(() => CategoryStatsDTO, { description: '分类统计' })
  async categoryStats(): Promise<CategoryStatsDTO> {
    return await this.blogQueryService.getCategoryStats({});
  }

  @Query(() => TagStatsDTO, { description: '标签统计' })
  async tagStats(): Promise<TagStatsDTO> {
    return await this.blogQueryService.getTagStats({});
  }

  @Query(() => LinkStatsDTO, { description: '友链统计' })
  async linkStats(): Promise<LinkStatsDTO> {
    return await this.blogQueryService.getLinkStats({});
  }

  // ==================== Link Queries ====================

  @Query(() => [BlogLinkDTO], { description: '查询所有友链' })
  async links(): Promise<BlogLinkDTO[]> {
    const links = await this.blogQueryService.getAllLinks({});
    return links.map(this.toLinkDTO);
  }

  @Query(() => [BlogLinkDTO], { description: '查询活跃友链' })
  async activeLinks(): Promise<BlogLinkDTO[]> {
    const links = await this.blogQueryService.getAllLinks({ status: LinkStatus.ACTIVE });
    return links.map(this.toLinkDTO);
  }

  // ==================== Post Mutations ====================

  @Mutation(() => BlogPostDTO, { description: '创建文章' })
  async createPost(@Args('input') input: CreateBlogPostInput): Promise<BlogPostDTO> {
    const result = await this.blogUsecase.createPost({
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        summary: input.summary,
        coverImage: input.coverImage,
        status: input.status,
        isTop: input.isTop,
        categoryId: input.categoryId,
        tagIds: input.tagIds,
      },
    });
    return this.toPostDTO(result.post, 0);
  }

  @Mutation(() => BlogPostDTO, { description: '更新文章', nullable: true })
  async updatePost(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateBlogPostInput,
  ): Promise<BlogPostDTO | null> {
    await this.blogUsecase.updatePost({
      id,
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        summary: input.summary,
        coverImage: input.coverImage,
        status: input.status,
        isTop: input.isTop,
        categoryId: input.categoryId,
      },
    });

    const post = await this.blogQueryService.getPostById({ id });
    if (!post) return null;
    const commentCount = await this.blogQueryService.getCommentCountByPost({ postId: id });
    return this.toPostDTO(post, commentCount);
  }

  @Mutation(() => Boolean, { description: '删除文章' })
  async deletePost(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const result = await this.blogUsecase.deletePost({ id });
    return result.success;
  }

  @Mutation(() => Boolean, { description: '发布文章' })
  async publishPost(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const result = await this.blogUsecase.publishPost({ id });
    return result.success;
  }

  @Mutation(() => Boolean, { description: '取消发布文章' })
  async unpublishPost(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const result = await this.blogUsecase.unpublishPost({ id });
    return result.success;
  }

  @Mutation(() => BlogPostDTO, { description: '查看文章（增加阅读量）', nullable: true })
  async viewPost(@Args('id', { type: () => Int }) id: number): Promise<BlogPostDTO | null> {
    const post = await this.blogUsecase.viewPost({ id });
    if (!post) return null;
    const commentCount = await this.blogQueryService.getCommentCountByPost({ postId: id });
    return this.toPostDTO(post, commentCount);
  }

  @Mutation(() => Boolean, { description: '点赞文章' })
  async likePost(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.blogUsecase.likePost({ id });
    return true;
  }

  // ==================== Comment Mutations ====================

  @Mutation(() => BlogCommentDTO, { description: '创建评论' })
  async createComment(@Args('input') input: CreateBlogCommentInput): Promise<BlogCommentDTO> {
    const result = await this.blogUsecase.createComment({
      data: {
        postId: input.postId,
        parentId: input.parentId,
        nickname: input.nickname,
        email: input.email,
        avatar: input.avatar,
        content: input.content,
      },
    });
    return this.toCommentDTO(result.comment);
  }

  @Mutation(() => Boolean, { description: '点赞评论' })
  async likeComment(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.blogUsecase.likeComment({ id });
    return true;
  }

  @Mutation(() => BlogCommentDTO, { description: '更新评论状态' })
  async updateCommentStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status', { type: () => CommentStatus }) status: CommentStatus,
  ): Promise<BlogCommentDTO> {
    const comment = await this.blogUsecase.updateCommentStatus({ id, status });
    return this.toCommentDTO(comment);
  }

  @Mutation(() => Boolean, { description: '删除评论' })
  async deleteComment(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.blogUsecase.deleteComment({ id });
    return true;
  }

  // ==================== Category Mutations ====================

  @Mutation(() => BlogCategoryDTO, { description: '创建分类' })
  async createCategory(
    @Args('name') name: string,
    @Args('slug') slug: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('parentId', { type: () => Int, nullable: true }) parentId?: number,
    @Args('sortOrder', { type: () => Int, defaultValue: 0 }) sortOrder?: number,
  ): Promise<BlogCategoryDTO> {
    const category = await this.blogUsecase.createCategory({
      name,
      slug,
      description,
      parentId,
      sortOrder,
    });
    return this.toCategoryDTO(category);
  }

  @Mutation(() => BlogCategoryDTO, { description: '更新分类' })
  async updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('slug', { nullable: true }) slug?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('parentId', { type: () => Int, nullable: true }) parentId?: number,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
  ): Promise<BlogCategoryDTO> {
    const category = await this.blogUsecase.updateCategory({
      id,
      name,
      slug,
      description,
      parentId,
      sortOrder,
    });
    return this.toCategoryDTO(category);
  }

  @Mutation(() => Boolean, { description: '删除分类' })
  async deleteCategory(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.blogUsecase.deleteCategory({ id });
    return true;
  }

  // ==================== Tag Mutations ====================

  @Mutation(() => BlogTagDTO, { description: '创建标签' })
  async createTag(@Args('name') name: string, @Args('slug') slug: string): Promise<BlogTagDTO> {
    const tag = await this.blogUsecase.createTag({ name, slug });
    return this.toTagDTO(tag);
  }

  @Mutation(() => BlogTagDTO, { description: '更新标签' })
  async updateTag(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('slug', { nullable: true }) slug?: string,
  ): Promise<BlogTagDTO> {
    const tag = await this.blogUsecase.updateTag({ id, name, slug });
    return this.toTagDTO(tag);
  }

  @Mutation(() => Boolean, { description: '删除标签' })
  async deleteTag(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.blogUsecase.deleteTag({ id });
    return true;
  }

  // ==================== Link Mutations ====================

  @Mutation(() => BlogLinkDTO, { description: '创建友链' })
  async createLink(
    @Args('title') title: string,
    @Args('url') url: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('logo', { nullable: true }) logo?: string,
    @Args('sortOrder', { type: () => Int, defaultValue: 0 }) sortOrder?: number,
  ): Promise<BlogLinkDTO> {
    const link = await this.blogUsecase.createLink({
      title,
      url,
      description,
      logo,
      sortOrder,
    });
    return this.toLinkDTO(link);
  }

  @Mutation(() => BlogLinkDTO, { description: '更新友链' })
  async updateLink(
    @Args('id', { type: () => Int }) id: number,
    @Args('title', { nullable: true }) title?: string,
    @Args('url', { nullable: true }) url?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('logo', { nullable: true }) logo?: string,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
  ): Promise<BlogLinkDTO> {
    const link = await this.blogUsecase.updateLink({
      id,
      title,
      url,
      description,
      logo,
      sortOrder,
    });
    return this.toLinkDTO(link);
  }

  @Mutation(() => Boolean, { description: '删除友链' })
  async deleteLink(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.blogUsecase.deleteLink({ id });
    return true;
  }

  // ==================== DTO Converters ====================

  private toPostDTO(entity: any, commentCount?: number): BlogPostDTO {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      content: entity.content,
      summary: entity.summary,
      coverImage: entity.coverImage,
      status: entity.status as PostStatus,
      isTop: entity.isTop,
      viewCount: entity.viewCount,
      likeCount: entity.likeCount,
      commentCount: commentCount ?? null,
      categoryId: entity.categoryId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private toCategoryDTO(entity: CategoryResult): BlogCategoryDTO {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      parentId: entity.parentId,
      sortOrder: entity.sortOrder,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private toTagDTO(entity: TagResult): BlogTagDTO {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
    };
  }

  private toCommentDTO(entity: CommentResult): BlogCommentDTO {
    return {
      id: entity.id,
      postId: entity.postId,
      parentId: entity.parentId,
      nickname: entity.nickname,
      email: entity.email,
      avatar: entity.avatar,
      content: entity.content,
      status: entity.status as CommentStatus,
      likeCount: entity.likeCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private toLinkDTO(entity: LinkResult): BlogLinkDTO {
    return {
      id: entity.id,
      title: entity.title,
      url: entity.url,
      description: entity.description,
      logo: entity.logo,
      sortOrder: entity.sortOrder,
      status: entity.status as LinkStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
