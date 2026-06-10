// src/usecases/blog/blog-usecases.module.ts
import { Module } from '@nestjs/common';
import { BlogModule } from '@src/modules/blog/blog.module';
import { BlogUsecase } from './blog.usecase';

@Module({
  imports: [BlogModule.forRoot()],
  providers: [BlogUsecase],
  exports: [BlogUsecase],
})
export class BlogUsecasesModule {}