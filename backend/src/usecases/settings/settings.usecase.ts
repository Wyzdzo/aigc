// src/usecases/settings/settings.usecase.ts

import { Injectable } from '@nestjs/common';
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

@Injectable()
export class SettingsUsecase {
  constructor(private readonly settingsService: SettingsService) {}

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
}
