// src/types/models/blog/blog.types.ts

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum CommentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
}

export enum LinkStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface BlogCategoryModel {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogTagModel {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface BlogPostModel {
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
  deletedAt: Date | null;
}

export interface BlogPostTagModel {
  postId: number;
  tagId: number;
}

export interface BlogCommentModel {
  id: number;
  postId: number;
  parentId: number | null;
  nickname: string;
  email: string | null;
  avatar: string | null;
  content: string;
  status: CommentStatus;
  likeCount: number;
  createdAt: Date;
}

export interface BlogLinkModel {
  id: number;
  title: string;
  url: string;
  description: string | null;
  logo: string | null;
  sortOrder: number;
  status: LinkStatus;
  createdAt: Date;
  updatedAt: Date;
}
