// src/usecases/blog/notification/notify-comment.usecase.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailQueueService } from '@src/modules/common/email-queue/email-queue.service';
import { PinoLogger } from 'nestjs-pino';
import type { QueueEmailInput } from '@src/modules/common/email-queue/email-queue.types';

import type {
  CommentNotificationData,
  CommentReplyNotificationData,
} from './comment-notification.types';
import {
  generateNewCommentSubject,
  generateNewCommentText,
  generateNewCommentHtml,
  generateReplySubject,
  generateReplyText,
  generateReplyHtml,
} from './comment-notification.template';

export interface NotifyNewCommentInput {
  /** 博主邮箱 */
  to: string;
  /** 通知数据 */
  data: CommentNotificationData;
}

export interface NotifyCommentReplyInput {
  /** 被回复者邮箱 */
  to: string;
  /** 通知数据 */
  data: CommentReplyNotificationData;
}

@Injectable()
export class NotifyCommentUsecase {
  constructor(
    private readonly emailQueueService: EmailQueueService,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(NotifyCommentUsecase.name);
  }

  /**
   * 通知博主有新评论
   */
  async notifyNewComment(input: NotifyNewCommentInput): Promise<void> {
    const siteName = this.configService.get<string>('blog.siteName') ?? 'AIGC Blog';
    const siteUrl = this.configService.get<string>('blog.siteUrl') ?? 'https://example.com';

    const emailInput: QueueEmailInput = {
      to: input.to,
      subject: generateNewCommentSubject(input.data, siteName),
      text: generateNewCommentText(input.data, siteName, siteUrl),
      html: generateNewCommentHtml(input.data, siteName, siteUrl),
      dedupKey: `new-comment-${input.data.commentTime.getTime()}`,
    };

    try {
      await this.emailQueueService.enqueueSend(emailInput);
      this.logger.info(
        { to: input.to, postTitle: input.data.postTitle },
        'New comment notification queued',
      );
    } catch (error) {
      this.logger.error({ error, to: input.to }, 'Failed to queue new comment notification');
      // 通知失败不影响评论创建，静默处理
    }
  }

  /**
   * 通知用户有回复
   */
  async notifyCommentReply(input: NotifyCommentReplyInput): Promise<void> {
    const siteName = this.configService.get<string>('blog.siteName') ?? 'AIGC Blog';
    const siteUrl = this.configService.get<string>('blog.siteUrl') ?? 'https://example.com';

    const emailInput: QueueEmailInput = {
      to: input.to,
      subject: generateReplySubject(input.data, siteName),
      text: generateReplyText(input.data, siteName, siteUrl),
      html: generateReplyHtml(input.data, siteName, siteUrl),
      dedupKey: `comment-reply-${input.data.replyTime.getTime()}`,
    };

    try {
      await this.emailQueueService.enqueueSend(emailInput);
      this.logger.info(
        { to: input.to, replier: input.data.replierNickname },
        'Comment reply notification queued',
      );
    } catch (error) {
      this.logger.error({ error, to: input.to }, 'Failed to queue comment reply notification');
      // 通知失败不影响评论创建，静默处理
    }
  }
}
