// src/adapters/api/graphql/blog/dto/blog-link.dto.ts
import { LinkStatus } from '@app-types/models/blog/blog.types';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '博客友链' })
export class BlogLinkDTO {
  @Field(() => Int, { description: '友链ID' })
  id!: number;

  @Field(() => String, { description: '友链标题' })
  title!: string;

  @Field(() => String, { description: '友链URL' })
  url!: string;

  @Field(() => String, { description: '友链描述', nullable: true })
  description!: string | null;

  @Field(() => String, { description: 'Logo URL', nullable: true })
  logo!: string | null;

  @Field(() => Int, { description: '排序序号' })
  sortOrder!: number;

  @Field(() => LinkStatus, { description: '状态' })
  status!: LinkStatus;

  @Field(() => Date, { description: '创建时间' })
  createdAt!: Date;

  @Field(() => Date, { description: '更新时间' })
  updatedAt!: Date;
}
