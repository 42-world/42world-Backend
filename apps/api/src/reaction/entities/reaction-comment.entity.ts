import { User } from '@api/user/entities/user.entity';
import { Comment } from '@api/comment/entities/comment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Article } from '@api/article/entities/article.entity';

export enum ReactionCommentType {
  LIKE = 'LIKE',
}

@Entity('reaction_comment')
export class ReactionComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  @Index('ix_user_id')
  userId!: number;

  @Column({
    type: 'enum',
    enum: ReactionCommentType,
    nullable: false,
    default: ReactionCommentType.LIKE,
  })
  type!: ReactionCommentType;

  @Column({ nullable: false })
  @Index('ix_comment_id')
  commentId!: number;

  @Column({ nullable: false })
  @Index('ix_article_id')
  articleId!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.reactionComment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @ManyToOne(() => Comment, (comment) => comment.reactionComment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'comment_id', referencedColumnName: 'id' })
  comment?: Comment;

  @ManyToOne(() => Article, (article) => article.reactionComment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article?: Article;
}
