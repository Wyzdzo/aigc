// test/09-blog-migrations/blog-migrations.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';
import { ApiModule } from '../../src/bootstraps/api/api.module';
import { CreateBlogTables1780918800000 } from '../../src/infrastructure/database/migrations/1780918800000-create-blog-tables.migration';

describe('Blog Migrations E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let migration: CreateBlogTables1780918800000;

  const tableExists = async (tableName: string): Promise<boolean> => {
    const result = await queryRunner.query(
      `SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?`,
      [tableName],
    );
    return result.length > 0;
  };

  const getTableColumns = async (tableName: string): Promise<string[]> => {
    const rows = (await queryRunner.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ?`,
      [tableName],
    )) as Array<Record<string, unknown>>;
    return rows.map((r) => String(r.column_name ?? r.COLUMN_NAME));
  };

  const getTableIndexes = async (tableName: string): Promise<string[]> => {
    const rows = (await queryRunner.query(
      `SELECT index_name FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = ?`,
      [tableName],
    )) as Array<Record<string, unknown>>;
    return [...new Set(rows.map((r) => String(r.index_name ?? r.INDEX_NAME)))];
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();

    queryRunner = dataSource.createQueryRunner();
    migration = new CreateBlogTables1780918800000();
  }, 30000);

  afterAll(async () => {
    if (queryRunner) {
      await queryRunner.release();
    }
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    // 确保每次测试前表都不存在
    const tables = [
      'blog_link',
      'blog_comment',
      'blog_post_tag',
      'blog_post',
      'blog_tag',
      'blog_category',
    ];
    for (const table of tables) {
      if (await tableExists(table)) {
        await queryRunner.query(`DROP TABLE IF EXISTS \`${table}\``);
      }
    }
  });

  afterEach(async () => {
    // 清理创建的表
    const tables = [
      'blog_link',
      'blog_comment',
      'blog_post_tag',
      'blog_post',
      'blog_tag',
      'blog_category',
    ];
    for (const table of tables) {
      if (await tableExists(table)) {
        await queryRunner.query(`DROP TABLE IF EXISTS \`${table}\``);
      }
    }
  });

  describe('Migration up (create tables)', () => {
    it('should create all blog tables successfully', async () => {
      await migration.up(queryRunner);

      expect(await tableExists('blog_category')).toBe(true);
      expect(await tableExists('blog_tag')).toBe(true);
      expect(await tableExists('blog_post')).toBe(true);
      expect(await tableExists('blog_post_tag')).toBe(true);
      expect(await tableExists('blog_comment')).toBe(true);
      expect(await tableExists('blog_link')).toBe(true);
    });

    it('should create blog_category with correct columns', async () => {
      await migration.up(queryRunner);

      const columns = await getTableColumns('blog_category');

      expect(columns).toContain('id');
      expect(columns).toContain('name');
      expect(columns).toContain('slug');
      expect(columns).toContain('description');
      expect(columns).toContain('parent_id');
      expect(columns).toContain('sort_order');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should create blog_post with correct columns and soft delete support', async () => {
      await migration.up(queryRunner);

      const columns = await getTableColumns('blog_post');

      expect(columns).toContain('id');
      expect(columns).toContain('title');
      expect(columns).toContain('slug');
      expect(columns).toContain('content');
      expect(columns).toContain('summary');
      expect(columns).toContain('cover_image');
      expect(columns).toContain('status');
      expect(columns).toContain('is_top');
      expect(columns).toContain('view_count');
      expect(columns).toContain('like_count');
      expect(columns).toContain('category_id');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
      expect(columns).toContain('deleted_at');
    });

    it('should create blog_post_tag with composite primary key', async () => {
      await migration.up(queryRunner);

      const columns = await getTableColumns('blog_post_tag');
      expect(columns).toContain('post_id');
      expect(columns).toContain('tag_id');

      const indexes = await getTableIndexes('blog_post_tag');
      expect(indexes).toContain('PRIMARY');
    });

    it('should create indexes on blog_post', async () => {
      await migration.up(queryRunner);

      const indexes = await getTableIndexes('blog_post');

      expect(indexes).toContain('PRIMARY');
      expect(indexes).toContain('uk_post_slug');
      expect(indexes).toContain('idx_post_category');
      expect(indexes).toContain('idx_post_status');
      expect(indexes).toContain('idx_post_is_top');
      expect(indexes).toContain('idx_post_created_at');
    });

    it('should create indexes on blog_comment', async () => {
      await migration.up(queryRunner);

      const indexes = await getTableIndexes('blog_comment');

      expect(indexes).toContain('PRIMARY');
      expect(indexes).toContain('idx_comment_post');
      expect(indexes).toContain('idx_comment_parent');
      expect(indexes).toContain('idx_comment_status');
      expect(indexes).toContain('idx_comment_created_at');
    });

    it('should use utf8mb4 charset for blog tables', async () => {
      await migration.up(queryRunner);

      const rows = await queryRunner.query(
        `SELECT table_name, table_collation FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name LIKE 'blog_%'`,
      );

      expect(rows.length).toBe(6);
      for (const row of rows) {
        const collation = row.table_collation || row.TABLE_COLLATION;
        expect(collation).toContain('utf8mb4');
      }
    });

    it('should reject creating tables when blog_category already exists', async () => {
      await queryRunner.query(`
        CREATE TABLE \`blog_category\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(50) NOT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await expect(migration.up(queryRunner)).rejects.toThrow();
    });
  });

  describe('Migration down (drop tables)', () => {
    it('should drop all blog tables successfully', async () => {
      await migration.up(queryRunner);
      await migration.down(queryRunner);

      expect(await tableExists('blog_category')).toBe(false);
      expect(await tableExists('blog_tag')).toBe(false);
      expect(await tableExists('blog_post')).toBe(false);
      expect(await tableExists('blog_post_tag')).toBe(false);
      expect(await tableExists('blog_comment')).toBe(false);
      expect(await tableExists('blog_link')).toBe(false);
    });

    it('should handle dropping non-existent tables gracefully', async () => {
      // 确保表不存在
      await queryRunner.query('DROP TABLE IF EXISTS `blog_link`');
      await queryRunner.query('DROP TABLE IF EXISTS `blog_comment`');
      await queryRunner.query('DROP TABLE IF EXISTS `blog_post_tag`');
      await queryRunner.query('DROP TABLE IF EXISTS `blog_post`');
      await queryRunner.query('DROP TABLE IF EXISTS `blog_tag`');
      await queryRunner.query('DROP TABLE IF EXISTS `blog_category`');

      // 不应该抛出错误
      await expect(migration.down(queryRunner)).resolves.not.toThrow();
    });

    it('should drop tables in reverse dependency order', async () => {
      await migration.up(queryRunner);

      // 插入一些关联数据验证外键约束不会阻碍删除
      await queryRunner.query(`
        INSERT INTO \`blog_category\` (\`name\`, \`slug\`) VALUES ('Test', 'test')
      `);
      await queryRunner.query(`
        INSERT INTO \`blog_tag\` (\`name\`, \`slug\`) VALUES ('TestTag', 'test-tag')
      `);
      await queryRunner.query(`
        INSERT INTO \`blog_post\` (\`title\`, \`slug\`, \`content\`, \`category_id\`)
        VALUES ('Test Post', 'test-post', 'content', 1)
      `);
      await queryRunner.query(`
        INSERT INTO \`blog_post_tag\` (\`post_id\`, \`tag_id\`) VALUES (1, 1)
      `);
      await queryRunner.query(`
        INSERT INTO \`blog_comment\` (\`post_id\`, \`nickname\`, \`content\`)
        VALUES (1, 'Tester', 'Nice post')
      `);
      await queryRunner.query(`
        INSERT INTO \`blog_link\` (\`title\`, \`url\`) VALUES ('Test Link', 'https://example.com')
      `);

      // 有数据的情况下也应该能正常删除
      await expect(migration.down(queryRunner)).resolves.not.toThrow();

      expect(await tableExists('blog_link')).toBe(false);
      expect(await tableExists('blog_comment')).toBe(false);
      expect(await tableExists('blog_post_tag')).toBe(false);
      expect(await tableExists('blog_post')).toBe(false);
      expect(await tableExists('blog_tag')).toBe(false);
      expect(await tableExists('blog_category')).toBe(false);
    });
  });

  describe('Round-trip (up then down)', () => {
    it('should be idempotent: up then down then up should succeed', async () => {
      await migration.up(queryRunner);
      await migration.down(queryRunner);
      await migration.up(queryRunner);

      expect(await tableExists('blog_category')).toBe(true);
      expect(await tableExists('blog_post')).toBe(true);
      expect(await tableExists('blog_link')).toBe(true);

      const columns = await getTableColumns('blog_post');
      expect(columns).toContain('deleted_at');
    });
  });
});
