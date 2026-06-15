// src/usecases/blog/notification/comment-notification.types.ts

/**
 * 评论通知数据
 */
export interface CommentNotificationData {
  /** 文章标题 */
  postTitle: string;
  /** 文章链接 */
  postUrl: string;
  /** 评论者昵称 */
  commenterNickname: string;
  /** 评论内容 */
  commentContent: string;
  /** 评论时间 */
  commentTime: Date;
}

/**
 * 评论回复通知数据
 */
export interface CommentReplyNotificationData {
  /** 被回复者昵称 */
  replyToNickname: string;
  /** 文章标题 */
  postTitle: string;
  /** 文章链接 */
  postUrl: string;
  /** 回复者昵称 */
  replierNickname: string;
  /** 回复内容 */
  replyContent: string;
  /** 回复时间 */
  replyTime: Date;
}

/**
 * 通知类型枚举
 */
export enum NotificationType {
  NEW_COMMENT = 'new_comment',
  COMMENT_REPLY = 'comment_reply',
}
