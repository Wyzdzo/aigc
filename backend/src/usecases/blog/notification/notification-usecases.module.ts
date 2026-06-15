// src/usecases/blog/notification/notification-usecases.module.ts

import { Module } from '@nestjs/common';
import { BlogModule } from '@src/modules/blog/blog.module';
import { EmailQueueModule } from '@src/modules/common/email-queue/email-queue.module';
import { NotifyCommentUsecase } from './notify-comment.usecase';

@Module({
  imports: [BlogModule.forRoot(), EmailQueueModule],
  providers: [NotifyCommentUsecase],
  exports: [NotifyCommentUsecase],
})
export class CommentNotificationUsecasesModule {}
