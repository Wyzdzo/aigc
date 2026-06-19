// src/modules/settings/entities/site-setting.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SettingType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

@Entity('site_setting')
@Index('idx_group_name', ['groupName'])
export class SiteSettingEntity {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'primary key' })
  id!: number;

  @Column({ name: 'setting_key', type: 'varchar', length: 100, unique: true, comment: '设置键' })
  settingKey!: string;

  @Column({ name: 'setting_value', type: 'text', nullable: true, comment: '设置值' })
  settingValue!: string | null;

  @Column({
    name: 'setting_type',
    type: 'enum',
    enum: SettingType,
    default: SettingType.STRING,
    comment: '设置类型',
  })
  settingType!: SettingType;

  @Column({ name: 'display_name', type: 'varchar', length: 100, nullable: true, comment: '显示名称' })
  displayName!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '描述' })
  description!: string | null;

  @Column({ name: 'group_name', type: 'varchar', length: 50, default: 'general', comment: '分组名称' })
  groupName!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序序号' })
  sortOrder!: number;

  @Column({ name: 'is_public', type: 'tinyint', default: 1, comment: '是否公开' })
  isPublic!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
