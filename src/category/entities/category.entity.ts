import { Article } from '@article/entities/article.entity';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 40, nullable: false })
  name!: string;

  @ApiProperty({ example: UserRole.CADET })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  writableArticle!: string;

  @ApiProperty({ example: UserRole.CADET })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  readableArticle!: string;

  @ApiProperty({ example: UserRole.CADET })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  writableComment!: string;

  @ApiProperty({ example: UserRole.CADET })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  readableComment!: string;

  @ApiProperty({ example: UserRole.CADET })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  reactionable!: string;

  @ApiProperty()
  @Column({ nullable: false, default: false })
  anonymity!: boolean;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @ApiProperty()
  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @OneToMany(() => Article, (article) => article.category, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  article?: Article[];
}
