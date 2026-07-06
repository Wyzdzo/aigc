// src/features/blog/infrastructure/graphql/fragments.ts
import { gql } from '@apollo/client';

/**
 * 文章基础字段片段 - 用于列表展示
 */
export const POST_BASIC_FRAGMENT = gql`
  fragment PostBasic on BlogPostDTO {
    id
    title
    slug
    summary
    coverImage
    status
    isTop
    viewCount
    likeCount
    categoryId
    createdAt
    updatedAt
  }
`;

/**
 * 文章完整字段片段 - 用于详情页
 */
export const POST_FULL_FRAGMENT = gql`
  fragment PostFull on BlogPostDTO {
    id
    title
    slug
    content
    summary
    coverImage
    status
    isTop
    viewCount
    likeCount
    categoryId
    createdAt
    updatedAt
  }
`;

/**
 * 分类基础字段片段
 */
export const CATEGORY_BASIC_FRAGMENT = gql`
  fragment CategoryBasic on BlogCategoryDTO {
    id
    name
    slug
    description
    parentId
    sortOrder
    createdAt
    updatedAt
  }
`;

/**
 * 标签基础字段片段
 */
export const TAG_BASIC_FRAGMENT = gql`
  fragment TagBasic on BlogTagDTO {
    id
    name
    slug
    createdAt
  }
`;

/**
 * 评论基础字段片段
 */
export const COMMENT_BASIC_FRAGMENT = gql`
  fragment CommentBasic on BlogCommentDTO {
    id
    postId
    parentId
    nickname
    email
    avatar
    content
    status
    likeCount
    createdAt
    updatedAt
  }
`;

/**
 * 友链基础字段片段
 */
export const LINK_BASIC_FRAGMENT = gql`
  fragment LinkBasic on BlogLinkDTO {
    id
    title
    url
    description
    logo
    status
    sortOrder
    createdAt
    updatedAt
  }
`;