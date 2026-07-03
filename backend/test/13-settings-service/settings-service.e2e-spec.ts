// test/13-settings-service/settings-service.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { initGraphQLSchema } from '../../src/adapters/api/graphql/schema/schema.init';
import { ApiModule } from '../../src/bootstraps/api/api.module';
import { login } from '../utils/e2e-graphql-utils';
import { cleanupTestAccounts, seedTestAccounts, testAccountsConfig } from '../utils/test-accounts';

describe('Settings Service E2E', () => {
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

    // 创建测试账号并登录获取 admin token
    await seedTestAccounts({ dataSource });
    adminToken = await login({
      app,
      loginName: testAccountsConfig.admin.loginName,
      loginPassword: testAccountsConfig.admin.loginPassword,
    });
  }, 30000);

  afterAll(async () => {
    await cleanupTestAccounts(dataSource);
    await app.close();
  });

  it('should query settings', async () => {
    const settingsQuery = `
      query {
        settings {
          siteSettings {
            key
            value
            displayName
            groupName
          }
          bloggerInfo {
            nickname
            avatar
            bio
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: settingsQuery })
      .expect(200);

    expect(response.body.data.settings).toBeDefined();
    expect(Array.isArray(response.body.data.settings.siteSettings)).toBe(true);
  });

  it('should update site settings', async () => {
    // 先查询当前设置
    const settingsQuery = `
      query {
        settings {
          siteSettings {
            key
            value
          }
        }
      }
    `;

    const beforeResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: settingsQuery })
      .expect(200);

    expect(beforeResponse.body.data.settings).toBeDefined();

    // 更新设置
    const updateMutation = `
      mutation {
        updateSiteSettings(input: {
          siteName: "E2E Test Site",
          siteDescription: "E2E Test Description",
          perPage: 15,
          allowComment: true
        })
      }
    `;

    const updateResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: updateMutation })
      .expect(200);

    expect(updateResponse.body.data.updateSiteSettings).toBe(true);

    // 验证设置已更新
    const afterResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: settingsQuery })
      .expect(200);

    const siteSettings = afterResponse.body.data.settings.siteSettings;
    const siteNameSetting = siteSettings.find((s: { key: string }) => s.key === 'site_name');
    expect(siteNameSetting.value).toBe('E2E Test Site');
  });

  it('should query blogger info', async () => {
    const settingsQuery = `
      query {
        settings {
          bloggerInfo {
            nickname
            avatar
            bio
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: settingsQuery })
      .expect(200);

    // bloggerInfo 可能为 null 或包含数据
    expect(response.body.data.settings).toBeDefined();
    if (response.body.data.settings.bloggerInfo !== null) {
      expect(response.body.data.settings.bloggerInfo).toHaveProperty('nickname');
      expect(response.body.data.settings.bloggerInfo).toHaveProperty('avatar');
      expect(response.body.data.settings.bloggerInfo).toHaveProperty('bio');
    }
  });
});
