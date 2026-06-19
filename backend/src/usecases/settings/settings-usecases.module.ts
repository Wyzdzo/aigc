// src/usecases/settings/settings-usecases.module.ts

import { Module } from '@nestjs/common';
import { AccountModule } from '@src/modules/account/account.module';
import { AuditModule } from '@src/modules/audit/audit.module';
import { SettingsModule } from '@modules/settings/settings.module';
import { SettingsUsecase } from './settings.usecase';

@Module({
  imports: [AccountModule.forRoot(), AuditModule, SettingsModule],
  providers: [SettingsUsecase],
  exports: [SettingsUsecase],
})
export class SettingsUsecasesModule {}
