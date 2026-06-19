// src/modules/media/entities/media.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('media')
export class MediaEntity {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'primary key' })
  id!: number;

  @Column({ type: 'varchar', length: 500, comment: '存储文件名' })
  filename!: string;

  @Column({ type: 'varchar', length: 500, comment: '原始文件名' })
  originalName!: string;

  @Column({ type: 'varchar', length: 100, comment: 'MIME类型' })
  mimeType!: string;

  @Column({ type: 'int', comment: '文件大小（字节）' })
  size!: number;

  @Column({ type: 'varchar', length: 500, comment: '访问URL' })
  url!: string;

  @Column({ type: 'int', default: 0, comment: '图片宽度' })
  width!: number;

  @Column({ type: 'int', default: 0, comment: '图片高度' })
  height!: number;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt!: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt!: Date;
}
