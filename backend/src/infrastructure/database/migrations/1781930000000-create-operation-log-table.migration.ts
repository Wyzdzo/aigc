// src/infrastructure/database/migrations/1781930000000-create-operation-log-table.migration.ts

import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 创建操作日志表迁移
 */
export class CreateOperationLogTable1781930000000 implements MigrationInterface {
  name = 'CreateOperationLogTable1781930000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`operation_log\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
        \`operator_id\` int NOT NULL COMMENT '操作人ID',
        \`operator_name\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作人名称',
        \`operation_type\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作类型',
        \`operation_desc\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作描述',
        \`target_type\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作目标类型',
        \`target_id\` int DEFAULT NULL COMMENT '操作目标ID',
        \`operation_detail\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作详情（JSON格式）',
        \`ip_address\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作IP地址',
        \`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
        \`updated_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        KEY \`IDX_operation_log_operator_id\` (\`operator_id\`),
        KEY \`IDX_operation_log_operation_type\` (\`operation_type\`),
        KEY \`IDX_operation_log_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`operation_log\`;`);
  }
}
