// src/adapters/api/graphql/settings/settings.resolver.ts

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '@src/adapters/api/graphql/guards/jwt-auth.guard';
import { currentUser } from '@src/adapters/api/graphql/decorators/current-user.decorator';
import { JwtPayload } from '@app-types/jwt.types';
import { SettingsUsecase } from '@src/usecases/settings/settings.usecase';
import {
  SettingsResultGql,
  UpdateSiteSettingsInput,
  UpdateBloggerInfoInput,
  UpdatePasswordInput,
} from './settings.dto';

@Resolver()
export class SettingsResolver {
  constructor(private readonly settingsUsecase: SettingsUsecase) {}

  @Query(() => SettingsResultGql)
  @UseGuards(JwtAuthGuard)
  async settings(@currentUser() user: JwtPayload): Promise<SettingsResultGql> {
    const settings = await this.settingsUsecase.getSettings();
    const bloggerInfo = await this.settingsUsecase.getBloggerInfo(user.sub);

    return {
      siteSettings: settings.siteSettings.map((s) => ({
        key: s.key,
        value: s.value,
        displayName: s.displayName,
        groupName: s.groupName,
      })),
      bloggerInfo: bloggerInfo
        ? {
            nickname: bloggerInfo.nickname,
            avatar: bloggerInfo.avatar,
            bio: bloggerInfo.bio,
          }
        : null,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async updateSiteSettings(@Args('input') input: UpdateSiteSettingsInput): Promise<boolean> {
    await this.settingsUsecase.updateSiteSettings({
      siteName: input.siteName,
      siteDescription: input.siteDescription,
      siteKeywords: input.siteKeywords,
      bloggerName: input.bloggerName,
      bloggerBio: input.bloggerBio,
      bloggerAvatar: input.bloggerAvatar,
      perPage: input.perPage,
      allowComment: input.allowComment,
    });
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async updateBloggerInfo(
    @currentUser() user: JwtPayload,
    @Args('input') input: UpdateBloggerInfoInput,
  ): Promise<boolean> {
    await this.settingsUsecase.updateBloggerInfo({
      accountId: user.sub,
      nickname: input.nickname,
      bio: input.bio,
      avatar: input.avatar,
    });
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @currentUser() user: JwtPayload,
    @Args('input') input: UpdatePasswordInput,
  ): Promise<boolean> {
    await this.settingsUsecase.updatePassword({
      accountId: user.sub,
      oldPassword: input.oldPassword,
      newPassword: input.newPassword,
    });
    return true;
  }
}
