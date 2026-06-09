// src/adapters/api/graphql/blog/dto/blog-posts.result.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlogPostDTO } from './blog-post.dto';

@ObjectType({ description: '文章列表结果' })
export class BlogPostsResult {
  @Field(() => [BlogPostDTO], { description: '文章列表' })
  items!: BlogPostDTO[];

  @Field(() => Int, { description: '总数量' })
  total!: number;

  @Field(() => Int, { description: '当前页码' })
  page!: number;

  @Field(() => Int, { description: '每页数量' })
  pageSize!: number;
}
