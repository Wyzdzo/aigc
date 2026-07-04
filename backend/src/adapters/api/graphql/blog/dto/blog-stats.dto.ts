import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '文章统计' })
export class PostStatsDTO {
  @Field(() => Int, { description: '文章总数' })
  total!: number;

  @Field(() => Int, { description: '已发布数' })
  published!: number;

  @Field(() => Int, { description: '草稿数' })
  draft!: number;
}

@ObjectType({ description: '评论统计' })
export class CommentStatsDTO {
  @Field(() => Int, { description: '评论总数' })
  total!: number;

  @Field(() => Int, { description: '待审核数' })
  pending!: number;

  @Field(() => Int, { description: '已通过数' })
  approved!: number;

  @Field(() => Int, { description: '已拒绝数' })
  rejected!: number;
}

@ObjectType({ description: '分类统计' })
export class CategoryStatsDTO {
  @Field(() => Int, { description: '分类总数' })
  total!: number;
}

@ObjectType({ description: '标签统计' })
export class TagStatsDTO {
  @Field(() => Int, { description: '标签总数' })
  total!: number;
}

@ObjectType({ description: '友链统计' })
export class LinkStatsDTO {
  @Field(() => Int, { description: '友链总数' })
  total!: number;
}
