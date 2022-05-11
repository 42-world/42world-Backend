import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { User } from '@app/entity/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ReactionCommentType {
  LIKE = 'LIKE',
}

@Entity('reaction_comment')
export class ReactionComment extends BaseEntity {
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
