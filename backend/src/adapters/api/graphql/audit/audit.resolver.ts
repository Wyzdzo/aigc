// src/adapters/api/graphql/audit/audit.resolver.ts

import { JwtPayload } from '@app-types/jwt.types';
import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { AuditService } from '@src/modules/audit/audit.service';
import { currentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { OperationLogDTO, OperationLogQueryResultDTO } from './dto/operation-log.dto';

/**
 * 审计日志GraphQL Resolver
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AuditResolver {
  constructor(private readonly auditService: AuditService) {}

  /**
   * 查询操作日志列表
   */
  @Query(() => OperationLogQueryResultDTO, { description: '查询操作日志列表' })
  async operationLogs(
    @Args('operatorId', { nullable: true }) operatorId?: number,
    @Args('operationType', { nullable: true }) operationType?: string,
    @Args('targetType', { nullable: true }) targetType?: string,
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date,
    @Args('page', { nullable: true }) page?: number,
    @Args('pageSize', { nullable: true }) pageSize?: number,
    @currentUser() _user?: JwtPayload,
  ): Promise<OperationLogQueryResultDTO> {
    const result = await this.auditService.queryLogs({
      operatorId,
      operationType,
      targetType,
      startDate,
      endDate,
      page: page ?? 1,
      pageSize: pageSize ?? 20,
    });

    return {
      logs: result.logs.map((log) => ({
        id: log.id,
        operatorId: log.operatorId,
        operatorName: log.operatorName,
        operationType: log.operationType,
        operationDesc: log.operationDesc,
        targetType: log.targetType ?? undefined,
        targetId: log.targetId ?? undefined,
        operationDetail: log.operationDetail ?? undefined,
        ipAddress: log.ipAddress ?? undefined,
        createdAt: log.createdAt,
        updatedAt: log.updatedAt,
      })),
      total: result.total,
    };
  }

  /**
   * 根据ID查询单条操作日志
   */
  @Query(() => OperationLogDTO, { nullable: true, description: '根据ID查询操作日志' })
  async operationLog(
    @Args('id') id: number,
    @currentUser() _user?: JwtPayload,
  ): Promise<OperationLogDTO | null> {
    const log = await this.auditService.getLogById(id);

    if (!log) {
      return null;
    }

    return {
      id: log.id,
      operatorId: log.operatorId,
      operatorName: log.operatorName,
      operationType: log.operationType,
      operationDesc: log.operationDesc,
      targetType: log.targetType ?? undefined,
      targetId: log.targetId ?? undefined,
      operationDetail: log.operationDetail ?? undefined,
      ipAddress: log.ipAddress ?? undefined,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    };
  }
}