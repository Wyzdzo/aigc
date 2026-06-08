import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MagicWorkshopService } from './magic-workshop.service';
import { CreateMagicItemCraftTaskInput } from './dto/create-magic-item-craft-task.input';
import { MagicItemCraftTask } from './entities/magic-item-craft-task.entity';

@Resolver()
export class MagicWorkshopResolver {
  constructor(private readonly service: MagicWorkshopService) {}

  @Mutation(() => MagicItemCraftTask)
  async createMagicItemCraftTask(@Args('input') input: CreateMagicItemCraftTaskInput) {
    return this.service.createTask(input);
  }

  @Query(() => MagicItemCraftTask, { nullable: true })
  async magicItemCraftTask(@Args('id') id: string) {
    return this.service.findOne(id);
  }
}
