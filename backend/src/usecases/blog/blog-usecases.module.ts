// src/usecases/blog/blog-usecases.module.ts

import { Module } from '@nestjs/common';
import { BlogModule } from '@src/modules/blog/blog.module';
import { BlogUsecase } from './blog.usecase';
import { CommentNotificationUsecasesModule } from './notification';

@Module({
  imports: [BlogModule.forRoot(), CommentNotificationUsecasesModule],
  providers: [BlogUsecase],
  exports: [BlogUsecase],
})
export class BlogUsecasesModule {}
