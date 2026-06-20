// src/adapters/api/seo/seo.module.ts

import { Module } from '@nestjs/common';
import { BlogModule } from '@src/modules/blog/blog.module';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({
  imports: [BlogModule.forRoot()],
  controllers: [SitemapController],
  providers: [SitemapService],
  exports: [SitemapService],
})
export class SeoModule {}
