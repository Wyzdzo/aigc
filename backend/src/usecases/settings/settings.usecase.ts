// src/usecases/settings/settings.usecase.ts

import { Injectable } from '@nestjs/common';

import { AccountService } from '@modules/account/base/services/account.service';
import { UserInfoService } from '@modules/account/base/services/user-info.service';
import { AuditService } from '@modules/audit/audit.service';
import { SettingsService, SiteSettingData } from '@modules/settings/settings.service';

export interface SiteSettingItem {
  key: string;
  value: string | null;
  displayName: string | null;
  groupName: string;
}

export interface SettingsResult {
  siteSettings: SiteSettingItem[];
}

export interface UpdateBloggerInfoParams {
  accountId: number;
  nickname: string;
  bio?: string;
  avatar?: string;
  ipAddress?: string;
}

export interface UpdatePasswordParams {
  accountId: number;
  oldPassword: string;
  newPassword: string;
  ipAddress?: string;
}

export interface BloggerInfo {
  nickname: string;
  avatar: string | null;
  bio: string | null;
}

@Injectable()
export class SettingsUsecase {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly userInfoService: UserInfoService,
    private readonly accountService: AccountService,
    private readonly auditService: AuditService,
  ) {}

  async getSettings(): Promise<SettingsResult> {
    const settings = await this.settingsService.getAllSettings();

    return {
      siteSettings: settings.map((s) => ({
        key: s.settingKey,
        value: s.settingValue,
        displayName: s.displayName,
        groupName: s.groupName,
      })),
    };
  }

  async updateSiteSettings(data: SiteSettingData): Promise<void> {
    await this.settingsService.updateSettings(data);
  }

  async getBloggerInfo(accountId: number): Promise<BloggerInfo | null> {
    const userInfo = await this.userInfoService.findByAccountId(accountId);

    if (!userInfo) {
      return null;
    }

    return {
      nickname: userInfo.nickname,
      avatar: userInfo.avatarUrl,
      bio: userInfo.signature,
    };
  }

  async getFirstBloggerInfo(): Promise<BloggerInfo | null> {
    const userInfo = await this.userInfoService.findFirst();

    if (!userInfo) {
      return null;
    }

    return {
      nickname: userInfo.nickname,
      avatar: userInfo.avatarUrl,
      bio: userInfo.signature,
    };
  }

  async updateBloggerInfo(params: UpdateBloggerInfoParams): Promise<void> {
    const { accountId, nickname, bio, avatar, ipAddress } = params;

    const { userInfoId } = await this.userInfoService.upsertBloggerInfo({
      accountId,
      nickname,
      signature: bio || null,
      avatarUrl: avatar || null,
    });

    // 记录审计日志
    await this.auditService.createLog({
      operatorId: accountId,
      operatorName: nickname,
      operationType: 'UPDATE_BLOGGER_INFO',
      operationDesc: '更新博主信息',
      targetType: 'USER_INFO',
      targetId: userInfoId,
      operationDetail: JSON.stringify({ nickname, bio, avatar }),
      ipAddress: ipAddress,
    });
  }

  async updatePassword(params: UpdatePasswordParams): Promise<void> {
    const { accountId, oldPassword, newPassword, ipAddress } = params;

    const { loginName } = await this.accountService.changePassword({
      accountId,
      oldPassword,
      newPassword,
    });

    // 记录审计日志
    await this.auditService.createLog({
      operatorId: accountId,
      operatorName: loginName ?? String(accountId),
      operationType: 'UPDATE_PASSWORD',
      operationDesc: '修改密码',
      targetType: 'ACCOUNT',
      targetId: accountId,
      operationDetail: undefined,
      ipAddress: ipAddress,
    });
  }
}
