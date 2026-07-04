import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MagicWorkshopService } from '@src/modules/magic-workshop/magic-workshop.service';
import { CreateMagicItemCraftTaskInput } from './dto/create-magic-item-craft-task.input';
import { MagicItemCraftTaskModel } from './dto/magic-item-craft-task.model';
import type { MagicItemCraftTaskModel as MagicItemCraftTaskSnapshot } from '@app-types/models/magic-workshop/magic-workshop.types';

@Resolver(() => MagicItemCraftTaskModel)
export class MagicWorkshopResolver {
  constructor(private readonly service: MagicWorkshopService) {}

  @Mutation(() => MagicItemCraftTaskModel)
  async createMagicItemCraftTask(@Args('input') input: CreateMagicItemCraftTaskInput) {
    const task = await this.service.createTask({
      itemName: input.itemName,
      itemType: input.itemType,
      materialLevel: input.materialLevel,
      requestNote: input.requestNote,
    });
    return this.toModel(task);
  }

  @Query(() => MagicItemCraftTaskModel, { nullable: true })
  async magicItemCraftTask(@Args('id') id: string) {
    const task = await this.service.findOne(id);
    return task ? this.toModel(task) : null;
  }

  private toModel(entity: MagicItemCraftTaskSnapshot): MagicItemCraftTaskModel {
    return {
      id: entity.id,
      itemName: entity.itemName,
      itemType: entity.itemType,
      status: entity.status,
      qualityLevel: entity.qualityLevel,
      resultDescription: entity.resultDescription,
      failureReason: entity.failureReason,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
