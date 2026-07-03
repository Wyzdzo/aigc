// src/modules/settings/settings.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsService, SiteSettingData } from './settings.service';
import { SiteSettingEntity, SettingType } from './entities/site-setting.entity';

describe('SettingsService', () => {
  let service: SettingsService;
  let repository: Repository<SiteSettingEntity>;

  const createMockSetting = (key: string, value: string, type: SettingType): SiteSettingEntity => {
    const setting = new SiteSettingEntity();
    setting.id = 1;
    setting.settingKey = key;
    setting.settingValue = value;
    setting.settingType = type;
    setting.displayName = key;
    setting.description = null;
    setting.groupName = 'general';
    setting.sortOrder = 0;
    setting.isPublic = 1;
    setting.createdAt = new Date();
    setting.updatedAt = new Date();
    return setting;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(SiteSettingEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    repository = module.get<Repository<SiteSettingEntity>>(getRepositoryToken(SiteSettingEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSetting', () => {
    it('should return setting value when setting exists', async () => {
      const mockSetting = createMockSetting('site_name', 'My Blog', SettingType.STRING);

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSetting);

      const result = await service.getSetting('site_name');

      expect(result).toBe('My Blog');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { settingKey: 'site_name' } });
    });

    it('should return null when setting does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.getSetting('nonexistent_key');

      expect(result).toBeNull();
    });
  });

  describe('getSettingTyped', () => {
    it('should return number value for NUMBER type setting', async () => {
      const mockSetting = createMockSetting('per_page', '10', SettingType.NUMBER);

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSetting);

      const result = await service.getSettingTyped<number>('per_page');

      expect(result).toBe(10);
    });

    it('should return boolean value for BOOLEAN type setting', async () => {
      const mockSetting = createMockSetting('allow_comment', 'true', SettingType.BOOLEAN);

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSetting);

      const result = await service.getSettingTyped<boolean>('allow_comment');

      expect(result).toBe(true);
    });

    it('should return false for BOOLEAN type setting with value "false"', async () => {
      const mockSetting = createMockSetting('allow_comment', 'false', SettingType.BOOLEAN);

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSetting);

      const result = await service.getSettingTyped<boolean>('allow_comment');

      expect(result).toBe(false);
    });

    it('should return parsed JSON for JSON type setting', async () => {
      const mockSetting = createMockSetting(
        'custom_config',
        '{"theme": "dark", "layout": "grid"}',
        SettingType.JSON,
      );

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSetting);

      const result = await service.getSettingTyped<{ theme: string; layout: string }>(
        'custom_config',
      );

      expect(result).toEqual({ theme: 'dark', layout: 'grid' });
    });

    it('should return null for invalid JSON', async () => {
      const mockSetting = createMockSetting('invalid_json', 'not a json', SettingType.JSON);

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSetting);

      const result = await service.getSettingTyped<object>('invalid_json');

      expect(result).toBeNull();
    });

    it('should return null when setting does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.getSettingTyped<string>('nonexistent_key');

      expect(result).toBeNull();
    });
  });

  describe('getAllSettings', () => {
    it('should return all settings', async () => {
      const mockSettings = [
        createMockSetting('site_name', 'My Blog', SettingType.STRING),
        createMockSetting('per_page', '10', SettingType.NUMBER),
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockSettings);

      const result = await service.getAllSettings();

      expect(result).toHaveLength(2);
      expect(result[0].settingKey).toBe('site_name');
      expect(result[1].settingKey).toBe('per_page');
    });

    it('should return empty array when no settings exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await service.getAllSettings();

      expect(result).toHaveLength(0);
    });
  });

  describe('updateSetting', () => {
    it('should update a setting value', async () => {
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });

      await service.updateSetting('site_name', 'New Blog Name');

      expect(repository.update).toHaveBeenCalledWith(
        { settingKey: 'site_name' },
        { settingValue: 'New Blog Name' },
      );
    });
  });

  describe('updateSettings', () => {
    it('should update multiple settings', async () => {
      const data: SiteSettingData = {
        siteName: 'New Site',
        siteDescription: 'New Description',
        perPage: 20,
        allowComment: false,
      };

      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });

      await service.updateSettings(data);

      expect(repository.update).toHaveBeenCalledWith(
        { settingKey: 'site_name' },
        { settingValue: 'New Site' },
      );
      expect(repository.update).toHaveBeenCalledWith(
        { settingKey: 'site_description' },
        { settingValue: 'New Description' },
      );
      expect(repository.update).toHaveBeenCalledWith(
        { settingKey: 'per_page' },
        { settingValue: '20' },
      );
      expect(repository.update).toHaveBeenCalledWith(
        { settingKey: 'allow_comment' },
        { settingValue: 'false' },
      );
    });

    it('should only update provided fields', async () => {
      const data: SiteSettingData = {
        siteName: 'New Site',
      };

      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });

      await service.updateSettings(data);

      expect(repository.update).toHaveBeenCalledWith(
        { settingKey: 'site_name' },
        { settingValue: 'New Site' },
      );
      expect(repository.update).toHaveBeenCalledTimes(1);
    });
  });
});
