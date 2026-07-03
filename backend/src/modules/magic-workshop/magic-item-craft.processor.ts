import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MagicWorkshopService } from './magic-workshop.service';
import { TaskStatus, QualityLevel } from './entities/magic-item-craft-task.entity';

@Processor('magic-item-craft')
export class MagicItemCraftProcessor {
  constructor(private readonly service: MagicWorkshopService) {}

  @Process('craft')
  async handleCraft(job: Job<{ taskId: string }>) {
    const { taskId } = job.data;
    try {
      const task = await this.service.findOne(taskId);
      if (!task) throw new Error('Task not found');

      // 模拟异步加工延迟
      await new Promise((resolve) => setTimeout(resolve, 5000));

      let quality: QualityLevel;
      if (task.materialLevel >= 5) quality = QualityLevel.LEGENDARY;
      else if (task.materialLevel >= 4) quality = QualityLevel.EPIC;
      else if (task.materialLevel >= 3) quality = QualityLevel.RARE;
      else quality = QualityLevel.COMMON;

      const description = `成功制作了${quality}品质的「${task.itemName}」。`;
      await this.service.updateTaskStatus(taskId, TaskStatus.SUCCEEDED, quality, description);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.service.updateTaskStatus(taskId, TaskStatus.FAILED, undefined, undefined, message);
    }
  }
}
