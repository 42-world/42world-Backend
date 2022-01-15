import { Authenticate } from '@authenticate/entities/authenticate.entity';
import { Article } from '@article/entities/article.entity';
import { Comment } from '@comment/entities/comment.entity';
import { Notification } from '@notification/entities/notification.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

export enum UserRole {
  CADET = 'CADET',
  ADMIN = 'ADMIN',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  nickname!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  oauth_token?: string;

  @Column({ nullable: false, default: false })
  is_authenticated!: boolean;

  @Column({ nullable: true })
  refresh_token?: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  role!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  picture?: string;

  @Column({ nullable: false, default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

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

  @OneToOne(() => Authenticate, (authenticate) => authenticate.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  authenticate?: Authenticate;
}
