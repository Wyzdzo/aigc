// test/12-media-service/media-service.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { initGraphQLSchema } from '../../src/adapters/api/graphql/schema/schema.init';
import { ApiModule } from '../../src/bootstraps/api/api.module';
import { MediaEntity } from '@src/modules/media/entities/media.entity';
import { login } from '../utils/e2e-graphql-utils';
import { cleanupTestAccounts, seedTestAccounts, testAccountsConfig } from '../utils/test-accounts';

describe('Media Service E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;

  beforeAll(async () => {
    initGraphQLSchema();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();

    // 创建测试账号并登录获取 token
    await seedTestAccounts({ dataSource });
    adminToken = await login({
      app,
      loginName: testAccountsConfig.admin.loginName,
      loginPassword: testAccountsConfig.admin.loginPassword,
    });
  }, 30000);

  afterAll(async () => {
    await dataSource.getRepository(MediaEntity).delete({});
    await cleanupTestAccounts(dataSource);
    await app.close();
  });

  // 测试数据清理
  const cleanupMediaData = async () => {
    await dataSource.getRepository(MediaEntity).delete({});
  };

  beforeEach(async () => {
    await cleanupMediaData();
  });

  afterEach(async () => {
    await cleanupMediaData();
  });

  describe('Media Query Operations', () => {
    it('should query empty media list', async () => {
      const queryMediaList = `
        query {
          mediaList(page: 1, pageSize: 10) {
            items {
              id
              filename
              originalName
              mimeType
              size
              url
              width
              height
            }
            total
            page
            pageSize
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ query: queryMediaList })
        .expect(200);

      expect(response.body.data.mediaList).toBeDefined();
      expect(response.body.data.mediaList.items).toEqual([]);
      expect(response.body.data.mediaList.total).toBe(0);
      expect(response.body.data.mediaList.page).toBe(1);
      expect(response.body.data.mediaList.pageSize).toBe(10);
    });

    it('should query media list with pagination', async () => {
      // 通过仓库直接插入测试数据
      const mediaRepo = dataSource.getRepository(MediaEntity);
      for (let i = 1; i <= 15; i++) {
        await mediaRepo.save({
          filename: `file-${i}.jpg`,
          originalName: `original-${i}.jpg`,
          mimeType: 'image/jpeg',
          size: 1024 * i,
          url: `/uploads/file-${i}.jpg`,
          width: 800,
          height: 600,
        });
      }

      // 查询第一页
      const queryFirstPage = `
        query {
          mediaList(page: 1, pageSize: 10) {
            items {
              id
              filename
              originalName
            }
            total
            page
            pageSize
          }
        }
      `;

      const firstPageResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ query: queryFirstPage })
        .expect(200);

      expect(firstPageResponse.body.data.mediaList.items.length).toBe(10);
      expect(firstPageResponse.body.data.mediaList.total).toBe(15);
      expect(firstPageResponse.body.data.mediaList.page).toBe(1);
      expect(firstPageResponse.body.data.mediaList.pageSize).toBe(10);

      // 查询第二页
      const querySecondPage = `
        query {
          mediaList(page: 2, pageSize: 10) {
            items {
              id
              filename
            }
            total
            page
            pageSize
          }
        }
      `;

      const secondPageResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ query: querySecondPage })
        .expect(200);

      expect(secondPageResponse.body.data.mediaList.items.length).toBe(5);
      expect(secondPageResponse.body.data.mediaList.total).toBe(15);
      expect(secondPageResponse.body.data.mediaList.page).toBe(2);
    });
  });
});
