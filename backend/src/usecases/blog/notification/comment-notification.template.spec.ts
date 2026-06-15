// src/usecases/blog/notification/comment-notification.template.spec.ts
import {
  generateNewCommentSubject,
  generateNewCommentText,
  generateNewCommentHtml,
  generateReplySubject,
  generateReplyText,
  generateReplyHtml,
} from './comment-notification.template';
import type {
  CommentNotificationData,
  CommentReplyNotificationData,
} from './comment-notification.types';

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

    describe('XSS Protection - New Comment', () => {
      it('should escape <script> tag in comment content', () => {
        const dataWithHtml: CommentNotificationData = {
          ...testData,
          commentContent: '<script>alert("XSS")</script>',
        };
        const html = generateNewCommentHtml(dataWithHtml, siteName, siteUrl);
        expect(html).not.toMatch(/<script[^>]*>/);
        expect(html).toContain('&lt;script&gt;');
      });

      it('should escape <script> tag in nickname', () => {
        const dataWithHtml: CommentNotificationData = {
          ...testData,
          commenterNickname: 'User<script>alert("XSS")</script>',
        };
        const html = generateNewCommentHtml(dataWithHtml, siteName, siteUrl);
        expect(html).not.toMatch(/<script[^>]*>/);
        expect(html).toContain('&lt;script&gt;');
      });

      it('should escape <script> tag in post title', () => {
        const dataWithHtml: CommentNotificationData = {
          ...testData,
          postTitle: '<script>document.cookie</script>',
        };
        const html = generateNewCommentHtml(dataWithHtml, siteName, siteUrl);
        expect(html).not.toMatch(/<script[^>]*>/);
        expect(html).toContain('&lt;script&gt;');
      });

      it('should escape & character', () => {
        const dataWithHtml: CommentNotificationData = {
          ...testData,
          commentContent: 'Tom & Jerry',
        };
        const html = generateNewCommentHtml(dataWithHtml, siteName, siteUrl);
        expect(html).toContain('&amp;');
        expect(html).not.toContain('>Tom & Jerry<');
      });

      it('should escape " character (double quote)', () => {
        const dataWithHtml: CommentNotificationData = {
          ...testData,
          commentContent: 'Say "Hello" to everyone',
        };
        const html = generateNewCommentHtml(dataWithHtml, siteName, siteUrl);
        expect(html).toContain('&quot;');
      });

      it("should escape ' character (single quote)", () => {
        const dataWithHtml: CommentNotificationData = {
          ...testData,
          commentContent: "It's a beautiful day",
        };
        const html = generateNewCommentHtml(dataWithHtml, siteName, siteUrl);
        expect(html).toContain('&#39;');
      });

      it('should escape < and > characters', () => {
        const dataWithHtml: CommentNotificationData = {
          ...testData,
          commentContent: '<div>HTML content</div>',
        };
        const html = generateNewCommentHtml(dataWithHtml, siteName, siteUrl);
        // Verify HTML tags are escaped
        expect(html).toContain('&lt;div&gt;');
        expect(html).toContain('&lt;/div&gt;');
        // The content should be escaped and displayed as text
        expect(html).toContain('&lt;div&gt;HTML content&lt;/div&gt;');
      });

      it('should escape img onerror handler', () => {
        const dataWithHtml: CommentNotificationData = {
          ...testData,
          commentContent: '<img src="x" onerror="alert(1)">',
        };
        const html = generateNewCommentHtml(dataWithHtml, siteName, siteUrl);
        // onerror should be escaped, not executable as attribute
        expect(html).toContain('&lt;');
        expect(html).not.toContain('<img');
        expect(html).not.toContain('onerror="');
      });

      it('should escape javascript: URL', () => {
        const dataWithHtml: CommentNotificationData = {
          ...testData,
          commentContent: '<a href="javascript:alert(1)">Click</a>',
        };
        const html = generateNewCommentHtml(dataWithHtml, siteName, siteUrl);
        // javascript: protocol should be escaped, not executable
        expect(html).toContain('&lt;a');
        expect(html).not.toContain('<a href="javascript:');
      });
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

    describe('XSS Protection - Reply', () => {
      it('should escape <script> tag in reply content', () => {
        const dataWithHtml: CommentReplyNotificationData = {
          ...testData,
          replyContent: '<script>alert("XSS")</script>',
        };
        const html = generateReplyHtml(dataWithHtml, siteName, siteUrl);
        expect(html).not.toMatch(/<script[^>]*>/);
        expect(html).toContain('&lt;script&gt;');
      });

      it('should escape <script> tag in replier nickname', () => {
        const dataWithHtml: CommentReplyNotificationData = {
          ...testData,
          replierNickname: 'User<script>alert("XSS")</script>',
        };
        const html = generateReplyHtml(dataWithHtml, siteName, siteUrl);
        expect(html).not.toMatch(/<script[^>]*>/);
        expect(html).toContain('&lt;script&gt;');
      });

      it('should escape <script> tag in reply-to nickname', () => {
        const dataWithHtml: CommentReplyNotificationData = {
          ...testData,
          replyToNickname: '<script>alert("XSS")</script>',
        };
        const html = generateReplyHtml(dataWithHtml, siteName, siteUrl);
        expect(html).not.toMatch(/<script[^>]*>/);
        expect(html).toContain('&lt;script&gt;');
      });

      it('should escape onmouseover event handler', () => {
        const dataWithHtml: CommentReplyNotificationData = {
          ...testData,
          replyContent: '<div onmouseover="alert(1)">Hover me</div>',
        };
        const html = generateReplyHtml(dataWithHtml, siteName, siteUrl);
        // onmouseover should be escaped and not work as an attribute
        expect(html).toContain('&lt;');
        expect(html).not.toContain('<div onmouseover=');
      });

      it('should escape iframe injection', () => {
        const dataWithHtml: CommentReplyNotificationData = {
          ...testData,
          replyContent: '<iframe src="javascript:alert(1)"></iframe>',
        };
        const html = generateReplyHtml(dataWithHtml, siteName, siteUrl);
        // iframe tag should be escaped
        expect(html).not.toContain('<iframe');
        // javascript: protocol in iframe src should be escaped
        expect(html).toContain('&lt;iframe');
        expect(html).not.toContain('<iframe src="javascript:');
      });
    });
  });

  describe('Template Whitespace Handling', () => {
    it('should trim whitespace from generated text content', () => {
      const data: CommentNotificationData = {
        postTitle: 'Test',
        postUrl: 'https://test.com',
        commenterNickname: 'User',
        commentContent: 'Content',
        commentTime: new Date('2024-01-01'),
      };
      const text = generateNewCommentText(data, siteName, siteUrl);
      // 验证没有前导和尾随空白（使用正则表达式而非 trim）
      expect(text).toMatch(/^[^\s]/);
      expect(text).toMatch(/[^\s]$/);
      expect(text[0]).not.toBe('\n');
      expect(text[0]).not.toBe(' ');
    });

    it('should trim whitespace from generated HTML content', () => {
      const data: CommentNotificationData = {
        postTitle: 'Test',
        postUrl: 'https://test.com',
        commenterNickname: 'User',
        commentContent: 'Content',
        commentTime: new Date('2024-01-01'),
      };
      const html = generateNewCommentHtml(data, siteName, siteUrl);
      // 验证没有前导和尾随空白（使用正则表达式而非 trim）
      expect(html).toMatch(/^[^\s]/);
      expect(html).toMatch(/[^\s]$/);
      expect(html[0]).not.toBe('\n');
      expect(html[0]).not.toBe(' ');
    });
  });
});
