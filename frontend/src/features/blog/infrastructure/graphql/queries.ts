// src/features/blog/infrastructure/graphql/queries.ts
import { gql } from '@apollo/client';

/**
 * 获取文章列表
 */
export const GET_POSTS = gql`
  query GetPosts($categoryId: Int, $tagId: Int, $status: PostStatus, $keyword: String, $page: Int, $pageSize: Int) {
    posts(categoryId: $categoryId, tagId: $tagId, status: $status, keyword: $keyword, page: $page, pageSize: $pageSize) {
      items {
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
      total
      page
      pageSize
    }
  }
`;

/**
 * 根据ID获取文章
 */
export const GET_POST_BY_ID = gql`
  query GetPostById($id: Int!) {
    post(id: $id) {
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
  }
`;

/**
 * 根据Slug获取文章
 */
export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    postBySlug(slug: $slug) {
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
  }
`;

/**
 * 获取置顶文章
 */
export const GET_TOP_POSTS = gql`
  query GetTopPosts {
    topPosts {
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
  }
`;

/**
 * 获取分类列表
 */
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
      parentId
      sortOrder
      createdAt
      updatedAt
    }
  }
`;

/**
 * 获取分类树
 */
export const GET_CATEGORY_TREE = gql`
  query GetCategoryTree {
    categoryTree {
      id
      name
      slug
      description
      parentId
      sortOrder
      createdAt
      updatedAt
      children {
        id
        name
        slug
        description
        parentId
        sortOrder
        createdAt
        updatedAt
        children {
          id
          name
          slug
          description
          parentId
          sortOrder
          createdAt
          updatedAt
        }
      }
    }
  }
`;

/**
 * 获取标签列表
 */
export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
      slug
      createdAt
    }
  }
`;

/**
 * 获取文章标签
 */
export const GET_POST_TAGS = gql`
  query GetPostTags($postId: Int!) {
    postTags(postId: $postId) {
      id
      name
      slug
      createdAt
    }
  }
`;

/**
 * 获取评论列表
 */
export const GET_COMMENTS = gql`
  query GetComments($postId: Int!, $status: CommentStatus, $page: Int, $pageSize: Int) {
    comments(postId: $postId, status: $status, page: $page, pageSize: $pageSize) {
      items {
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
  query GetLinks {
    links {
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
  }
`;

/**
 * 获取活跃友链
 */
export const GET_ACTIVE_LINKS = gql`
  query GetActiveLinks {
    activeLinks {
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
  }
`;