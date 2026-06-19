// src/usecases/audit/audit-usecases.module.ts

import { Module } from '@nestjs/common';

import { AuditModule } from '@src/modules/audit/audit.module';

@Module({
  imports: [AuditModule],
  exports: [AuditModule],
})
export class AuditUsecasesModule {}