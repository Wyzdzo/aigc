// src/usecases/settings/settings.usecase.spec.ts

import { Test, TestingModule } from '@nestjs/testing';

import { SettingsService, SiteSettingData } from '@modules/settings/settings.service';
import { DomainError } from '@core/common/errors/domain-error';
import { AccountService } from '@modules/account/base/services/account.service';
import {
  UserInfoService,
  type UserInfoSnapshot,
} from '@modules/account/base/services/user-info.service';
import { AuditService } from '@modules/audit/audit.service';

import { SettingsUsecase } from './settings.usecase';

describe('SettingsUsecase', () => {
  let usecase: SettingsUsecase;
  let settingsService: SettingsService;
  let userInfoService: UserInfoService;
  let accountService: AccountService;
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
          provide: UserInfoService,
          useValue: {
            findByAccountId: jest.fn(),
            findFirst: jest.fn(),
            upsertBloggerInfo: jest.fn(),
          },
        },
        {
          provide: AccountService,
          useValue: {
            changePassword: jest.fn(),
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
    userInfoService = module.get<UserInfoService>(UserInfoService);
    accountService = module.get<AccountService>(AccountService);
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
      const mockSnapshot: UserInfoSnapshot = {
        id: 1,
        accountId: 10,
        nickname: '博主',
        avatarUrl: 'https://example.com/avatar.png',
        signature: '这是简介',
      };

      (userInfoService.findByAccountId as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await usecase.getBloggerInfo(10);

      expect(userInfoService.findByAccountId).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        nickname: '博主',
        avatar: 'https://example.com/avatar.png',
        bio: '这是简介',
      });
    });

    it('should return null when not found', async () => {
      (userInfoService.findByAccountId as jest.Mock).mockResolvedValue(null);

      const result = await usecase.getBloggerInfo(999);

      expect(result).toBeNull();
    });
  });

  describe('updateBloggerInfo', () => {
    it('should delegate to userInfoService and create audit log', async () => {
      (userInfoService.upsertBloggerInfo as jest.Mock).mockResolvedValue({ userInfoId: 1 });
      (auditService.createLog as jest.Mock).mockResolvedValue(undefined);

      await usecase.updateBloggerInfo({
        accountId: 10,
        nickname: '新昵称',
        bio: '新简介',
        avatar: '新头像',
      });

      expect(userInfoService.upsertBloggerInfo).toHaveBeenCalledWith({
        accountId: 10,
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
    it('should delegate to accountService and create audit log', async () => {
      (accountService.changePassword as jest.Mock).mockResolvedValue({ loginName: 'testuser' });
      (auditService.createLog as jest.Mock).mockResolvedValue(undefined);

      await usecase.updatePassword({
        accountId: 10,
        oldPassword: 'old',
        newPassword: 'newPassword123',
      });

      expect(accountService.changePassword).toHaveBeenCalledWith({
        accountId: 10,
        oldPassword: 'old',
        newPassword: 'newPassword123',
      });
      expect(auditService.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          operatorId: 10,
          operationType: 'UPDATE_PASSWORD',
        }),
      );
    });

    it('should propagate error when changePassword fails', async () => {
      (accountService.changePassword as jest.Mock).mockRejectedValue(
        new DomainError('ACCOUNT_NOT_FOUND', '账户不存在'),
      );

      await expect(
        usecase.updatePassword({
          accountId: 999,
          oldPassword: 'old',
          newPassword: 'newPassword123',
        }),
      ).rejects.toThrow('账户不存在');
    });
  });
});
