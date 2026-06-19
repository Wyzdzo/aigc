// src/modules/blog/entities/blog-post.entity.ts
import { BlogPostModel, PostStatus } from '@app-types/models/blog/blog.types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blog_post')
@Index('uk_post_slug', ['slug'], { unique: true })
@Index('idx_post_category', ['categoryId'])
@Index('idx_post_status', ['status'])
@Index('idx_post_is_top', ['isTop'])
export class BlogPostEntity implements BlogPostModel {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'primary key' })
  id!: number;

  @Column({ type: 'varchar', length: 200, comment: '文章标题' })
  title!: string;

  @Column({ type: 'varchar', length: 200, comment: 'URL别名' })
  slug!: string;

  @Column({ type: 'longtext', comment: '文章内容（Markdown）' })
  content!: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '文章摘要' })
  summary!: string | null;

  @Column({
    name: 'cover_image',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '封面图片URL',
  })
  coverImage!: string | null;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
    comment: '文章状态',
  })
  status!: PostStatus;

  @Column({ name: 'is_top', type: 'tinyint', default: 0, comment: '是否置顶' })
  isTop!: boolean;

  @Column({ name: 'view_count', type: 'int', default: 0, comment: '阅读次数' })
  viewCount!: number;

  @Column({ name: 'like_count', type: 'int', default: 0, comment: '点赞次数' })
  likeCount!: number;

  @Column({ name: 'category_id', type: 'int', nullable: true, comment: '分类ID' })
  categoryId!: number | null;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    precision: 3,
    nullable: true,
    comment: '删除时间',
  })
  deletedAt!: Date | null;
}
