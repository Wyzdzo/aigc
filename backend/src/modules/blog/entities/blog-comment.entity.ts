// src/modules/blog/entities/blog-comment.entity.ts
import { BlogCommentModel, CommentStatus } from '@app-types/models/blog/blog.types';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blog_comment')
@Index('idx_comment_post', ['postId'])
@Index('idx_comment_parent', ['parentId'])
@Index('idx_comment_status', ['status'])
@Index('idx_comment_created_at', ['createdAt'])
export class BlogCommentEntity implements BlogCommentModel {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'primary key' })
  id!: number;

  @Column({ name: 'post_id', type: 'int', comment: '文章ID' })
  postId!: number;

  @Column({ name: 'parent_id', type: 'int', nullable: true, comment: '父评论ID' })
  parentId!: number | null;

  @Column({ type: 'varchar', length: 50, comment: '昵称' })
  nickname!: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '邮箱' })
  email!: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '头像URL' })
  avatar!: string | null;

  @Column({ type: 'varchar', length: 2000, comment: '评论内容' })
  content!: string;

  @Column({
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.PENDING,
    comment: '评论状态',
  })
  status!: CommentStatus;

  @Column({ name: 'like_count', type: 'int', default: 0, comment: '点赞次数' })
  likeCount!: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt!: Date;
}
