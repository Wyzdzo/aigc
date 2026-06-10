// src/modules/blog/blog.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogCommentEntity } from './entities/blog-comment.entity';
import { BlogLinkEntity } from './entities/blog-link.entity';
import { BlogPostEntity } from './entities/blog-post.entity';
import { BlogPostTagEntity } from './entities/blog-post-tag.entity';
import { BlogTagEntity } from './entities/blog-tag.entity';
import { BlogService } from './blog.service';
import { BlogQueryService } from './queries/blog.query.service';

@Module({})
export class BlogModule {
  static forRoot(): DynamicModule {
    return {
      module: BlogModule,
      imports: [
        TypeOrmModule.forFeature([
          BlogPostEntity,
          BlogCategoryEntity,
          BlogTagEntity,
          BlogPostTagEntity,
          BlogCommentEntity,
          BlogLinkEntity,
        ]),
      ],
      providers: [BlogService, BlogQueryService],
      exports: [TypeOrmModule, BlogService, BlogQueryService],
    };
  }
}