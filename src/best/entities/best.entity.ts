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

@Entity('best')
export class Best {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  @Index('ix_user_id')
  userId!: number;

  @ManyToOne(() => User, (user) => user.best, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
