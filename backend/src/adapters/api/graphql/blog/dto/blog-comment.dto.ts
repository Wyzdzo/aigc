// src/adapters/api/graphql/blog/dto/blog-comment.dto.ts
import { CommentStatus } from '@app-types/models/blog/blog.types';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '博客评论' })
export class BlogCommentDTO {
  @Field(() => Int, { description: '评论ID' })
  id!: number;

  @Field(() => Int, { description: '文章ID' })
  postId!: number;

  @Field(() => Int, { description: '父评论ID', nullable: true })
  parentId!: number | null;

  @Field(() => String, { description: '昵称' })
  nickname!: string;

  @Field(() => String, { description: '邮箱', nullable: true })
  email!: string | null;

  @Field(() => String, { description: '头像URL', nullable: true })
  avatar!: string | null;

  @Field(() => String, { description: '评论内容' })
  content!: string;

  @Field(() => CommentStatus, { description: '评论状态' })
  status!: CommentStatus;

  @Field(() => Int, { description: '点赞次数' })
  likeCount!: number;

  @Field(() => Date, { description: '创建时间' })
  createdAt!: Date;
}
