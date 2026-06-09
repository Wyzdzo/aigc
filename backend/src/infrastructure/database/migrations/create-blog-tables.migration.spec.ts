import { CreateBlogTables1780918800000 } from './1780918800000-create-blog-tables.migration';

describe('CreateBlogTables1780918800000 Migration', () => {
  let migration: CreateBlogTables1780918800000;

  beforeEach(() => {
    migration = new CreateBlogTables1780918800000();
  });

  describe('Migration metadata', () => {
    it('should have correct migration name', () => {
      expect(migration.name).toBe('CreateBlogTables1780918800000');
    });

    it('should implement MigrationInterface', () => {
      expect(migration).toHaveProperty('up');
      expect(migration).toHaveProperty('down');
      expect(typeof migration.up).toBe('function');
      expect(typeof migration.down).toBe('function');
    });
  });

  describe('Table creation order', () => {
    it('should create tables in correct dependency order', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const queries = mockQueryRunner.query.mock.calls.map((call: any) => call[0]);

      const tableOrder = queries
        .filter((q: string) => q.includes('CREATE TABLE'))
        .map((q: string) => q.match(/CREATE TABLE `(\w+)`/)?.[1]);

      expect(tableOrder).toEqual([
        'blog_category',
        'blog_tag',
        'blog_post',
        'blog_post_tag',
        'blog_comment',
        'blog_link',
      ]);
    });
  });

  describe('Table structure validation', () => {
    it('should create blog_category table with correct structure', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const createTableQuery = mockQueryRunner.query.mock.calls.find((call: any) =>
        call[0].includes('CREATE TABLE `blog_category`'),
      )[0];

      expect(createTableQuery).toContain('`id` int NOT NULL AUTO_INCREMENT');
      expect(createTableQuery).toContain('`name` varchar(50)');
      expect(createTableQuery).toContain('`slug` varchar(100)');
      expect(createTableQuery).toContain('`parent_id` int DEFAULT NULL');
      expect(createTableQuery).toContain('`sort_order` int NOT NULL DEFAULT 0');
      expect(createTableQuery).toContain('`created_at` timestamp(3)');
      expect(createTableQuery).toContain('`updated_at` timestamp(3)');
      expect(createTableQuery).toContain('UNIQUE KEY `uk_category_slug`');
      expect(createTableQuery).toContain('KEY `idx_category_parent`');
    });

    it('should create blog_tag table with correct structure', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const createTableQuery = mockQueryRunner.query.mock.calls.find((call: any) =>
        call[0].includes('CREATE TABLE `blog_tag`'),
      )[0];

      expect(createTableQuery).toContain('`id` int NOT NULL AUTO_INCREMENT');
      expect(createTableQuery).toContain('`name` varchar(50)');
      expect(createTableQuery).toContain('`slug` varchar(100)');
      expect(createTableQuery).toContain('`created_at` timestamp(3)');
      expect(createTableQuery).toContain('UNIQUE KEY `uk_tag_slug`');
    });

    it('should create blog_post table with correct structure', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const createTableQuery = mockQueryRunner.query.mock.calls.find((call: any) =>
        call[0].includes('CREATE TABLE `blog_post`'),
      )[0];

      expect(createTableQuery).toContain('`id` int NOT NULL AUTO_INCREMENT');
      expect(createTableQuery).toContain('`title` varchar(200)');
      expect(createTableQuery).toContain('`slug` varchar(200)');
      expect(createTableQuery).toContain('`content` longtext');
      expect(createTableQuery).toContain('`status` enum');
      expect(createTableQuery).toContain('DRAFT');
      expect(createTableQuery).toContain('PUBLISHED');
      expect(createTableQuery).toContain('ARCHIVED');
      expect(createTableQuery).toContain('DELETED');
      expect(createTableQuery).toContain('`is_top` tinyint(1)');
      expect(createTableQuery).toContain('`view_count` int NOT NULL DEFAULT 0');
      expect(createTableQuery).toContain('`like_count` int NOT NULL DEFAULT 0');
      expect(createTableQuery).toContain('`category_id` int DEFAULT NULL');
      expect(createTableQuery).toContain('`deleted_at` timestamp(3) DEFAULT NULL');
      expect(createTableQuery).toContain('UNIQUE KEY `uk_post_slug`');
      expect(createTableQuery).toContain('KEY `idx_post_category`');
      expect(createTableQuery).toContain('KEY `idx_post_status`');
      expect(createTableQuery).toContain('KEY `idx_post_is_top`');
    });

    it('should create blog_post_tag table with correct structure', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const createTableQuery = mockQueryRunner.query.mock.calls.find((call: any) =>
        call[0].includes('CREATE TABLE `blog_post_tag`'),
      )[0];

      expect(createTableQuery).toContain('`post_id` int NOT NULL');
      expect(createTableQuery).toContain('`tag_id` int NOT NULL');
      expect(createTableQuery).toContain('PRIMARY KEY (`post_id`, `tag_id`)');
      expect(createTableQuery).toContain('KEY `idx_post_tag_post`');
      expect(createTableQuery).toContain('KEY `idx_post_tag_tag`');
    });

    it('should create blog_comment table with correct structure', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const createTableQuery = mockQueryRunner.query.mock.calls.find((call: any) =>
        call[0].includes('CREATE TABLE `blog_comment`'),
      )[0];

      expect(createTableQuery).toContain('`id` int NOT NULL AUTO_INCREMENT');
      expect(createTableQuery).toContain('`post_id` int NOT NULL');
      expect(createTableQuery).toContain('`parent_id` int DEFAULT NULL');
      expect(createTableQuery).toContain('`nickname` varchar(50)');
      expect(createTableQuery).toContain('`email` varchar(100)');
      expect(createTableQuery).toContain('`avatar` varchar(200)');
      expect(createTableQuery).toContain('`content` varchar(2000)');
      expect(createTableQuery).toContain('`status` enum');
      expect(createTableQuery).toContain('PENDING');
      expect(createTableQuery).toContain('APPROVED');
      expect(createTableQuery).toContain('REJECTED');
      expect(createTableQuery).toContain('DELETED');
      expect(createTableQuery).toContain('`like_count` int NOT NULL DEFAULT 0');
      expect(createTableQuery).toContain('KEY `idx_comment_post`');
      expect(createTableQuery).toContain('KEY `idx_comment_parent`');
      expect(createTableQuery).toContain('KEY `idx_comment_status`');
    });

    it('should create blog_link table with correct structure', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const createTableQuery = mockQueryRunner.query.mock.calls.find((call: any) =>
        call[0].includes('CREATE TABLE `blog_link`'),
      )[0];

      expect(createTableQuery).toContain('`id` int NOT NULL AUTO_INCREMENT');
      expect(createTableQuery).toContain('`title` varchar(100)');
      expect(createTableQuery).toContain('`url` varchar(500)');
      expect(createTableQuery).toContain('`description` varchar(500)');
      expect(createTableQuery).toContain('`logo` varchar(500)');
      expect(createTableQuery).toContain('`sort_order` int NOT NULL DEFAULT 0');
      expect(createTableQuery).toContain('`status` enum');
      expect(createTableQuery).toContain('ACTIVE');
      expect(createTableQuery).toContain('INACTIVE');
      expect(createTableQuery).toContain('KEY `idx_link_status`');
    });
  });

  describe('Rollback', () => {
    it('should drop tables in correct order', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.down(mockQueryRunner);

      const queries = mockQueryRunner.query.mock.calls.map((call: any) => call[0]);

      const tableOrder = queries
        .filter((q: string) => q.includes('DROP TABLE'))
        .map((q: string) => q.match(/DROP TABLE `(\w+)`/)?.[1]);

      expect(tableOrder).toEqual([
        'blog_link',
        'blog_comment',
        'blog_post_tag',
        'blog_post',
        'blog_tag',
        'blog_category',
      ]);
    });

    it('should drop all blog tables', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledTimes(6);

      const tables = mockQueryRunner.query.mock.calls.map(
        (call: any) => call[0].match(/DROP TABLE `(\w+)`/)?.[1],
      );

      expect(tables).toContain('blog_category');
      expect(tables).toContain('blog_tag');
      expect(tables).toContain('blog_post');
      expect(tables).toContain('blog_post_tag');
      expect(tables).toContain('blog_comment');
      expect(tables).toContain('blog_link');
    });
  });

  describe('Error handling', () => {
    it('should propagate query errors during up migration', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockRejectedValue(new Error('Database connection failed')),
      } as any;

      await expect(migration.up(mockQueryRunner)).rejects.toThrow('Database connection failed');
    });

    it('should propagate query errors during down migration', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockRejectedValue(new Error('Table does not exist')),
      } as any;

      await expect(migration.down(mockQueryRunner)).rejects.toThrow('Table does not exist');
    });

    it('should handle partial migration failure', async () => {
      const mockQueryRunner = {
        query: jest
          .fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockRejectedValueOnce(new Error('Foreign key constraint failed')),
      } as any;

      await expect(migration.up(mockQueryRunner)).rejects.toThrow('Foreign key constraint failed');

      expect(mockQueryRunner.query).toHaveBeenCalledTimes(3);
    });
  });

  describe('Character set and collation', () => {
    it('should use utf8mb4 character set for all tables', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const createTableQueries = mockQueryRunner.query.mock.calls
        .filter((call: any) => call[0].includes('CREATE TABLE'))
        .map((call: any) => call[0]);

      createTableQueries.forEach((query: string) => {
        expect(query).toContain('utf8mb4');
      });
    });

    it('should use unicode collation for blog tables', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const createTableQueries = mockQueryRunner.query.mock.calls
        .filter((call: any) => call[0].includes('CREATE TABLE `blog_'))
        .map((call: any) => call[0]);

      createTableQueries.forEach((query: string) => {
        expect(query).toContain('utf8mb4_unicode_ci');
      });
    });
  });

  describe('Index and constraint validation', () => {
    it('should create all required indexes', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const queries = mockQueryRunner.query.mock.calls.map((call: any) => call[0]);

      expect(queries.some((q: string) => q.includes('uk_category_slug'))).toBe(true);
      expect(queries.some((q: string) => q.includes('uk_tag_slug'))).toBe(true);
      expect(queries.some((q: string) => q.includes('uk_post_slug'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_category_parent'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_post_category'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_post_status'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_post_is_top'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_post_created_at'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_post_tag_post'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_post_tag_tag'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_comment_post'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_comment_parent'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_comment_status'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_comment_created_at'))).toBe(true);
      expect(queries.some((q: string) => q.includes('idx_link_status'))).toBe(true);
    });

    it('should create composite primary key for blog_post_tag', async () => {
      const mockQueryRunner = {
        query: jest.fn().mockResolvedValue(undefined),
      } as any;

      await migration.up(mockQueryRunner);

      const createTableQuery = mockQueryRunner.query.mock.calls.find((call: any) =>
        call[0].includes('CREATE TABLE `blog_post_tag`'),
      )[0];

      expect(createTableQuery).toContain('PRIMARY KEY (`post_id`, `tag_id`)');
    });
  });
});
