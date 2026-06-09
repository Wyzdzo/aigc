// src/modules/blog/entities/blog-post-tag.entity.ts
import { BlogPostTagModel } from '@app-types/models/blog/blog.types';
import { Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('blog_post_tag')
@Index('idx_post_tag_post', ['postId'])
@Index('idx_post_tag_tag', ['tagId'])
export class BlogPostTagEntity implements BlogPostTagModel {
  @PrimaryColumn({ name: 'post_id', type: 'int', comment: '文章ID' })
  postId!: number;

  @PrimaryColumn({ name: 'tag_id', type: 'int', comment: '标签ID' })
  tagId!: number;
}
