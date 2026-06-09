// src/adapters/api/graphql/blog/dto/create-blog-comment.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ description: '创建评论输入' })
export class CreateBlogCommentInput {
  @Field(() => Int, { description: '文章ID' })
  postId!: number;

  @Field(() => Int, { description: '父评论ID', nullable: true })
  parentId?: number | null;

  @Field(() => String, { description: '昵称' })
  nickname!: string;

  @Field(() => String, { description: '邮箱', nullable: true })
  email?: string | null;

  @Field(() => String, { description: '头像URL', nullable: true })
  avatar?: string | null;

  @Field(() => String, { description: '评论内容' })
  content!: string;
}
