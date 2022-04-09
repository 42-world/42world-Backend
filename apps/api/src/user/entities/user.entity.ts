import { Article } from '@api/article/entities/article.entity';
import { Comment } from '@api/comment/entities/comment.entity';
import { Notification } from '@api/notification/entities/notification.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { ReactionArticle } from '@api/reaction/entities/reaction-article.entity';
import { ReactionComment } from '@api/reaction/entities/reaction-comment.entity';
import { IntraAuth } from '@api/intra-auth/entities/intra-auth.entity';
import { UserRole } from '@api/user/interfaces/userrole.interface';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  nickname!: string;

  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  githubUsername!: string;

  @Column({ type: 'varchar', length: 42, nullable: false })
  githubUid!: string;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.NOVICE })
  role!: string;

  @Column({ nullable: false, default: 0 })
  character!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @OneToMany(() => Article, (article) => article.writer, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  article?: Article[];

  @OneToMany(() => Comment, (comment) => comment.writer, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  comment?: Comment[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  notification?: Notification[];

  @OneToMany(() => ReactionArticle, (reactionArticle) => reactionArticle.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  reactionArticle?: ReactionArticle[];

  @OneToMany(() => ReactionComment, (reactionComment) => reactionComment.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  reactionComment?: ReactionComment[];

  @OneToOne(() => IntraAuth, (intraAuth) => intraAuth.user, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  intraAuth?: IntraAuth;
}
