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

@Entity('ft_auth')
export class FtAuth {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('ix_intra_id')
  @Column({ type: 'varchar', length: 40, nullable: false })
  intraId?: string;

  @Column({ nullable: false, unique: true })
  @Index('ix_user_id')
  userId!: number;

  @OneToOne(() => User, (user) => user.ftAuth, {
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
