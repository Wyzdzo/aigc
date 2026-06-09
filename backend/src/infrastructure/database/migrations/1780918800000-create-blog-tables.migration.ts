import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlogTables1780918800000 implements MigrationInterface {
  name = 'CreateBlogTables1780918800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建分类表
    await queryRunner.query(`
      CREATE TABLE \`blog_category\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
        \`name\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
        \`slug\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'URL别名',
        \`description\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '分类描述',
        \`parent_id\` int DEFAULT NULL COMMENT '父分类ID',
        \`sort_order\` int NOT NULL DEFAULT 0 COMMENT '排序序号',
        \`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
        \`updated_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_category_slug\` (\`slug\`),
        KEY \`idx_category_parent\` (\`parent_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客分类表';
    `);

    // 创建标签表
    await queryRunner.query(`
      CREATE TABLE \`blog_tag\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
        \`name\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标签名称',
        \`slug\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'URL别名',
        \`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_tag_slug\` (\`slug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客标签表';
    `);

    // 创建文章表
    await queryRunner.query(`
      CREATE TABLE \`blog_post\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
        \`title\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章标题',
        \`slug\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'URL别名',
        \`content\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章内容（Markdown）',
        \`summary\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章摘要',
        \`cover_image\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '封面图片URL',
        \`status\` enum('DRAFT','PUBLISHED','ARCHIVED','DELETED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT' COMMENT '文章状态：DRAFT=草稿,PUBLISHED=发布,ARCHIVED=归档,DELETED=删除',
        \`is_top\` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否置顶：0=否,1=是',
        \`view_count\` int NOT NULL DEFAULT 0 COMMENT '阅读次数',
        \`like_count\` int NOT NULL DEFAULT 0 COMMENT '点赞次数',
        \`category_id\` int DEFAULT NULL COMMENT '分类ID',
        \`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
        \`updated_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
        \`deleted_at\` timestamp(3) DEFAULT NULL COMMENT '删除时间（软删除）',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_post_slug\` (\`slug\`),
        KEY \`idx_post_category\` (\`category_id\`),
        KEY \`idx_post_status\` (\`status\`),
        KEY \`idx_post_is_top\` (\`is_top\`),
        KEY \`idx_post_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客文章表';
    `);

    // 创建文章标签关联表
    await queryRunner.query(`
      CREATE TABLE \`blog_post_tag\` (
        \`post_id\` int NOT NULL COMMENT '文章ID',
        \`tag_id\` int NOT NULL COMMENT '标签ID',
        PRIMARY KEY (\`post_id\`, \`tag_id\`),
        KEY \`idx_post_tag_post\` (\`post_id\`),
        KEY \`idx_post_tag_tag\` (\`tag_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签关联表';
    `);

    // 创建评论表
    await queryRunner.query(`
      CREATE TABLE \`blog_comment\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
        \`post_id\` int NOT NULL COMMENT '文章ID',
        \`parent_id\` int DEFAULT NULL COMMENT '父评论ID（楼中楼）',
        \`nickname\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '昵称',
        \`email\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
        \`avatar\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像URL',
        \`content\` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论内容',
        \`status\` enum('PENDING','APPROVED','REJECTED','DELETED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING' COMMENT '评论状态：PENDING=待审核,APPROVED=已通过,REJECTED=已驳回,DELETED=已删除',
        \`like_count\` int NOT NULL DEFAULT 0 COMMENT '点赞次数',
        \`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
        PRIMARY KEY (\`id\`),
        KEY \`idx_comment_post\` (\`post_id\`),
        KEY \`idx_comment_parent\` (\`parent_id\`),
        KEY \`idx_comment_status\` (\`status\`),
        KEY \`idx_comment_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客评论表';
    `);

    // 创建友链表
    await queryRunner.query(`
      CREATE TABLE \`blog_link\` (
        \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
        \`title\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '友链标题',
        \`url\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '友链URL',
        \`description\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '友链描述',
        \`logo\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Logo URL',
        \`sort_order\` int NOT NULL DEFAULT 0 COMMENT '排序序号',
        \`status\` enum('ACTIVE','INACTIVE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE=启用,INACTIVE=禁用',
        \`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
        \`updated_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        KEY \`idx_link_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='友情链接表';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `blog_link`;');
    await queryRunner.query('DROP TABLE `blog_comment`;');
    await queryRunner.query('DROP TABLE `blog_post_tag`;');
    await queryRunner.query('DROP TABLE `blog_post`;');
    await queryRunner.query('DROP TABLE `blog_tag`;');
    await queryRunner.query('DROP TABLE `blog_category`;');
  }
}