import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MagicItemCraftTask,
  TaskStatus,
  QualityLevel,
} from './entities/magic-item-craft-task.entity';
import { CreateMagicItemCraftTaskInput } from './dto/create-magic-item-craft-task.input';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MagicWorkshopService {
  constructor(
    @InjectRepository(MagicItemCraftTask)
    private taskRepository: Repository<MagicItemCraftTask>,
    @InjectQueue('magic-item-craft') private craftQueue: Queue,
  ) {}

  async createTask(input: CreateMagicItemCraftTaskInput): Promise<MagicItemCraftTask> {
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
