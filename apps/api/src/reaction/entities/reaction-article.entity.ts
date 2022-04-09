import { Article } from '@api/article/entities/article.entity';
import { User } from '@api/user/entities/user.entity';
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

export enum ReactionArticleType {
  LIKE = 'LIKE',
}

@Entity('reaction_article')
export class ReactionArticle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  @Index('ix_user_id')
  userId!: number;

  @Column({
    type: 'enum',
    enum: ReactionArticleType,
    nullable: false,
    default: ReactionArticleType.LIKE,
  })
  type!: ReactionArticleType;

  @Column({ nullable: false })
  @Index('ix_article_id')
  articleId!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.reactionArticle, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @ManyToOne(() => Article, (article) => article.reactionArticle, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article?: Article;
}
