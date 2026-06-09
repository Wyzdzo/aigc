// src/adapters/api/graphql/blog/dto/blog-posts.args.ts
import { PostStatus } from '@app-types/models/blog/blog.types';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class BlogPostsArgs {
  @Field(() => Int, { description: '分类ID', nullable: true })
  categoryId?: number;

  @Field(() => Int, { description: '标签ID', nullable: true })
  tagId?: number;

  @Field(() => PostStatus, { description: '文章状态', nullable: true })
  status?: PostStatus;

  @Field(() => String, { description: '搜索关键词', nullable: true })
  keyword?: string;

  @Field(() => Int, { description: '页码', nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { description: '每页数量', nullable: true, defaultValue: 10 })
  pageSize?: number;
}
