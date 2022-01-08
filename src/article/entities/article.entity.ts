import { User } from '@user/entities/user.entity';
import { Comment } from '@comment/entities/comment.entity';
import { Category } from '@category/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('ix_article_title')
  @Column({ type: 'varchar', length: 255, nullable: true })
  title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  body?: string;

  @Column({ default: 0 })
  view_count!: number;

  @ManyToOne(() => User, (user) => user.article, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @Index('ix_article_category_id')
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category!: Category;

  @ManyToOne(() => User, (user) => user.article, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @Index('ix_article_writer_id')
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Comment, (comment) => comment.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  comment?: Comment[];
}
