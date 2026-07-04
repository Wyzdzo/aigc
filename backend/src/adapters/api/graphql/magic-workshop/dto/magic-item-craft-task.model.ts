import { Field, ObjectType } from '@nestjs/graphql';
import {
  TaskStatus,
  QualityLevel,
  ItemType,
} from '@app-types/models/magic-workshop/magic-workshop.types';

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
