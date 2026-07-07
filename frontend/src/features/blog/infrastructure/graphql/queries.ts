// src/features/blog/infrastructure/graphql/queries.ts
import { gql } from '@apollo/client';

import {
  POST_BASIC_FRAGMENT,
  POST_FULL_FRAGMENT,
  CATEGORY_BASIC_FRAGMENT,
  TAG_BASIC_FRAGMENT,
  COMMENT_BASIC_FRAGMENT,
  LINK_BASIC_FRAGMENT,
} from './fragments';

/**
 * 获取文章列表（精简字段）
 */
export const GET_POSTS = gql`
  ${POST_BASIC_FRAGMENT}
  query GetPosts($categoryId: Int, $tagId: Int, $status: PostStatus, $keyword: String, $page: Int, $pageSize: Int) {
    posts(categoryId: $categoryId, tagId: $tagId, status: $status, keyword: $keyword, page: $page, pageSize: $pageSize) {
      items {
        ...PostBasic
      }
      total
      page
      pageSize
    }
  }
`;

/**
 * 根据ID获取文章（完整字段）
 */
export const GET_POST_BY_ID = gql`
  ${POST_FULL_FRAGMENT}
  query GetPostById($id: Int!) {
    post(id: $id) {
      ...PostFull
    }
  }
`;

/**
 * 根据Slug获取文章（完整字段）
 */
export const GET_POST_BY_SLUG = gql`
  ${POST_FULL_FRAGMENT}
  query GetPostBySlug($slug: String!) {
    postBySlug(slug: $slug) {
      ...PostFull
    }
  }
`;

/**
 * 获取置顶文章（精简字段）
 */
export const GET_TOP_POSTS = gql`
  ${POST_BASIC_FRAGMENT}
  query GetTopPosts {
    topPosts {
      ...PostBasic
    }
  }
`;

/**
 * 获取相邻文章（上一篇/下一篇）
 */
export const GET_ADJACENT_POSTS = gql`
  ${POST_BASIC_FRAGMENT}
  query GetAdjacentPosts($slug: String!) {
    adjacentPosts(slug: $slug) {
      prev {
        ...PostBasic
      }
      next {
        ...PostBasic
      }
    }
  }
`;

/**
 * 获取分类列表
 */
export const GET_CATEGORIES = gql`
  ${CATEGORY_BASIC_FRAGMENT}
  query GetCategories {
    categories {
      ...CategoryBasic
    }
  }
`;

/**
 * 获取分类树（返回扁平列表，前端根据 parentId 构建树）
 */
export const GET_CATEGORY_TREE = gql`
  ${CATEGORY_BASIC_FRAGMENT}
  query GetCategoryTree {
    categoryTree {
      ...CategoryBasic
    }
  }
`;

/**
 * 获取标签列表
 */
export const GET_TAGS = gql`
  ${TAG_BASIC_FRAGMENT}
  query GetTags {
    tags {
      ...TagBasic
    }
  }
`;

/**
 * 获取文章标签
 */
export const GET_POST_TAGS = gql`
  ${TAG_BASIC_FRAGMENT}
  query GetPostTags($postId: Int!) {
    postTags(postId: $postId) {
      ...TagBasic
    }
  }
`;

/**
 * 获取评论列表
 */
export const GET_COMMENTS = gql`
  ${COMMENT_BASIC_FRAGMENT}
  query GetComments($postId: Int, $status: CommentStatus, $page: Int, $pageSize: Int) {
    comments(postId: $postId, status: $status, page: $page, pageSize: $pageSize) {
      items {
        ...CommentBasic
      }
      total
      page
      pageSize
    }
  }
`;

/**
 * 获取评论统计
 */
export const GET_COMMENT_STATS = gql`
  query GetCommentStats($postId: Int!) {
    commentStats(postId: $postId) {
      total
      pending
      approved
      rejected
    }
  }
`;

/**
 * 获取友链列表
 */
export const GET_LINKS = gql`
  ${LINK_BASIC_FRAGMENT}
  query GetLinks {
    links {
      ...LinkBasic
    }
  }
`;

/**
 * 获取活跃友链
 */
export const GET_ACTIVE_LINKS = gql`
  ${LINK_BASIC_FRAGMENT}
  query GetActiveLinks {
    activeLinks {
      ...LinkBasic
    }
  }
`;

/**
 * 获取仪表盘统计数据
 */
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    postStats {
      total
      published
      draft
      totalViewCount
      totalLikeCount
    }
    commentStats {
      total
      pending
      approved
      rejected
    }
    categoryStats {
      total
    }
    tagStats {
      total
    }
    linkStats {
      total
    }
  }
`;