// src/usecases/blog/blog-usecases.module.ts

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlogModule } from '@src/modules/blog/blog.module';
import { BlogUsecase } from './blog.usecase';
import { CommentNotificationUsecasesModule } from './notification';

@Module({
  imports: [BlogModule.forRoot(), CommentNotificationUsecasesModule],
  providers: [
    BlogUsecase,
    {
      provide: 'BLOG_SITE_URL',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<string>('blog.siteUrl') ?? 'https://example.com',
    },
    {
      provide: 'BLOG_OWNER_EMAIL',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<string>('blog.ownerEmail') ?? 'admin@example.com',
    },
  ],
  exports: [BlogUsecase],
})
export class BlogUsecasesModule {}