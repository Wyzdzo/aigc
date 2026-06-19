// src/modules/blog/entities/blog-tag.entity.ts
import { BlogTagModel } from '@app-types/models/blog/blog.types';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blog_tag')
@Index('uk_tag_slug', ['slug'], { unique: true })
export class BlogTagEntity implements BlogTagModel {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'primary key' })
  id!: number;

  @Column({ type: 'varchar', length: 50, comment: '标签名称' })
  name!: string;

  @Column({ type: 'varchar', length: 100, comment: 'URL别名' })
  slug!: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt!: Date;
}
