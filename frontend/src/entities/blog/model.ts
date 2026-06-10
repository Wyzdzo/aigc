// src/entities/blog/model.ts

/**
 * 博客文章状态
 */
export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

/**
 * 博客文章实体
 */
export interface BlogPost {
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
}

/**
 * 博客分类实体
 */
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 博客标签实体
 */
export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
}

/**
 * 博客评论状态
 */
export enum CommentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

/**
 * 博客评论实体
 */
export interface BlogComment {
  id: number;
  postId: number;
  parentId: number | null;
  nickname: string;
  email: string;
  avatar: string | null;
  content: string;
  status: CommentStatus;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 友链状态
 */
export enum LinkStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * 友链实体
 */
export interface BlogLink {
  id: number;
  title: string;
  url: string;
  description: string | null;
  logo: string | null;
  status: LinkStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 文章查询参数
 */
export interface BlogPostQueryParams extends PaginationParams {
  categoryId?: number;
  tagId?: number;
  status?: PostStatus;
  keyword?: string;
}

/**
 * 创建文章输入
 */
export interface CreateBlogPostInput {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  coverImage?: string;
  status?: PostStatus;
  isTop?: boolean;
  categoryId?: number;
  tagIds?: number[];
}

/**
 * 更新文章输入
 */
export interface UpdateBlogPostInput {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string;
  coverImage?: string;
  status?: PostStatus;
  isTop?: boolean;
  categoryId?: number;
  tagIds?: number[];
}

/**
 * 创建评论输入
 */
export interface CreateCommentInput {
  postId: number;
  parentId?: number;
  nickname: string;
  email: string;
  content: string;
}