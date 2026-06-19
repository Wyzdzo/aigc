// src/modules/blog/entities/blog-link.entity.ts
import { BlogLinkModel, LinkStatus } from '@app-types/models/blog/blog.types';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blog_link')
@Index('idx_link_status', ['status'])
export class BlogLinkEntity implements BlogLinkModel {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'primary key' })
  id!: number;

  @Column({ type: 'varchar', length: 100, comment: '友链标题' })
  title!: string;

  @Column({ type: 'varchar', length: 500, comment: '友链URL' })
  url!: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '友链描述' })
  description!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: 'Logo URL' })
  logo!: string | null;

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序序号' })
  sortOrder!: number;

  @Column({
    type: 'enum',
    enum: LinkStatus,
    default: LinkStatus.ACTIVE,
    comment: '状态',
  })
  status!: LinkStatus;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt!: Date;
}
