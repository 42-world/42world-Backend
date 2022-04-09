import { Article } from '@api/article/entities/article.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  OneToOne,
} from 'typeorm';

@Entity('best')
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
