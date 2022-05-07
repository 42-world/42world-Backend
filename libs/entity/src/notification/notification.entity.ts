import { Article } from '@app/entity/article/article.entity';
import { User } from '@app/entity/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from './interfaces/notifiaction.interface';

@Entity('notification')
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.FROM_ADMIN,
  })
  type!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ nullable: false })
  articleId: number;

  @ManyToOne(() => Article, (article) => article.notification, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article?: Article;

  @Column({ nullable: false, default: false })
  isRead!: boolean;

  @Column({ nullable: false })
  @Index('ix_user_id')
  userId!: number;

  @ManyToOne(() => User, (user) => user.notification, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
