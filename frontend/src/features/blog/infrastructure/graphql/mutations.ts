// src/features/blog/infrastructure/graphql/mutations.ts
import { gql } from '@apollo/client';

/**
 * 创建文章
 */
export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
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
 * 更新文章
 */
export const UPDATE_POST = gql`
  mutation UpdatePost($id: Int!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
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
 * 删除文章
 */
export const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`;

/**
 * 发布文章
 */
export const PUBLISH_POST = gql`
  mutation PublishPost($id: Int!) {
    publishPost(id: $id) {
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
 * 取消发布文章
 */
export const UNPUBLISH_POST = gql`
  mutation UnpublishPost($id: Int!) {
    unpublishPost(id: $id) {
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
 * 查看文章（递增阅读量）
 */
export const VIEW_POST = gql`
  mutation ViewPost($id: Int!) {
    viewPost(id: $id) {
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
 * 点赞文章
 */
export const LIKE_POST = gql`
  mutation LikePost($id: Int!) {
    likePost(id: $id) {
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
 * 创建评论
 */
export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
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
  }
`;

/**
 * 点赞评论
 */
export const LIKE_COMMENT = gql`
  mutation LikeComment($id: Int!) {
    likeComment(id: $id) {
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
  }
`;

/**
 * 创建分类
 */
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
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
 * 删除分类
 */
export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id)
  }
`;

/**
 * 创建标签
 */
export const CREATE_TAG = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      id
      name
      slug
      createdAt
    }
  }
`;

/**
 * 删除标签
 */
export const DELETE_TAG = gql`
  mutation DeleteTag($id: Int!) {
    deleteTag(id: $id)
  }
`;

/**
 * 创建友链
 */
export const CREATE_LINK = gql`
  mutation CreateLink($input: CreateLinkInput!) {
    createLink(input: $input) {
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
 * 删除友链
 */
export const DELETE_LINK = gql`
  mutation DeleteLink($id: Int!) {
    deleteLink(id: $id)
  }
`;