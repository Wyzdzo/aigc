// src/adapters/api/graphql/settings/settings.dto.ts

import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SiteSettingGql {
  @Field()
  key!: string;

  @Field({ nullable: true })
  value!: string | null;

  @Field({ nullable: true })
  displayName!: string | null;

  @Field()
  groupName!: string;
}

@ObjectType()
export class SettingsResultGql {
  @Field(() => [SiteSettingGql])
  siteSettings!: SiteSettingGql[];

  @Field(() => BloggerInfoGql, { nullable: true })
  bloggerInfo!: BloggerInfoGql | null;
}

@ObjectType()
export class BloggerInfoGql {
  @Field({ nullable: true })
  nickname!: string | null;

  @Field({ nullable: true })
  avatar!: string | null;

  @Field({ nullable: true })
  bio!: string | null;
}

@InputType()
export class UpdateSiteSettingsInput {
  @Field({ nullable: true })
  siteName?: string;

  @Field({ nullable: true })
  siteDescription?: string;

  @Field({ nullable: true })
  siteKeywords?: string;

  @Field({ nullable: true })
  bloggerName?: string;

  @Field({ nullable: true })
  bloggerBio?: string;

  @Field({ nullable: true })
  bloggerAvatar?: string;

  @Field({ nullable: true })
  perPage?: number;

  @Field({ nullable: true })
  allowComment?: boolean;
}

@InputType()
export class UpdateBloggerInfoInput {
  @Field()
  nickname!: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  avatar?: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field()
  oldPassword!: string;

  @Field()
  newPassword!: string;
}
