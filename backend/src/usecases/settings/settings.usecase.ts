// src/usecases/settings/settings.usecase.ts
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { AccountEntity } from '@modules/account/base/entities/account.entity';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { UserInfoEntity } from '@modules/account/base/entities/user-info.entity';
import { AccountService } from '@modules/account/base/services/account.service';
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
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
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
    const userInfo = await this.userInfoRepository.findOne({
      where: { accountId },
    });

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

    let userInfo = await this.userInfoRepository.findOne({
      where: { accountId },
    });

    if (!userInfo) {
      const account = await this.accountRepository.findOne({
        where: { id: accountId },
      });

      if (!account) {
        throw new Error('账户不存在');
      }

      userInfo = this.userInfoRepository.create({
        accountId: account.id,
        nickname,
        signature: bio || null,
        avatarUrl: avatar || null,
      });
      await this.userInfoRepository.save(userInfo);
    } else {
      await this.userInfoRepository.update(userInfo.id, {
        nickname,
        signature: bio || userInfo.signature,
        avatarUrl: avatar || userInfo.avatarUrl,
      });
    }

    // 记录审计日志
    await this.auditService.createLog({
      operatorId: accountId,
      operatorName: nickname,
      operationType: 'UPDATE_BLOGGER_INFO',
      operationDesc: '更新博主信息',
      targetType: 'USER_INFO',
      targetId: userInfo.id,
      operationDetail: JSON.stringify({ nickname, bio, avatar }),
      ipAddress: ipAddress,
    });
  }

  async updatePassword(params: UpdatePasswordParams): Promise<void> {
    const { accountId, oldPassword, newPassword, ipAddress } = params;

    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('账户不存在');
    }

    // 使用 AccountService 的密码验证方法
    const isValid = AccountService.verifyPassword(
      oldPassword,
      account.loginPassword,
      account.createdAt,
    );

    if (!isValid) {
      throw new Error('旧密码不正确');
    }

    // 生成新密码哈希
    const newPasswordHash = AccountService.hashPasswordWithTimestamp(
      newPassword,
      account.createdAt,
    );

    await this.accountService.updateAccountPasswordHash({
      accountId: account.id,
      passwordHash: newPasswordHash,
    });

    // 记录审计日志
    await this.auditService.createLog({
      operatorId: accountId,
      operatorName: account.loginName ?? String(accountId),
      operationType: 'UPDATE_PASSWORD',
      operationDesc: '修改密码',
      targetType: 'ACCOUNT',
      targetId: accountId,
      operationDetail: undefined,
      ipAddress: ipAddress,
    });
  }
}
