// src/usecases/blog/notification/comment-notification.template.ts

import type {
  CommentNotificationData,
  CommentReplyNotificationData,
} from './comment-notification.types';

export interface BlogConfig {
  ownerEmail: string;
  siteName: string;
  siteUrl: string;
}

/**
 * 生成新评论通知邮件主题
 */
export function generateNewCommentSubject(data: CommentNotificationData, siteName: string): string {
  return `[${siteName}] 您有新评论：${data.postTitle}`;
}

/**
 * 生成新评论通知邮件内容（纯文本）
 */
export function generateNewCommentText(
  data: CommentNotificationData,
  siteName: string,
  siteUrl: string,
): string {
  return `
您好！

您的文章「${data.postTitle}」收到了一条新评论。

评论者：${data.commenterNickname}
评论内容：${data.commentContent}
评论时间：${data.commentTime.toLocaleString('zh-CN')}

查看详情：${data.postUrl}

---
${siteName}
${siteUrl}
  `.trim();
}

/**
 * 生成新评论通知邮件内容（HTML）
 */
export function generateNewCommentHtml(
  data: CommentNotificationData,
  siteName: string,
  siteUrl: string,
): string {
  const escapedContent = escapeHtml(data.commentContent);
  const escapedNickname = escapeHtml(data.commenterNickname);
  const escapedTitle = escapeHtml(data.postTitle);
  const subject = generateNewCommentSubject(data, siteName);
  const escapedSubject = escapeHtml(subject);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedSubject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 20px;">
      您有新评论
    </h2>
    <p style="margin: 0; color: #666;">
      您的文章「<strong>${escapedTitle}</strong>」收到了一条新评论
    </p>
  </div>

  <div style="background: #fff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <div style="margin-bottom: 12px;">
      <strong style="color: #0366d6;">${escapedNickname}</strong>
      <span style="color: #999; font-size: 12px; margin-left: 8px;">
        ${data.commentTime.toLocaleString('zh-CN')}
      </span>
    </div>
    <div style="color: #24292e; background: #f6f8fa; padding: 12px; border-radius: 6px;">
      ${escapedContent}
    </div>
  </div>

  <div style="text-align: center; margin-bottom: 20px;">
    <a href="${data.postUrl}"
       style="display: inline-block; background: #0366d6; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
      查看详情
    </a>
  </div>

  <div style="text-align: center; color: #999; font-size: 12px; border-top: 1px solid #e1e4e8; padding-top: 20px;">
    <p style="margin: 0;">${escapeHtml(siteName)}</p>
    <p style="margin: 4px 0 0 0;">
      <a href="${siteUrl}" style="color: #0366d6; text-decoration: none;">${siteUrl}</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 生成评论回复通知邮件主题
 */
export function generateReplySubject(data: CommentReplyNotificationData, siteName: string): string {
  return `[${siteName}] ${data.replierNickname} 回复了您的评论`;
}

/**
 * 生成评论回复通知邮件内容（纯文本）
 */
export function generateReplyText(
  data: CommentReplyNotificationData,
  siteName: string,
  siteUrl: string,
): string {
  return `
您好，${data.replyToNickname}！

${data.replierNickname} 在「${data.postTitle}」中回复了您的评论。

回复内容：${data.replyContent}
回复时间：${data.replyTime.toLocaleString('zh-CN')}

查看详情：${data.postUrl}

---
${siteName}
${siteUrl}
  `.trim();
}

/**
 * 生成评论回复通知邮件内容（HTML）
 */
export function generateReplyHtml(
  data: CommentReplyNotificationData,
  siteName: string,
  siteUrl: string,
): string {
  const escapedContent = escapeHtml(data.replyContent);
  const escapedReplier = escapeHtml(data.replierNickname);
  const escapedReplyTo = escapeHtml(data.replyToNickname);
  const escapedTitle = escapeHtml(data.postTitle);
  const subject = generateReplySubject(data, siteName);
  const escapedSubject = escapeHtml(subject);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedSubject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 20px;">
      您收到了一条回复
    </h2>
    <p style="margin: 0; color: #666;">
      ${escapedReplier} 在「<strong>${escapedTitle}</strong>」中回复了您的评论
    </p>
  </div>

  <div style="background: #fff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <div style="margin-bottom: 12px;">
      <strong style="color: #0366d6;">${escapedReplier}</strong>
      <span style="color: #999; font-size: 12px; margin-left: 8px;">
        回复了 ${escapedReplyTo}
      </span>
      <span style="color: #999; font-size: 12px; margin-left: 8px;">
        ${data.replyTime.toLocaleString('zh-CN')}
      </span>
    </div>
    <div style="color: #24292e; background: #f6f8fa; padding: 12px; border-radius: 6px;">
      ${escapedContent}
    </div>
  </div>

  <div style="text-align: center; margin-bottom: 20px;">
    <a href="${data.postUrl}"
       style="display: inline-block; background: #0366d6; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
      查看详情
    </a>
  </div>

  <div style="text-align: center; color: #999; font-size: 12px; border-top: 1px solid #e1e4e8; padding-top: 20px;">
    <p style="margin: 0;">${escapeHtml(siteName)}</p>
    <p style="margin: 4px 0 0 0;">
      <a href="${siteUrl}" style="color: #0366d6; text-decoration: none;">${siteUrl}</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * HTML 转义函数
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
