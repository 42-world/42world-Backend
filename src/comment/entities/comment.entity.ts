import { Article } from '@article/entities/article.entity';
import { ReactionComment } from '@root/reaction/entities/reaction-comment.entity';
import { User } from '@user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('comment')
export class Comment {
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

  @OneToMany(
    () => ReactionComment,
    (reactionComment) => reactionComment.comment,
    {
      createForeignKeyConstraints: false,
      nullable: true,
    },
  )
  reactionComment?: ReactionComment[];
}
