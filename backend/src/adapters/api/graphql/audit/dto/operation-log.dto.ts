// src/adapters/api/graphql/audit/dto/operation-log.dto.ts

import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * 操作日志GraphQL DTO
 */
@ObjectType('OperationLog')
export class OperationLogDTO {
  @Field(() => Int, { description: '日志ID' })
  id!: number;

  @Field(() => Int, { description: '操作人ID' })
  operatorId!: number;

  @Field({ description: '操作人名称' })
  operatorName!: string;

  @Field({ description: '操作类型' })
  operationType!: string;

  @Field({ description: '操作描述' })
  operationDesc!: string;

  @Field({ description: '操作目标类型', nullable: true })
  targetType?: string;

  @Field(() => Int, { description: '操作目标ID', nullable: true })
  targetId?: number;

  @Field({ description: '操作详情（JSON格式）', nullable: true })
  operationDetail?: string;

  @Field({ description: '操作IP地址', nullable: true })
  ipAddress?: string;

  @Field({ description: '创建时间' })
  createdAt!: Date;

  @Field({ description: '更新时间' })
  updatedAt!: Date;
}

/**
 * 操作日志查询结果DTO
 */
@ObjectType('OperationLogQueryResult')
export class OperationLogQueryResultDTO {
  @Field(() => [OperationLogDTO], { description: '日志列表' })
  logs!: OperationLogDTO[];

  @Field(() => Int, { description: '总数' })
  total!: number;
}