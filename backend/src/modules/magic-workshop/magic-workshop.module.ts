import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { MagicItemCraftTask } from './entities/magic-item-craft-task.entity';
import { MagicWorkshopService } from './magic-workshop.service';
import { MagicWorkshopResolver } from './magic-workshop.resolver';
import { MagicItemCraftProcessor } from './magic-item-craft.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([MagicItemCraftTask]),
    BullModule.registerQueue({ name: 'magic-item-craft' }),
  ],
  providers: [MagicWorkshopService, MagicWorkshopResolver, MagicItemCraftProcessor],
})
export class MagicWorkshopModule {}
