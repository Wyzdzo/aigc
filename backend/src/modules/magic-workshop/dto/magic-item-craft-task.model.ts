import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TaskStatus, QualityLevel, ItemType } from '../entities/magic-item-craft-task.entity';

registerEnumType(TaskStatus, { name: 'TaskStatus' });
registerEnumType(QualityLevel, { name: 'QualityLevel' });
registerEnumType(ItemType, { name: 'ItemType' });

@ObjectType()
export class MagicItemCraftTaskModel {
  @Field()
  id!: string;

  @Field()
  itemName!: string;

  @Field(() => ItemType)
  itemType!: ItemType;

  @Field(() => TaskStatus)
  status!: TaskStatus;

  @Field(() => QualityLevel, { nullable: true })
  qualityLevel?: QualityLevel;

  @Field({ nullable: true })
  resultDescription?: string;

  @Field({ nullable: true })
  failureReason?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
