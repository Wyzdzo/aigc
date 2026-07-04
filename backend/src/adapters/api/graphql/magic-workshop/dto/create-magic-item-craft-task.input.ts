import { Field, InputType } from '@nestjs/graphql';
import { ItemType } from '@app-types/models/magic-workshop/magic-workshop.types';

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
