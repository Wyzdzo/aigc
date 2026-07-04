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
    publishPost(id: $id)
  }
`;

/**
 * 取消发布文章
 */
export const UNPUBLISH_POST = gql`
  mutation UnpublishPost($id: Int!) {
    unpublishPost(id: $id)
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
    likePost(id: $id)
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
    likeComment(id: $id)
  }
`;

/**
 * 创建分类
 */
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $slug: String!, $description: String, $parentId: Int, $sortOrder: Int) {
    createCategory(name: $name, slug: $slug, description: $description, parentId: $parentId, sortOrder: $sortOrder) {
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
 * 更新分类
 */
export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $name: String, $slug: String, $description: String, $parentId: Int, $sortOrder: Int) {
    updateCategory(id: $id, name: $name, slug: $slug, description: $description, parentId: $parentId, sortOrder: $sortOrder) {
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
  mutation CreateTag($name: String!, $slug: String!) {
    createTag(name: $name, slug: $slug) {
      id
      name
      slug
      createdAt
    }
  }
`;

/**
 * 更新标签
 */
export const UPDATE_TAG = gql`
  mutation UpdateTag($id: Int!, $name: String, $slug: String) {
    updateTag(id: $id, name: $name, slug: $slug) {
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
 * 更新评论状态
 */
export const UPDATE_COMMENT_STATUS = gql`
  mutation UpdateCommentStatus($id: Int!, $status: CommentStatus!) {
    updateCommentStatus(id: $id, status: $status) {
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
 * 删除评论
 */
export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id)
  }
`;

/**
 * 创建友链
 */
export const CREATE_LINK = gql`
  mutation CreateLink($title: String!, $url: String!, $description: String, $logo: String, $sortOrder: Int) {
    createLink(title: $title, url: $url, description: $description, logo: $logo, sortOrder: $sortOrder) {
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
 * 更新友链
 */
export const UPDATE_LINK = gql`
  mutation UpdateLink($id: Int!, $title: String, $url: String, $description: String, $logo: String, $sortOrder: Int) {
    updateLink(id: $id, title: $title, url: $url, description: $description, logo: $logo, sortOrder: $sortOrder) {
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