import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  TaskStatus,
  ItemType,
  QualityLevel,
} from '@app-types/models/magic-workshop/magic-workshop.types';

export { TaskStatus, ItemType, QualityLevel };

@Entity('magic_item_craft_tasks')
export class MagicItemCraftTask {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  itemName!: string;

  @Column({ type: 'enum', enum: ItemType })
  itemType!: ItemType;

  @Column({ type: 'int' })
  materialLevel!: number;

  @Column({ nullable: true })
  requestNote?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status!: TaskStatus;

  @Column({ type: 'enum', enum: QualityLevel, nullable: true })
  qualityLevel?: QualityLevel;

  @Column({ nullable: true })
  resultDescription?: string;

  @Column({ nullable: true })
  failureReason?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
