import { Article } from '@root/article/entities/article.entity';
import { User } from '@user/entities/user.entity';
import { NotificationType } from '../interfaces/notifiaction.interface';
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

@Entity('notification')
export class Notification {
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
