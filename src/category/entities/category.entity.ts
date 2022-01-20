import { Article } from '@article/entities/article.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 40, nullable: false })
  name!: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Article, (article) => article.category, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  article?: Article[];
}
