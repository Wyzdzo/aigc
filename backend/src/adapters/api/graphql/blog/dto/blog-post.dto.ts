// src/adapters/api/graphql/blog/dto/blog-post.dto.ts
import { PostStatus } from '@app-types/models/blog/blog.types';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '博客文章' })
export class BlogPostDTO {
  @Field(() => Int, { description: '文章ID' })
  id!: number;

  @Field(() => String, { description: '文章标题' })
  title!: string;

  @Field(() => String, { description: 'URL别名' })
  slug!: string;

  @Field(() => String, { description: '文章内容' })
  content!: string;

  @Field(() => String, { description: '文章摘要', nullable: true })
  summary!: string | null;

  @Field(() => String, { description: '封面图片URL', nullable: true })
  coverImage!: string | null;

  @Field(() => PostStatus, { description: '文章状态' })
  status!: PostStatus;

  @Field(() => Boolean, { description: '是否置顶' })
  isTop!: boolean;

  @Field(() => Int, { description: '阅读次数' })
  viewCount!: number;

  @Field(() => Int, { description: '点赞次数' })
  likeCount!: number;

  @Field(() => Int, { description: '分类ID', nullable: true })
  categoryId!: number | null;

  @Field(() => Date, { description: '创建时间' })
  createdAt!: Date;

  @Field(() => Date, { description: '更新时间' })
  updatedAt!: Date;
}
