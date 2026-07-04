import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlogCommentDTO } from './blog-comment.dto';

@ObjectType({ description: '评论列表结果' })
export class BlogCommentsResult {
  @Field(() => [BlogCommentDTO], { description: '评论列表' })
  items!: BlogCommentDTO[];

  @Field(() => Int, { description: '总数量' })
  total!: number;

  @Field(() => Int, { description: '当前页码' })
  page!: number;

  @Field(() => Int, { description: '每页数量' })
  pageSize!: number;
}
