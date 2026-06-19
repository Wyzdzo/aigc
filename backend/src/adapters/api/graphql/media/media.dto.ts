// src/adapters/api/graphql/media/media.dto.ts

import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('MediaItem')
export class MediaItemDTO {
  @Field(() => Int, { description: '媒体文件ID' })
  id!: number;

  @Field(() => String, { description: '存储文件名' })
  filename!: string;

  @Field(() => String, { description: '原始文件名' })
  originalName!: string;

  @Field(() => String, { description: 'MIME类型' })
  mimeType!: string;

  @Field(() => Int, { description: '文件大小（字节）' })
  size!: number;

  @Field(() => String, { description: '访问URL' })
  url!: string;

  @Field(() => Int, { description: '图片宽度' })
  width!: number;

  @Field(() => Int, { description: '图片高度' })
  height!: number;

  @Field(() => Date, { description: '创建时间' })
  createdAt!: Date;

  @Field(() => Date, { description: '更新时间' })
  updatedAt!: Date;
}

@ObjectType('MediaListResult')
export class MediaListResultDTO {
  @Field(() => [MediaItemDTO], { description: '媒体文件列表' })
  items!: MediaItemDTO[];

  @Field(() => Int, { description: '总数' })
  total!: number;

  @Field(() => Int, { description: '当前页码' })
  page!: number;

  @Field(() => Int, { description: '每页数量' })
  pageSize!: number;
}
