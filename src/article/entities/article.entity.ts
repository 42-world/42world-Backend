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
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { Comment } from '@comment/entities/comment.entity';
import { Category } from '@category/entities/category.entity';
import { Best } from '@root/best/entities/best.entity';
import { ReactionArticle } from '@root/reaction/entities/reaction-article.entity';
import { ReactionComment } from '@root/reaction/entities/reaction-comment.entity';

@Entity('article')
export class Article {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Index('ix_title')
  @Column({ type: 'varchar', length: 42, nullable: true })
  title!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  content!: string;

  @ApiProperty()
  @Column({ default: 0 })
  viewCount!: number;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_category_id')
  categoryId!: number;

  @ApiProperty()
  @ManyToOne(() => Category, (category) => category.article, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: Category;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_writer_id')
  writerId!: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.article, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer?: User;

  @ApiProperty()
  @Column({ default: 0 })
  commentCount!: number;

  @ApiProperty()
  @Column({ default: 0 })
  likeCount!: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;

  @ApiProperty()
  @DeleteDateColumn()
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @OneToMany(() => Comment, (comment) => comment.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  comment?: Comment[];

  @ApiProperty({ type: () => ReactionArticle })
  @OneToMany(
    () => ReactionArticle,
    (reactionArticle) => reactionArticle.article,
    {
      createForeignKeyConstraints: false,
      nullable: true,
    },
  )
  reactionArticle?: ReactionArticle[];

  @ApiProperty({ type: () => ReactionComment })
  @OneToMany(
    () => ReactionComment,
    (reactionComment) => reactionComment.article,
    {
      createForeignKeyConstraints: false,
      nullable: true,
    },
  )
  reactionComment?: ReactionComment[];

  @ApiProperty()
  @OneToOne(() => Best, (best) => best.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  best?: Best;
}
