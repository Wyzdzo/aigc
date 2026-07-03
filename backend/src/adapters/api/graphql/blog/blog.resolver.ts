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
import { BlogService } from '@src/modules/blog/blog.service';
import { BlogQueryService } from '@src/modules/blog/queries/blog.query.service';
import { BlogUsecase } from '@src/usecases/blog/blog.usecase';
import { PostStatus, CommentStatus, LinkStatus } from '@app-types/models/blog/blog.types';

type OrderByType = 'createdAt' | 'viewCount' | 'likeCount';
type OrderDirectionType = 'ASC' | 'DESC';

@Resolver(() => BlogPostDTO)
export class BlogResolver {
  constructor(
    private readonly blogService: BlogService,
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

    return {
      items: result.items.map(this.toPostDTO),
      total: result.total,
      page: args.page ?? 1,
      pageSize: args.pageSize ?? 10,
    };
  }

  @Query(() => BlogPostDTO, { description: '根据 ID 查询文章', nullable: true })
  async post(@Args('id', { type: () => Int }) id: number): Promise<BlogPostDTO | null> {
    const post = await this.blogQueryService.getPostById({ id });
    return post ? this.toPostDTO(post) : null;
  }

  @Query(() => BlogPostDTO, { description: '根据 slug 查询文章', nullable: true })
  async postBySlug(@Args('slug') slug: string): Promise<BlogPostDTO | null> {
    const post = await this.blogQueryService.getPostBySlug({ slug });
    return post ? this.toPostDTO(post) : null;
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

  // ==================== Comment Queries ====================

  @Query(() => [BlogCommentDTO], { description: '查询评论列表' })
  async comments(
    @Args('postId', { type: () => Int, nullable: true }) postId?: number,
    @Args('page', { type: () => Int, defaultValue: 1 }) page?: number,
    @Args('pageSize', { type: () => Int, defaultValue: 20 }) pageSize?: number,
  ): Promise<BlogCommentDTO[]> {
    const result = await this.blogQueryService.getComments({
      options: {
        postId,
        page,
        pageSize,
        status: CommentStatus.APPROVED,
      },
    });
    return result.items.map(this.toCommentDTO);
  }

  // ==================== Link Queries ====================

  @Query(() => [BlogLinkDTO], { description: '查询所有友链' })
  async links(): Promise<BlogLinkDTO[]> {
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
    return this.toPostDTO(result.post);
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
    return post ? this.toPostDTO(post) : null;
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
    return post ? this.toPostDTO(post) : null;
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

  // ==================== Category Mutations ====================

  @Mutation(() => BlogCategoryDTO, { description: '创建分类' })
  async createCategory(
    @Args('name') name: string,
    @Args('slug') slug: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('parentId', { type: () => Int, nullable: true }) parentId?: number,
    @Args('sortOrder', { type: () => Int, defaultValue: 0 }) sortOrder?: number,
  ): Promise<BlogCategoryDTO> {
    const category = await this.blogService.createCategory({
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
    await this.blogService.deleteCategory({ id });
    return true;
  }

  // ==================== Tag Mutations ====================

  @Mutation(() => BlogTagDTO, { description: '创建标签' })
  async createTag(@Args('name') name: string, @Args('slug') slug: string): Promise<BlogTagDTO> {
    const tag = await this.blogService.createTag({ name, slug });
    return this.toTagDTO(tag);
  }

  @Mutation(() => Boolean, { description: '删除标签' })
  async deleteTag(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.blogService.deleteTag({ id });
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
    const link = await this.blogService.createLink({
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
    await this.blogService.deleteLink({ id });
    return true;
  }

  // ==================== DTO Converters ====================

  private toPostDTO(entity: any): BlogPostDTO {
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
      categoryId: entity.categoryId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private toCategoryDTO(entity: any): BlogCategoryDTO {
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

  private toTagDTO(entity: any): BlogTagDTO {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
    };
  }

  private toCommentDTO(entity: any): BlogCommentDTO {
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
    };
  }

  private toLinkDTO(entity: any): BlogLinkDTO {
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
