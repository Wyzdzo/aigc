// src/adapters/api/graphql/settings/settings.resolver.ts

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '@src/adapters/api/graphql/guards/jwt-auth.guard';
import { currentUser } from '@src/adapters/api/graphql/decorators/current-user.decorator';
import { JwtPayload } from '@app-types/jwt.types';
import { SettingsUsecase } from '@src/usecases/settings/settings.usecase';
import { SettingsService } from '@modules/settings/settings.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '@modules/account/base/entities/account.entity';
import { UserInfoEntity } from '@modules/account/base/entities/user-info.entity';
import {
  SettingsResultGql,
  UpdateSiteSettingsInput,
  UpdateBloggerInfoInput,
  UpdatePasswordInput,
} from './settings.dto';
import * as crypto from 'crypto';

@Resolver()
export class SettingsResolver {
  constructor(
    private readonly settingsUsecase: SettingsUsecase,
    private readonly settingsService: SettingsService,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
  ) {}

  @Query(() => SettingsResultGql)
  @UseGuards(JwtAuthGuard)
  async settings(@currentUser() user: JwtPayload): Promise<SettingsResultGql> {
    const settings = await this.settingsUsecase.getSettings();
    const userInfo = await this.userInfoRepository.findOne({ where: { accountId: user.sub } });

    return {
      siteSettings: settings.siteSettings.map((s) => ({
        key: s.key,
        value: s.value,
        displayName: s.displayName,
        groupName: s.groupName,
      })),
      bloggerInfo: userInfo
        ? {
            nickname: userInfo.nickname,
            avatar: userInfo.avatarUrl,
            bio: userInfo.signature,
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
  async updateBloggerInfo(@Args('input') input: UpdateBloggerInfoInput): Promise<boolean> {
    let userInfo = await this.userInfoRepository.findOne({ where: { accountId: 1 } });

    if (!userInfo) {
      const account = await this.accountRepository.findOne({ where: { id: 1 } });
      if (!account) {
        throw new Error('No account found');
      }

      userInfo = this.userInfoRepository.create({
        accountId: account.id,
        nickname: input.nickname,
        signature: input.bio || null,
        avatarUrl: input.avatar || null,
      });
      await this.userInfoRepository.save(userInfo);
    } else {
      await this.userInfoRepository.update(userInfo.id, {
        nickname: input.nickname,
        signature: input.bio || userInfo.signature,
        avatarUrl: input.avatar || userInfo.avatarUrl,
      });
    }
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @currentUser() user: JwtPayload,
    @Args('input') input: UpdatePasswordInput,
  ): Promise<boolean> {
    const account = await this.accountRepository.findOne({ where: { id: user.sub } });
    if (!account) {
      throw new Error('Account not found');
    }

    // 验证旧密码
    const oldPasswordHash = crypto.createHash('sha256').update(input.oldPassword).digest('hex');
    if (account.loginPassword !== oldPasswordHash) {
      throw new Error('旧密码不正确');
    }

    // 更新密码
    const newPasswordHash = crypto.createHash('sha256').update(input.newPassword).digest('hex');
    await this.accountRepository.update(account.id, { loginPassword: newPasswordHash });
    return true;
  }
}
