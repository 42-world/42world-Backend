import { Article } from '@root/article/entities/article.entity';
import { User } from '@root/user/entities/user.entity';
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

@Entity('reaction')
export class Reaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  @Index('ix_user_id')
  userId!: number;

  @ManyToOne(() => User, (user) => user.reaction, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @Column({ nullable: false })
  @Index('ix_article_id')
  articleId!: number;

  @ManyToOne(() => Article, (article) => article.reaction, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article?: Article;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
