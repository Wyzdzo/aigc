// src/modules/audit/entities/operation-log.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 操作日志实体
 * 记录管理员的关键操作行为
 */
@Entity('operation_log')
export class OperationLogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * 操作人ID
   */
  @Column({ name: 'operator_id', type: 'int' })
  operatorId!: number;

  /**
   * 操作人名称
   */
  @Column({ name: 'operator_name', type: 'varchar', length: 100 })
  operatorName!: string;

  /**
   * 操作类型
   * 例如：LOGIN, CREATE_POST, UPDATE_POST, DELETE_POST, UPDATE_SETTINGS
   */
  @Column({ name: 'operation_type', type: 'varchar', length: 50 })
  operationType!: string;

  /**
   * 操作描述
   */
  @Column({ name: 'operation_desc', type: 'varchar', length: 255 })
  operationDesc!: string;

  /**
   * 操作目标类型
   * 例如：POST, CATEGORY, TAG, COMMENT, SETTINGS, MEDIA
   */
  @Column({ name: 'target_type', type: 'varchar', length: 50, nullable: true })
  targetType!: string | null;

  /**
   * 操作目标ID
   */
  @Column({ name: 'target_id', type: 'int', nullable: true })
  targetId!: number | null;

  /**
   * 操作详情（JSON格式）
   */
  @Column({ name: 'operation_detail', type: 'text', nullable: true })
  operationDetail!: string | null;

  /**
   * 操作IP地址
   */
  @Column({ name: 'ip_address', type: 'varchar', length: 50, nullable: true })
  ipAddress!: string | null;

  /**
   * 操作时间
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
