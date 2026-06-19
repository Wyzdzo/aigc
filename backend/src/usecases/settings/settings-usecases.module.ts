// src/usecases/settings/settings-usecases.module.ts

import { Module } from '@nestjs/common';
import { SettingsModule } from '@modules/settings/settings.module';
import { SettingsUsecase } from './settings.usecase';

@Module({
  imports: [SettingsModule],
  providers: [SettingsUsecase],
  exports: [SettingsUsecase],
})
export class SettingsUsecasesModule {}
