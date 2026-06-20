// src/adapters/api/graphql/seo/sitemap.dto.ts

import { Field, ObjectType } from '@nestjs/graphql';
import { ChangeFreq } from '@app-types/common/seo.types';

/**
 * Sitemap URL 条目
 */
@ObjectType()
export class SitemapUrl {
  @Field()
  loc!: string;

  @Field({ nullable: true })
  lastmod?: string;

  @Field(() => ChangeFreq)
  changefreq!: ChangeFreq;

  @Field(() => Number)
  priority!: number;
}

/**
 * Sitemap 根信息
 */
@ObjectType()
export class SitemapIndex {
  @Field(() => String)
  baseUrl!: string;

  @Field(() => Date)
  generatedAt!: Date;
}

/**
 * 完整的 Sitemap 数据
 */
@ObjectType()
export class SitemapData {
  @Field(() => SitemapIndex)
  info!: SitemapIndex;

  @Field(() => [SitemapUrl])
  staticPages!: SitemapUrl[];

  @Field(() => [SitemapUrl])
  blogPosts!: SitemapUrl[];

  @Field(() => [SitemapUrl])
  categories!: SitemapUrl[];

  @Field(() => [SitemapUrl])
  tags!: SitemapUrl[];
}
