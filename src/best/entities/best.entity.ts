import { Article } from '@root/article/entities/article.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  OneToOne,
  Unique,
} from 'typeorm';

@Entity('best')
// @Unique(['article_id'])
export class Best {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  @Index('ix_article_id')
  articleId!: number;

  @OneToOne(() => Article, (article) => article.best, {
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
