import { User } from '@app/entity/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('intra_auth')
export class IntraAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('ix_intra_id')
  @Column({ type: 'varchar', length: 20, nullable: false })
  intraId?: string;

  @Column({ nullable: false, unique: true })
  @Index('ix_user_id')
  userId!: number;

  @OneToOne(() => User, (user) => user.intraAuth, {
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
