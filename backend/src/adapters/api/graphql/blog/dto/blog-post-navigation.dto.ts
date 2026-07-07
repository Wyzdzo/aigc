// src/adapters/api/graphql/blog/dto/blog-post-navigation.dto.ts
import { Field, ObjectType } from '@nestjs/graphql';

import { BlogPostDTO } from './blog-post.dto';

@ObjectType({ description: '文章导航（上一篇/下一篇）' })
export class BlogPostNavigationDTO {
  @Field(() => BlogPostDTO, { description: '上一篇', nullable: true })
  prev!: BlogPostDTO | null;

  @Field(() => BlogPostDTO, { description: '下一篇', nullable: true })
  next!: BlogPostDTO | null;
}
