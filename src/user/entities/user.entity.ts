import { FtAuth } from './../../ft-auth/entities/ft-auth.entity';
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
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Best } from '@root/best/entities/best.entity';
import { Reaction } from '@root/reaction/entities/reaction.entity';

export enum UserRole {
  CADET = 'CADET',
  ADMIN = 'ADMIN',
  NOVICE = 'NOVICE',
}

@Entity('user')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  nickname!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  oauthToken!: string;

  @ApiProperty()
  @Column({ nullable: false, default: false })
  isAuthenticated!: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  lastLogin?: Date;

  @ApiProperty({ example: UserRole.NOVICE })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.NOVICE })
  role!: string;

  @ApiProperty({
    minimum: 0,
    maximum: 5,
  })
  @Column({ nullable: false, default: 0 })
  character!: number;

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

  @OneToOne(() => FtAuth, (ftAuth) => ftAuth.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  ftAuth?: FtAuth;

  @OneToMany(() => Reaction, (reaction) => reaction.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  reaction?: Reaction[];

  @OneToMany(() => Best, (best) => best.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  best?: Best[];
}
