import { Article } from '@app/entity/article/article.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 40, nullable: false })
  name!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  writableArticle!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  readableArticle!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  writableComment!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  readableComment!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  reactionable!: string;

  @Column({ nullable: false, default: false })
  anonymity!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @OneToMany(() => Article, (article) => article.category, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  article?: Article[];
}
