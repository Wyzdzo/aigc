// src/usecases/blog/notification/notify-comment.usecase.ts

import { Inject, Injectable } from '@nestjs/common';
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
    @Inject('BLOG_SITE_NAME') private readonly siteName: string,
    @Inject('BLOG_SITE_URL') private readonly siteUrl: string,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(NotifyCommentUsecase.name);
  }

  /**
   * 通知博主有新评论
   */
  async notifyNewComment(input: NotifyNewCommentInput): Promise<void> {
    const emailInput: QueueEmailInput = {
      to: input.to,
      subject: generateNewCommentSubject(input.data, this.siteName),
      text: generateNewCommentText(input.data, this.siteName, this.siteUrl),
      html: generateNewCommentHtml(input.data, this.siteName, this.siteUrl),
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
    const emailInput: QueueEmailInput = {
      to: input.to,
      subject: generateReplySubject(input.data, this.siteName),
      text: generateReplyText(input.data, this.siteName, this.siteUrl),
      html: generateReplyHtml(input.data, this.siteName, this.siteUrl),
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
