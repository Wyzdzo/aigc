// src/modules/blog/entities/blog-category.entity.ts
import { BlogCategoryModel } from '@app-types/models/blog/blog.types';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blog_category')
@Index('uk_category_slug', ['slug'], { unique: true })
export class BlogCategoryEntity implements BlogCategoryModel {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'primary key' })
  id!: number;

  @Column({ type: 'varchar', length: 50, comment: '分类名称' })
  name!: string;

  @Column({ type: 'varchar', length: 100, comment: 'URL别名' })
  slug!: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '分类描述' })
  description!: string | null;

  @Column({ name: 'parent_id', type: 'int', nullable: true, comment: '父分类ID' })
  parentId!: number | null;

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序序号' })
  sortOrder!: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt!: Date;
}
