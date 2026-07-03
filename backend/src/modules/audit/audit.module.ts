// src/modules/audit/audit.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditService } from './audit.service';
import { OperationLogEntity } from './entities/operation-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OperationLogEntity])],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
