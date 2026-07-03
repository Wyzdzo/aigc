// src/usecases/settings/settings.usecase.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SettingsService, SiteSettingData } from '@modules/settings/settings.service';
import { AccountEntity } from '@modules/account/base/entities/account.entity';
import { UserInfoEntity } from '@modules/account/base/entities/user-info.entity';
import { AccountService } from '@modules/account/base/services/account.service';
import { AuditService } from '@modules/audit/audit.service';

import { SettingsUsecase } from './settings.usecase';

describe('SettingsUsecase', () => {
  let usecase: SettingsUsecase;
  let settingsService: SettingsService;
  let accountRepository: Repository<AccountEntity>;
  let userInfoRepository: Repository<UserInfoEntity>;
  let auditService: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsUsecase,
        {
          provide: SettingsService,
          useValue: {
            getAllSettings: jest.fn(),
            updateSettings: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AccountEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserInfoEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: AccountService,
          useValue: {
            verifyPassword: jest.fn(),
            hashPasswordWithTimestamp: jest.fn(),
            updateAccountPasswordHash: jest.fn(),
          },
        },
        {
          provide: AuditService,
          useValue: {
            createLog: jest.fn(),
          },
        },
      ],
    }).compile();

    usecase = module.get<SettingsUsecase>(SettingsUsecase);
    settingsService = module.get<SettingsService>(SettingsService);
    accountRepository = module.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
    userInfoRepository = module.get<Repository<UserInfoEntity>>(getRepositoryToken(UserInfoEntity));
    auditService = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('getSettings', () => {
    it('should return mapped settings', async () => {
      const mockSettings = [
        {
          settingKey: 'site_name',
          settingValue: 'My Blog',
          displayName: '站点名称',
          groupName: 'general',
        },
        {
          settingKey: 'per_page',
          settingValue: '10',
          displayName: '每页条数',
          groupName: 'general',
        },
      ];

      (settingsService.getAllSettings as jest.Mock).mockResolvedValue(mockSettings);

      const result = await usecase.getSettings();

      expect(settingsService.getAllSettings).toHaveBeenCalled();
      expect(result.siteSettings).toEqual([
        { key: 'site_name', value: 'My Blog', displayName: '站点名称', groupName: 'general' },
        { key: 'per_page', value: '10', displayName: '每页条数', groupName: 'general' },
      ]);
    });
  });

  describe('updateSiteSettings', () => {
    it('should delegate to settings service', async () => {
      const data: SiteSettingData = { siteName: 'New Site', perPage: 20 };

      (settingsService.updateSettings as jest.Mock).mockResolvedValue(undefined);

      await usecase.updateSiteSettings(data);

      expect(settingsService.updateSettings).toHaveBeenCalledWith(data);
    });
  });

  describe('getBloggerInfo', () => {
    it('should return blogger info when found', async () => {
      const mockUserInfo = {
        id: 1,
        accountId: 10,
        nickname: '博主',
        avatarUrl: 'https://example.com/avatar.png',
        signature: '这是简介',
      };

      (userInfoRepository.findOne as jest.Mock).mockResolvedValue(mockUserInfo);

      const result = await usecase.getBloggerInfo(10);

      expect(userInfoRepository.findOne).toHaveBeenCalledWith({ where: { accountId: 10 } });
      expect(result).toEqual({
        nickname: '博主',
        avatar: 'https://example.com/avatar.png',
        bio: '这是简介',
      });
    });

    it('should return null when not found', async () => {
      (userInfoRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await usecase.getBloggerInfo(999);

      expect(result).toBeNull();
    });
  });

  describe('updateBloggerInfo', () => {
    it('should update existing user info', async () => {
      const existingUserInfo = {
        id: 1,
        accountId: 10,
        nickname: '旧昵称',
        signature: '旧简介',
        avatarUrl: '旧头像',
      };

      (userInfoRepository.findOne as jest.Mock).mockResolvedValue(existingUserInfo);
      (userInfoRepository.update as jest.Mock).mockResolvedValue(undefined);
      (auditService.createLog as jest.Mock).mockResolvedValue(undefined);

      await usecase.updateBloggerInfo({
        accountId: 10,
        nickname: '新昵称',
        bio: '新简介',
        avatar: '新头像',
      });

      expect(userInfoRepository.update).toHaveBeenCalledWith(1, {
        nickname: '新昵称',
        signature: '新简介',
        avatarUrl: '新头像',
      });
      expect(auditService.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          operatorId: 10,
          operationType: 'UPDATE_BLOGGER_INFO',
        }),
      );
    });
  });

  describe('updatePassword', () => {
    it('should throw Error when account not found', async () => {
      (accountRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        usecase.updatePassword({
          accountId: 999,
          oldPassword: 'old',
          newPassword: 'new',
        }),
      ).rejects.toThrow('账户不存在');
    });
  });
});
