// src/modules/account/base/services/user-info.service.ts
import { ACCOUNT_ERROR, DomainError } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserInfoEntity } from '../entities/user-info.entity';
import { AccountService } from './account.service';

export interface UserInfoSnapshot {
  id: number;
  accountId: number;
  nickname: string;
  avatarUrl: string | null;
  signature: string | null;
}

@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
    private readonly accountService: AccountService,
  ) {}

  async findByAccountId(accountId: number): Promise<UserInfoSnapshot | null> {
    const userInfo = await this.userInfoRepository.findOne({
      where: { accountId },
    });
    if (!userInfo) return null;
    return {
      id: userInfo.id,
      accountId: userInfo.accountId,
      nickname: userInfo.nickname,
      avatarUrl: userInfo.avatarUrl,
      signature: userInfo.signature,
    };
  }

  async findFirst(): Promise<UserInfoSnapshot | null> {
    const users = await this.userInfoRepository.find({
      order: { id: 'ASC' },
      take: 1,
    });
    const userInfo = users[0];
    if (!userInfo) return null;
    return {
      id: userInfo.id,
      accountId: userInfo.accountId,
      nickname: userInfo.nickname,
      avatarUrl: userInfo.avatarUrl,
      signature: userInfo.signature,
    };
  }

  async upsertBloggerInfo(params: {
    accountId: number;
    nickname: string;
    signature?: string | null;
    avatarUrl?: string | null;
  }): Promise<{ userInfoId: number }> {
    const { accountId, nickname, signature, avatarUrl } = params;

    let userInfo = await this.userInfoRepository.findOne({
      where: { accountId },
    });

    if (!userInfo) {
      // 验证账户存在
      const accountExists = await this.accountService.existsById(accountId);
      if (!accountExists) {
        throw new DomainError(ACCOUNT_ERROR.ACCOUNT_NOT_FOUND, '账户不存在');
      }

      userInfo = this.userInfoRepository.create({
        accountId,
        nickname,
        signature: signature || null,
        avatarUrl: avatarUrl || null,
      });
      await this.userInfoRepository.save(userInfo);
    } else {
      await this.userInfoRepository.update(userInfo.id, {
        nickname,
        signature: signature || userInfo.signature,
        avatarUrl: avatarUrl || userInfo.avatarUrl,
      });
    }

    return { userInfoId: userInfo.id };
  }
}
