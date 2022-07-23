import { Article } from '@app/entity/article/article.entity';
import { ReactionComment } from '@app/entity/reaction/reaction-comment.entity';
import { User } from '@app/entity/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ default: 0 })
  likeCount!: number;

  @Column({ nullable: false })
  @Index('ix_article_id')
  articleId!: number;

  @ManyToOne(() => Article, (article) => article.comment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article?: Article;

  @Column({ nullable: false })
  @Index('ix_writer_id')
  writerId!: number;

  @ManyToOne(() => User, (user) => user.comment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer?: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @OneToMany(() => ReactionComment, (reactionComment) => reactionComment.comment, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  reactionComment?: ReactionComment[];
}
