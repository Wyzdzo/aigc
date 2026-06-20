// test/10-seo/sitemap.e2e-spec.ts

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiModule } from '@src/bootstraps/api/api.module';
import request from 'supertest';
import { initGraphQLSchema } from '../../src/adapters/api/graphql/schema/schema.init';

describe('Sitemap (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    initGraphQLSchema();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /sitemap.xml', () => {
    it('should return XML content type', async () => {
      const response = await request(app.getHttpServer()).get('/sitemap.xml');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/xml');
    });

    it('should return valid XML structure', async () => {
      const response = await request(app.getHttpServer()).get('/sitemap.xml');

      expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(response.text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(response.text).toContain('</urlset>');
    });

    it('should contain static page URLs', async () => {
      const response = await request(app.getHttpServer()).get('/sitemap.xml');

      expect(response.text).toContain('/blog');
      expect(response.text).toContain('/blog/archives');
      expect(response.text).toContain('/blog/categories');
      expect(response.text).toContain('/blog/tags');
    });

    it('should contain changefreq and priority for each URL', async () => {
      const response = await request(app.getHttpServer()).get('/sitemap.xml');

      expect(response.text).toContain('<changefreq>');
      expect(response.text).toContain('<priority>');
    });

    it('should handle empty database gracefully', async () => {
      const response = await request(app.getHttpServer()).get('/sitemap.xml');

      expect(response.status).toBe(200);
      expect(response.text).toMatch(/<urlset.*>[\s\S]*<\/urlset>/);
    });
  });
});
