// src/adapters/api/graphql/blog/dto/blog-category.dto.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '博客分类' })
export class BlogCategoryDTO {
  @Field(() => Int, { description: '分类ID' })
  id!: number;

  @Field(() => String, { description: '分类名称' })
  name!: string;

  @Field(() => String, { description: 'URL别名' })
  slug!: string;

  @Field(() => String, { description: '分类描述', nullable: true })
  description!: string | null;

  @Field(() => Int, { description: '父分类ID', nullable: true })
  parentId!: number | null;

  @Field(() => Int, { description: '排序序号' })
  sortOrder!: number;

  @Field(() => Date, { description: '创建时间' })
  createdAt!: Date;

  @Field(() => Date, { description: '更新时间' })
  updatedAt!: Date;
}
