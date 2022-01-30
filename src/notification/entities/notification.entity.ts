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
} from 'typeorm';

export enum NotificationType {
  NEW_COMMENT = 'NEW_COMMENT',
  FROM_ADMIN = 'FROM_ADMIN',
}

@Entity('notification')
export class Notification {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    enum: NotificationType,
  })
  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.FROM_ADMIN,
  })
  type!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  content!: string;

  @ApiProperty()
  @Column({ nullable: false, default: false })
  isRead!: boolean;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_user_id')
  userId!: number;

  @ManyToOne(() => User, (user) => user.notification, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
