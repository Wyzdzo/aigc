import { Field, InputType } from '@nestjs/graphql';
import { ItemType } from '../entities/magic-item-craft-task.entity';

@InputType()
export class CreateMagicItemCraftTaskInput {
  @Field()
  itemName!: string;

  @Field(() => ItemType)
  itemType!: ItemType;

  @Field()
  materialLevel!: number;

  @Field({ nullable: true })
  requestNote?: string;
}
