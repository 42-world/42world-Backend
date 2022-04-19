import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from '../article/article.entity';

@Entity('slack')
export class Slack extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
  clientMsgId!: string;

  @Column({ type: 'text', nullable: false })
  text!: string;

  @Column({ type: 'varchar', length: 16, nullable: false })
  user!: string;

  @Column({ type: 'varchar', length: 16, nullable: false })
  channel!: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  ts!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @OneToOne(() => Article, (article) => article.slack, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  article?: Article;
}
