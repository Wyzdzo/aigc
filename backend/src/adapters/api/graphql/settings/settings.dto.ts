// src/adapters/api/graphql/settings/settings.dto.ts

import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SiteSettingGql {
  @Field(() => String)
  key!: string;

  @Field(() => String, { nullable: true })
  value!: string | null;

  @Field(() => String, { nullable: true })
  displayName!: string | null;

  @Field(() => String)
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
  @Field(() => String, { nullable: true })
  nickname!: string | null;

  @Field(() => String, { nullable: true })
  avatar!: string | null;

  @Field(() => String, { nullable: true })
  bio!: string | null;
}

@ObjectType()
export class PublicSettingsGql {
  @Field(() => String, { nullable: true })
  announcement!: string | null;
}

@InputType()
export class UpdateSiteSettingsInput {
  @Field(() => String, { nullable: true })
  siteName?: string;

  @Field(() => String, { nullable: true })
  siteDescription?: string;

  @Field(() => String, { nullable: true })
  siteKeywords?: string;

  @Field(() => String, { nullable: true })
  bloggerName?: string;

  @Field(() => String, { nullable: true })
  bloggerBio?: string;

  @Field(() => String, { nullable: true })
  bloggerAvatar?: string;

  @Field(() => Number, { nullable: true })
  perPage?: number;

  @Field(() => Boolean, { nullable: true })
  allowComment?: boolean;

  @Field(() => String, { nullable: true })
  announcement?: string;
}

@InputType()
export class UpdateBloggerInfoInput {
  @Field(() => String)
  nickname!: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field(() => String)
  oldPassword!: string;

  @Field(() => String)
  newPassword!: string;
}
