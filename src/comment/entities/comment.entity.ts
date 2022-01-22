import { Article } from '@article/entities/article.entity';
import { ApiProperty } from '@nestjs/swagger';
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
} from 'typeorm';

@Entity('comment')
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  content!: string;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_article_id')
  articleId!: number;

  @ManyToOne(() => Article, (article) => article.comment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article?: Article;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_writer_id')
  writerId!: number;

  //TODO: join user table
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.comment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer?: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt?: Date;
}
