import { User } from '@user/entities/user.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('authenticate')
export class Authenticate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('ix_intra_id')
  @Column({ type: 'varchar', length: 40, nullable: false })
  intra_id?: string;

  @OneToOne(() => User, (user) => user.authenticate, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
