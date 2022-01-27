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
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
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
}
