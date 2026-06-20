// src/adapters/api/seo/sitemap.resolver.ts

import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { SitemapService } from './sitemap.service';

@Controller('sitemap.xml')
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get()
  @Header('Content-Type', 'application/xml')
  async getSitemap(@Res() res: Response) {
    const xml = await this.sitemapService.generateSitemapXml();
    res.send(xml);
  }
}
