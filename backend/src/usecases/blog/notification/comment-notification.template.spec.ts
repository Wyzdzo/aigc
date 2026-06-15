// src/usecases/blog/notification/comment-notification.template.spec.ts
import {
  generateNewCommentSubject,
  generateNewCommentText,
  generateNewCommentHtml,
  generateReplySubject,
  generateReplyText,
  generateReplyHtml,
} from './comment-notification.template';
import type { CommentNotificationData, CommentReplyNotificationData } from './comment-notification.types';

describe('Comment Notification Templates', () => {
  const siteName = 'Test Blog';
  const siteUrl = 'https://test-blog.com';

  describe('New Comment Notifications', () => {
    const testData: CommentNotificationData = {
      postTitle: 'Test Post',
      postUrl: 'https://test-blog.com/blog/test-post',
      commenterNickname: 'Test User',
      commentContent: 'This is a test comment',
      commentTime: new Date('2024-01-01T12:00:00Z'),
    };

    it('should generate correct subject for new comment', () => {
      const subject = generateNewCommentSubject(testData, siteName);
      expect(subject).toBe('[Test Blog] 您有新评论：Test Post');
    });

    it('should generate correct plain text content for new comment', () => {
      const text = generateNewCommentText(testData, siteName, siteUrl);
      expect(text).toContain('您的文章「Test Post」收到了一条新评论');
      expect(text).toContain('评论者：Test User');
      expect(text).toContain('评论内容：This is a test comment');
      expect(text).toContain('查看详情：https://test-blog.com/blog/test-post');
    });

    it('should generate correct HTML content for new comment', () => {
      const html = generateNewCommentHtml(testData, siteName, siteUrl);
      expect(html).toContain('<h2 style');
      expect(html).toContain('您有新评论');
      expect(html).toContain('Test User');
      expect(html).toContain('This is a test comment');
    });

    it('should escape HTML in new comment content', () => {
      const dataWithHtml: CommentNotificationData = {
        ...testData,
        commentContent: '<script>alert("XSS")</script>',
        commenterNickname: 'User <script>',
      };
      const html = generateNewCommentHtml(dataWithHtml, siteName, siteUrl);
      expect(html).not.toMatch(/<script[^>]*>/);
      expect(html).toContain('&lt;script&gt;');
    });
  });

  describe('Reply Notifications', () => {
    const testData: CommentReplyNotificationData = {
      replyToNickname: 'Original User',
      postTitle: 'Test Post',
      postUrl: 'https://test-blog.com/blog/test-post',
      replierNickname: 'Reply User',
      replyContent: 'This is a reply',
      replyTime: new Date('2024-01-02T10:00:00Z'),
    };

    it('should generate correct subject for reply', () => {
      const subject = generateReplySubject(testData, siteName);
      expect(subject).toBe('[Test Blog] Reply User 回复了您的评论');
    });

    it('should generate correct plain text content for reply', () => {
      const text = generateReplyText(testData, siteName, siteUrl);
      expect(text).toContain('您好，Original User！');
      expect(text).toContain('Reply User 在「Test Post」中回复了您的评论');
      expect(text).toContain('回复内容：This is a reply');
      expect(text).toContain('查看详情：https://test-blog.com/blog/test-post');
    });

    it('should generate correct HTML content for reply', () => {
      const html = generateReplyHtml(testData, siteName, siteUrl);
      expect(html).toContain('<h2 style');
      expect(html).toContain('您收到了一条回复');
      expect(html).toContain('Reply User');
      expect(html).toContain('Original User');
    });

    it('should escape HTML in reply content', () => {
      const dataWithHtml: CommentReplyNotificationData = {
        ...testData,
        replyContent: '<script>alert("XSS")</script>',
        replierNickname: 'User <script>',
      };
      const html = generateReplyHtml(dataWithHtml, siteName, siteUrl);
      expect(html).not.toMatch(/<script[^>]*>/);
      expect(html).toContain('&lt;script&gt;');
    });
  });
});
