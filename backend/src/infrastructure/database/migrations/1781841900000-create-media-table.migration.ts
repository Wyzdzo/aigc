import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMediaTable1781841900000 implements MigrationInterface {
  name = 'CreateMediaTable1781841900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`media\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
        \`filename\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '存储文件名',
        \`original_name\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '原始文件名',
        \`mime_type\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'MIME类型',
        \`size\` int NOT NULL COMMENT '文件大小（字节）',
        \`url\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '访问URL',
        \`width\` int NOT NULL DEFAULT 0 COMMENT '图片宽度',
        \`height\` int NOT NULL DEFAULT 0 COMMENT '图片高度',
        \`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
        \`updated_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        KEY \`idx_media_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='媒体文件表';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`media\``);
  }
}
