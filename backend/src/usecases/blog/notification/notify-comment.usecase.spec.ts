// src/usecases/blog/notification/notify-comment.usecase.spec.ts

import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { EmailQueueService } from '@src/modules/common/email-queue/email-queue.service';

import { NotifyCommentUsecase } from './notify-comment.usecase';
import type { NotifyNewCommentInput, NotifyCommentReplyInput } from './notify-comment.usecase';
import type {
  CommentNotificationData,
  CommentReplyNotificationData,
} from './comment-notification.types';

describe('NotifyCommentUsecase', () => {
  let usecase: NotifyCommentUsecase;
  let emailQueueService: { enqueueSend: jest.Mock };

  const siteName = 'Test Blog';
  const siteUrl = 'https://test-blog.com';

  const mockLogger = {
    setContext: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    emailQueueService = { enqueueSend: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        NotifyCommentUsecase,
        { provide: EmailQueueService, useValue: emailQueueService },
        { provide: 'BLOG_SITE_NAME', useValue: siteName },
        { provide: 'BLOG_SITE_URL', useValue: siteUrl },
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    usecase = module.get(NotifyCommentUsecase);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('notifyNewComment', () => {
    const commentTime = new Date('2024-01-01T12:00:00Z');
    const data: CommentNotificationData = {
      postTitle: 'Test Post',
      postUrl: 'https://test-blog.com/blog/test-post',
      commenterNickname: 'Test User',
      commentContent: 'This is a test comment',
      commentTime,
    };
    const input: NotifyNewCommentInput = {
      to: 'owner@test-blog.com',
      data,
    };

    it('should queue email successfully', async () => {
      emailQueueService.enqueueSend.mockResolvedValue({ jobId: 'job-1', traceId: 'trace-1' });

      await usecase.notifyNewComment(input);

      expect(emailQueueService.enqueueSend).toHaveBeenCalledTimes(1);
      const emailInput = emailQueueService.enqueueSend.mock.calls[0][0];
      expect(emailInput.to).toBe('owner@test-blog.com');
      expect(emailInput.subject).toBe('[Test Blog] 您有新评论：Test Post');
      expect(emailInput.text).toContain('您的文章「Test Post」收到了一条新评论');
      expect(emailInput.html).toContain('您有新评论');
      expect(emailInput.dedupKey).toBe(`new-comment-${commentTime.getTime()}`);

      expect(mockLogger.info).toHaveBeenCalledWith(
        { to: input.to, postTitle: data.postTitle },
        'New comment notification queued',
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should silently handle queue failure', async () => {
      const error = new Error('Queue connection failed');
      emailQueueService.enqueueSend.mockRejectedValue(error);

      await usecase.notifyNewComment(input);

      expect(emailQueueService.enqueueSend).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        { error, to: input.to },
        'Failed to queue new comment notification',
      );
      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });

  describe('notifyCommentReply', () => {
    const replyTime = new Date('2024-01-02T10:00:00Z');
    const data: CommentReplyNotificationData = {
      replyToNickname: 'Original User',
      postTitle: 'Test Post',
      postUrl: 'https://test-blog.com/blog/test-post',
      replierNickname: 'Reply User',
      replyContent: 'This is a reply',
      replyTime,
    };
    const input: NotifyCommentReplyInput = {
      to: 'original@test-blog.com',
      data,
    };

    it('should queue email successfully', async () => {
      emailQueueService.enqueueSend.mockResolvedValue({ jobId: 'job-2', traceId: 'trace-2' });

      await usecase.notifyCommentReply(input);

      expect(emailQueueService.enqueueSend).toHaveBeenCalledTimes(1);
      const emailInput = emailQueueService.enqueueSend.mock.calls[0][0];
      expect(emailInput.to).toBe('original@test-blog.com');
      expect(emailInput.subject).toBe('[Test Blog] Reply User 回复了您的评论');
      expect(emailInput.text).toContain('Reply User 在「Test Post」中回复了您的评论');
      expect(emailInput.html).toContain('您收到了一条回复');
      expect(emailInput.dedupKey).toBe(`comment-reply-${replyTime.getTime()}`);

      expect(mockLogger.info).toHaveBeenCalledWith(
        { to: input.to, replier: data.replierNickname },
        'Comment reply notification queued',
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should silently handle queue failure', async () => {
      const error = new Error('Queue connection failed');
      emailQueueService.enqueueSend.mockRejectedValue(error);

      await usecase.notifyCommentReply(input);

      expect(emailQueueService.enqueueSend).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        { error, to: input.to },
        'Failed to queue comment reply notification',
      );
      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });
});
