// src/modules/audit/audit.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OperationLogEntity } from './entities/operation-log.entity';

/**
 * 操作日志创建参数
 */
export interface CreateOperationLogParams {
  operatorId: number;
  operatorName: string;
  operationType: string;
  operationDesc: string;
  targetType?: string;
  targetId?: number;
  operationDetail?: string;
  ipAddress?: string;
}

/**
 * 操作日志查询参数
 */
export interface QueryOperationLogParams {
  operatorId?: number;
  operationType?: string;
  targetType?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

/**
 * 审计服务
 * 负责记录和查询操作日志
 */
@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(OperationLogEntity)
    private readonly operationLogRepository: Repository<OperationLogEntity>,
  ) {}

  /**
   * 创建操作日志
   */
  async createLog(params: CreateOperationLogParams): Promise<OperationLogEntity> {
    const log = this.operationLogRepository.create({
      operatorId: params.operatorId,
      operatorName: params.operatorName,
      operationType: params.operationType,
      operationDesc: params.operationDesc,
      targetType: params.targetType ?? null,
      targetId: params.targetId ?? null,
      operationDetail: params.operationDetail ?? null,
      ipAddress: params.ipAddress ?? null,
    });

    return this.operationLogRepository.save(log);
  }

  /**
   * 查询操作日志列表
   */
  async queryLogs(params: QueryOperationLogParams): Promise<{
    logs: OperationLogEntity[];
    total: number;
  }> {
    const queryBuilder = this.operationLogRepository.createQueryBuilder('log');

    // 添加筛选条件
    if (params.operatorId) {
      queryBuilder.andWhere('log.operator_id = :operatorId', { operatorId: params.operatorId });
    }

    if (params.operationType) {
      queryBuilder.andWhere('log.operation_type = :operationType', {
        operationType: params.operationType,
      });
    }

    if (params.targetType) {
      queryBuilder.andWhere('log.target_type = :targetType', { targetType: params.targetType });
    }

    if (params.startDate) {
      queryBuilder.andWhere('log.created_at >= :startDate', { startDate: params.startDate });
    }

    if (params.endDate) {
      queryBuilder.andWhere('log.created_at <= :endDate', { endDate: params.endDate });
    }

    // 排序
    queryBuilder.orderBy('log.created_at', 'DESC');

    // 分页
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    queryBuilder.skip((page - 1) * pageSize).take(pageSize);

    const [logs, total] = await queryBuilder.getManyAndCount();

    return { logs, total };
  }

  /**
   * 根据ID查询单条操作日志
   */
  async getLogById(id: number): Promise<OperationLogEntity | null> {
    return this.operationLogRepository.findOne({ where: { id } });
  }

  /**
   * 删除操作日志（用于清理旧日志）
   */
  async deleteLogsBeforeDate(date: Date): Promise<number> {
    const result = await this.operationLogRepository
      .createQueryBuilder()
      .delete()
      .where('created_at < :date', { date })
      .execute();

    return result.affected ?? 0;
  }
}