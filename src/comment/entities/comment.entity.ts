import { Article } from '@article/entities/article.entity';
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
} from 'typeorm';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @ManyToOne(() => Article, (article) => article.comment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @Index('ix_article_id')
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article!: Article;

  @ManyToOne(() => User, (user) => user.comment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @Index('ix_writer_id')
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
