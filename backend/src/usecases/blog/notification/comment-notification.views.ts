// src/usecases/blog/notification/comment-notification.views.ts

/**
 * 用于通知的文章视图
 */
export interface CommentNotificationPostView {
  readonly id: number;
  readonly title: string;
  readonly slug: string;
}

/**
 * 用于通知的评论视图
 */
export interface CommentNotificationCommentView {
  readonly id: number;
  readonly nickname: string;
  readonly email: string | null;
  readonly content: string;
  readonly createdAt: Date;
}
