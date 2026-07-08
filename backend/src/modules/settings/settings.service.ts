// src/modules/settings/settings.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettingEntity, SettingType } from './entities/site-setting.entity';

export interface SiteSettingData {
  siteName?: string;
  siteDescription?: string;
  siteKeywords?: string;
  bloggerName?: string;
  bloggerBio?: string;
  bloggerAvatar?: string;
  perPage?: number;
  allowComment?: boolean;
  announcement?: string;
}

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SiteSettingEntity)
    private readonly settingsRepository: Repository<SiteSettingEntity>,
  ) {}

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.settingsRepository.findOne({ where: { settingKey: key } });
    return setting?.settingValue ?? null;
  }

  async getSettingTyped<T>(key: string): Promise<T | null> {
    const setting = await this.settingsRepository.findOne({ where: { settingKey: key } });
    if (!setting) return null;

    switch (setting.settingType) {
      case SettingType.NUMBER:
        return Number(setting.settingValue) as T;
      case SettingType.BOOLEAN:
        return (setting.settingValue === 'true') as T;
      case SettingType.JSON:
        try {
          return JSON.parse(setting.settingValue || '{}') as T;
        } catch {
          return null;
        }
      default:
        return setting.settingValue as T;
    }
  }

  async getAllSettings(publicOnly: boolean = false): Promise<SiteSettingEntity[]> {
    const where = publicOnly ? { isPublic: 1 } : {};
    return this.settingsRepository.find({
      where,
      order: { groupName: 'ASC', sortOrder: 'ASC' },
    });
  }

  async getSettingsByGroup(group: string): Promise<SiteSettingEntity[]> {
    return this.settingsRepository.find({
      where: { groupName: group },
      order: { sortOrder: 'ASC' },
    });
  }

  async updateSetting(key: string, value: string): Promise<void> {
    const existing = await this.settingsRepository.findOne({ where: { settingKey: key } });
    if (existing) {
      await this.settingsRepository.update({ settingKey: key }, { settingValue: value });
    } else {
      await this.settingsRepository.insert({
        settingKey: key,
        settingValue: value,
        settingType: SettingType.STRING,
        displayName: key,
        groupName: 'general',
        sortOrder: 99,
        isPublic: 1,
      });
    }
  }

  async updateSettings(data: SiteSettingData): Promise<void> {
    const updateData: Record<string, string> = {};

    if (data.siteName !== undefined) updateData['site_name'] = data.siteName;
    if (data.siteDescription !== undefined) updateData['site_description'] = data.siteDescription;
    if (data.siteKeywords !== undefined) updateData['site_keywords'] = data.siteKeywords;
    if (data.bloggerName !== undefined) updateData['blogger_name'] = data.bloggerName;
    if (data.bloggerBio !== undefined) updateData['blogger_bio'] = data.bloggerBio;
    if (data.bloggerAvatar !== undefined) updateData['blogger_avatar'] = data.bloggerAvatar;
    if (data.perPage !== undefined) updateData['per_page'] = String(data.perPage);
    if (data.allowComment !== undefined) updateData['allow_comment'] = String(data.allowComment);
    if (data.announcement !== undefined) updateData['site_announcement'] = data.announcement;

    for (const [key, value] of Object.entries(updateData)) {
      await this.settingsRepository.update({ settingKey: key }, { settingValue: value });
    }
  }
}
