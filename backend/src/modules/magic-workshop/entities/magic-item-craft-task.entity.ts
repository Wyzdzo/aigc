import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum TaskStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export enum ItemType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  TOOL = 'TOOL',
  TOY = 'TOY',
}

export enum QualityLevel {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

registerEnumType(TaskStatus, { name: 'TaskStatus' });
registerEnumType(ItemType, { name: 'ItemType' });
registerEnumType(QualityLevel, { name: 'QualityLevel' });

@Entity('magic_item_craft_tasks')
@ObjectType()
export class MagicItemCraftTask {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id!: string;

  @Column()
  @Field()
  itemName!: string;

  @Column({ type: 'enum', enum: ItemType })
  @Field(() => ItemType)
  itemType!: ItemType;

  @Column({ type: 'int' })
  @Field()
  materialLevel!: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  requestNote?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  @Field(() => TaskStatus)
  status!: TaskStatus;

  @Column({ type: 'enum', enum: QualityLevel, nullable: true })
  @Field(() => QualityLevel, { nullable: true })
  qualityLevel?: QualityLevel;

  @Column({ nullable: true })
  @Field({ nullable: true })
  resultDescription?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  failureReason?: string;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;
}
