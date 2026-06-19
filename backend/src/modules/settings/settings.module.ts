// src/modules/settings/settings.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSettingEntity } from './entities/site-setting.entity';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettingEntity])],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
