import { User } from '@root/user/entities/user.entity';
import { Comment } from '@comment/entities/comment.entity';
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
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@root/article/entities/article.entity';

export enum ReactionCommentType {
  LIKE = 'LIKE',
}

@Entity('reaction_comment')
export class ReactionComment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_user_id')
  userId!: number;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ReactionCommentType,
    nullable: false,
    default: ReactionCommentType.LIKE,
  })
  type!: ReactionCommentType;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_comment_id')
  commentId!: number;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_article_id')
  articleId!: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty()
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
