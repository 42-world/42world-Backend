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

import { User } from '@user/entities/user.entity';
import { Comment } from '@comment/entities/comment.entity';
import { Category } from '@category/entities/category.entity';
import { Reaction } from '@root/reaction/entities/reaction.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('ix_title')
  @Column({ type: 'varchar', length: 255, nullable: true })
  title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  content?: string;

  @Column({ default: 0 })
  view_count!: number;

  @Column({ nullable: false })
  @Index('ix_category_id')
  category_id!: number;

  @ManyToOne(() => Category, (category) => category.article, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: Category;

  @Column({ nullable: false })
  @Index('ix_writer_id')
  writer_id!: number;

  @ManyToOne(() => User, (user) => user.article, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer?: User;

  @Column({ nullable: true })
  deleted_at?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Comment, (comment) => comment.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  comment?: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  reaction?: Reaction[];
}
