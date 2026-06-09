// src/adapters/api/graphql/blog/dto/create-blog-post.input.ts
import { PostStatus } from '@app-types/models/blog/blog.types';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ description: '创建文章输入' })
export class CreateBlogPostInput {
  @Field(() => String, { description: '文章标题' })
  title!: string;

  @Field(() => String, { description: 'URL别名' })
  slug!: string;

  @Field(() => String, { description: '文章内容' })
  content!: string;

  @Field(() => String, { description: '文章摘要', nullable: true })
  summary?: string | null;

  @Field(() => String, { description: '封面图片URL', nullable: true })
  coverImage?: string | null;

  @Field(() => PostStatus, { description: '文章状态', nullable: true })
  status?: PostStatus;

  @Field(() => Boolean, { description: '是否置顶', nullable: true })
  isTop?: boolean;

  @Field(() => Int, { description: '分类ID', nullable: true })
  categoryId?: number | null;

  @Field(() => [Int], { description: '标签ID列表', nullable: true })
  tagIds?: number[];
}
