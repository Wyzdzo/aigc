// src/adapters/api/graphql/blog/dto/blog-tag.dto.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '博客标签' })
export class BlogTagDTO {
  @Field(() => Int, { description: '标签ID' })
  id!: number;

  @Field(() => String, { description: '标签名称' })
  name!: string;

  @Field(() => String, { description: 'URL别名' })
  slug!: string;

  @Field(() => Date, { description: '创建时间' })
  createdAt!: Date;
}
