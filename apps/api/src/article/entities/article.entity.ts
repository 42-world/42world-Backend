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
import { User } from '@api/user/entities/user.entity';
import { Comment } from '@api/comment/entities/comment.entity';
import { Category } from '@api/category/entities/category.entity';
import { Best } from '@api/best/entities/best.entity';
import { ReactionArticle } from '@api/reaction/entities/reaction-article.entity';
import { ReactionComment } from '@api/reaction/entities/reaction-comment.entity';
import { Notification } from '@api/notification/entities/notification.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('ix_title')
  @Column({ type: 'varchar', length: 42, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ default: 0 })
  viewCount!: number;

  @Column({ nullable: false })
  @Index('ix_category_id')
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.article, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: Category;

  @Column({ nullable: false })
  @Index('ix_writer_id')
  writerId!: number;

  @ManyToOne(() => User, (user) => user.article, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer?: User;

  @Column({ default: 0 })
  commentCount!: number;

  @Column({ default: 0 })
  likeCount!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @OneToMany(() => Comment, (comment) => comment.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  comment?: Comment[];

  @OneToMany(() => Notification, (notification) => notification.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  notification?: Notification[];

  @OneToMany(
    () => ReactionArticle,
    (reactionArticle) => reactionArticle.article,
    {
      createForeignKeyConstraints: false,
      nullable: true,
    },
  )
  reactionArticle?: ReactionArticle[];

  @OneToMany(
    () => ReactionComment,
    (reactionComment) => reactionComment.article,
    {
      createForeignKeyConstraints: false,
      nullable: true,
    },
  )
  reactionComment?: ReactionComment[];

  @OneToOne(() => Best, (best) => best.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  best?: Best;
}
