import { Article } from '@article/entities/article.entity';
import { UserRole } from '@user/interfaces/userrole.interface';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('category')
export class Category {
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
