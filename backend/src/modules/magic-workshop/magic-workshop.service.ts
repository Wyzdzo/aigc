import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MagicItemCraftTask } from './entities/magic-item-craft-task.entity';
import {
  TaskStatus,
  QualityLevel,
  ItemType,
} from '@app-types/models/magic-workshop/magic-workshop.types';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface CreateMagicItemCraftTaskParams {
  itemName: string;
  itemType: ItemType;
  materialLevel: number;
  requestNote?: string;
}

@Injectable()
export class MagicWorkshopService {
  constructor(
    @InjectRepository(MagicItemCraftTask)
    private taskRepository: Repository<MagicItemCraftTask>,
    @InjectQueue('magic-item-craft') private craftQueue: Queue,
  ) {}

  async createTask(input: CreateMagicItemCraftTaskParams): Promise<MagicItemCraftTask> {
    if (input.materialLevel < 1 || input.materialLevel > 5) {
      throw new Error('materialLevel must be between 1 and 5');
    }
    const task = this.taskRepository.create({
      ...input,
      status: TaskStatus.PENDING,
    });
    const saved = await this.taskRepository.save(task);
    await this.craftQueue.add('craft', { taskId: saved.id });
    return saved;
  }

  async findOne(id: string): Promise<MagicItemCraftTask | null> {
    return this.taskRepository.findOneBy({ id });
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    qualityLevel?: QualityLevel,
    resultDescription?: string,
    failureReason?: string,
  ): Promise<void> {
    await this.taskRepository.update(id, {
      status,
      qualityLevel,
      resultDescription,
      failureReason,
    });
  }
}
