// src/features/blog/infrastructure/mock/mock.ts
import type { BlogPost, BlogCategory, BlogTag, BlogComment, BlogLink } from '@/entities/blog';
import { CommentStatus, LinkStatus, PostStatus } from '@/entities/blog';

/**
 * Mock 文章数据
 */
export const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: 'React 18 新特性详解',
    slug: 'react-18-new-features',
    content: '# React 18 新特性详解\n\nReact 18 带来了许多令人兴奋的新特性...',
    summary: 'React 18 带来了并发渲染、自动批处理、Suspense 改进等重要特性。',
    coverImage: 'https://via.placeholder.com/800x400',
    status: PostStatus.PUBLISHED,
    isTop: true,
    viewCount: 1234,
    likeCount: 56,
    categoryId: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    content: '# TypeScript 高级类型技巧\n\nTypeScript 的类型系统非常强大...',
    summary: '深入探讨 TypeScript 的高级类型，包括条件类型、映射类型等。',
    coverImage: 'https://via.placeholder.com/800x400',
    status: PostStatus.PUBLISHED,
    isTop: false,
    viewCount: 876,
    likeCount: 34,
    categoryId: 1,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 3,
    title: 'Next.js 14 全栈开发指南',
    slug: 'nextjs-14-fullstack-guide',
    content: '# Next.js 14 全栈开发指南\n\nNext.js 14 是一个重要的版本更新...',
    summary: '全面介绍 Next.js 14 的新特性和全栈开发最佳实践。',
    coverImage: 'https://via.placeholder.com/800x400',
    status: PostStatus.PUBLISHED,
    isTop: false,
    viewCount: 2345,
    likeCount: 89,
    categoryId: 2,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: 4,
    title: 'GraphQL 最佳实践',
    slug: 'graphql-best-practices',
    content: '# GraphQL 最佳实践\n\nGraphQL 是一个强大的查询语言...',
    summary: '分享 GraphQL 在实际项目中的最佳实践和常见陷阱。',
    coverImage: 'https://via.placeholder.com/800x400',
    status: PostStatus.PUBLISHED,
    isTop: false,
    viewCount: 654,
    likeCount: 21,
    categoryId: 2,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: 5,
    title: 'Docker 容器化部署实战',
    slug: 'docker-containerization-deployment',
    content: '# Docker 容器化部署实战\n\nDocker 已经成为现代应用部署的标准...',
    summary: '从零开始学习 Docker，掌握容器化部署的核心技能。',
    coverImage: 'https://via.placeholder.com/800x400',
    status: PostStatus.PUBLISHED,
    isTop: false,
    viewCount: 1876,
    likeCount: 67,
    categoryId: 3,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

/**
 * Mock 分类数据
 */
export const mockCategories: BlogCategory[] = [
  {
    id: 1,
    name: '前端开发',
    slug: 'frontend',
    description: '前端开发相关技术文章',
    parentId: null,
    sortOrder: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: '后端开发',
    slug: 'backend',
    description: '后端开发相关技术文章',
    parentId: null,
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 3,
    name: '运维部署',
    slug: 'devops',
    description: '运维部署相关技术文章',
    parentId: null,
    sortOrder: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 4,
    name: 'React',
    slug: 'react',
    description: 'React 框架相关',
    parentId: 1,
    sortOrder: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 5,
    name: 'Vue',
    slug: 'vue',
    description: 'Vue 框架相关',
    parentId: 1,
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

/**
 * Mock 标签数据
 */
export const mockTags: BlogTag[] = [
  {
    id: 1,
    name: 'React',
    slug: 'react',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: 'TypeScript',
    slug: 'typescript',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 3,
    name: 'Next.js',
    slug: 'nextjs',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 4,
    name: 'GraphQL',
    slug: 'graphql',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 5,
    name: 'Docker',
    slug: 'docker',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 6,
    name: 'Node.js',
    slug: 'nodejs',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 7,
    name: 'Vue',
    slug: 'vue',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 8,
    name: '性能优化',
    slug: 'performance',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 9,
    name: '最佳实践',
    slug: 'best-practices',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 10,
    name: '教程',
    slug: 'tutorial',
    createdAt: new Date('2024-01-01'),
  },
];

/**
 * Mock 评论数据
 */
export const mockComments: BlogComment[] = [
  {
    id: 1,
    postId: 1,
    parentId: null,
    nickname: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://ui-avatars.com/api/?name=张三&background=random',
    content: '文章写得很棒，学到了很多！',
    status: CommentStatus.APPROVED,
    likeCount: 12,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 2,
    postId: 1,
    parentId: 1,
    nickname: '李四',
    email: 'lisi@example.com',
    avatar: 'https://ui-avatars.com/api/?name=李四&background=random',
    content: '同意楼上的观点，React 18 的并发渲染确实很强大。',
    status: CommentStatus.APPROVED,
    likeCount: 5,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 3,
    postId: 1,
    parentId: null,
    nickname: '王五',
    email: 'wangwu@example.com',
    avatar: 'https://ui-avatars.com/api/?name=王五&background=random',
    content: '期待更多关于 React 的文章！',
    status: CommentStatus.APPROVED,
    likeCount: 8,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 4,
    postId: 2,
    parentId: null,
    nickname: '赵六',
    email: 'zhaoliu@example.com',
    avatar: 'https://ui-avatars.com/api/?name=赵六&background=random',
    content: 'TypeScript 的类型系统确实很强大，但学习曲线有点陡。',
    status: CommentStatus.APPROVED,
    likeCount: 3,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
];

/**
 * Mock 友链数据
 */
export const mockLinks: BlogLink[] = [
  {
    id: 1,
    title: 'React 官方文档',
    url: 'https://react.dev',
    description: 'React 官方文档，学习 React 的最佳资源',
    logo: 'https://via.placeholder.com/64',
    status: LinkStatus.ACTIVE,
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    title: 'Vue 官方文档',
    url: 'https://vuejs.org',
    description: 'Vue 官方文档，渐进式 JavaScript 框架',
    logo: 'https://via.placeholder.com/64',
    status: LinkStatus.ACTIVE,
    sortOrder: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 3,
    title: 'Next.js 官方文档',
    url: 'https://nextjs.org',
    description: 'Next.js 官方文档，React 全栈框架',
    logo: 'https://via.placeholder.com/64',
    status: LinkStatus.ACTIVE,
    sortOrder: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 4,
    title: 'TypeScript 官方文档',
    url: 'https://www.typescriptlang.org',
    description: 'TypeScript 官方文档，JavaScript 的超集',
    logo: 'https://via.placeholder.com/64',
    status: LinkStatus.ACTIVE,
    sortOrder: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 5,
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'MDN Web 文档，Web 开发者的权威资源',
    logo: 'https://via.placeholder.com/64',
    status: LinkStatus.ACTIVE,
    sortOrder: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

/**
 * Mock 文章标签关联
 */
export const mockPostTags: Record<number, number[]> = {
  1: [1, 2, 8],
  2: [2, 8, 9],
  3: [3, 6, 9],
  4: [4, 9],
  5: [5, 9],
};