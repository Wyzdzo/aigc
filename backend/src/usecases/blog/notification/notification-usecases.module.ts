// src/usecases/blog/notification/notification-usecases.module.ts

import { Module } from '@nestjs/common';
import { EmailQueueModule } from '@src/modules/common/email-queue/email-queue.module';
import { NotifyCommentUsecase } from './notify-comment.usecase';

@Module({
  imports: [EmailQueueModule],
  providers: [NotifyCommentUsecase],
  exports: [NotifyCommentUsecase],
})
export class CommentNotificationUsecasesModule {}
