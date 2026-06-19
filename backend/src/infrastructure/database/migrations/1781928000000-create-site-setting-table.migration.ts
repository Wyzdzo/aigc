// src/infrastructure/database/migrations/1781928000000-create-site-setting-table.migration.ts

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSiteSettingTable1781928000000 implements MigrationInterface {
  name = 'CreateSiteSettingTable1781928000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`site_setting\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
        \`setting_key\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设置键',
        \`setting_value\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '设置值',
        \`setting_type\` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'string' COMMENT '设置类型: string, number, boolean, json',
        \`display_name\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '显示名称',
        \`description\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '描述',
        \`group_name\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general' COMMENT '分组名称',
        \`sort_order\` int NOT NULL DEFAULT 0 COMMENT '排序序号',
        \`is_public\` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否公开',
        \`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
        \`updated_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_setting_key\` (\`setting_key\`),
        KEY \`idx_group_name\` (\`group_name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='网站设置表';
    `);

    // 插入默认设置项
    await queryRunner.query(`
      INSERT INTO \`site_setting\` (\`setting_key\`, \`setting_value\`, \`setting_type\`, \`display_name\`, \`group_name\`, \`sort_order\`, \`is_public\`) VALUES
      ('site_name', 'My Blog', 'string', '网站名称', 'general', 1, 1),
      ('site_description', 'A personal blog', 'string', '网站描述', 'general', 2, 1),
      ('site_keywords', 'blog, tech', 'string', '网站关键词', 'general', 3, 1),
      ('blogger_name', 'Admin', 'string', '博主名称', 'blogger', 1, 1),
      ('blogger_bio', 'This is my blog', 'string', '博主简介', 'blogger', 2, 1),
      ('blogger_avatar', NULL, 'string', '博主头像', 'blogger', 3, 1),
      ('per_page', '10', 'number', '每页文章数', 'content', 1, 0),
      ('allow_comment', 'true', 'boolean', '允许评论', 'content', 2, 1);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`site_setting\``);
  }
}
