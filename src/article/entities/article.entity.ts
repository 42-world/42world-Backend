import { User } from '@user/entities/user.entity';
import { Comment } from '@comment/entities/comment.entity';
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

  @Index('ix_title_id')
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
  @Index('ix_category_id')
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category!: User;

  @ManyToOne(() => User, (user) => user.article, {
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

  @OneToMany(() => Comment, (comment) => comment.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  comment?: Comment[];
}
