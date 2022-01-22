import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { Comment } from '@comment/entities/comment.entity';
import { Category } from '@category/entities/category.entity';
import { Reaction } from '@root/reaction/entities/reaction.entity';

@Entity('article')
export class Article {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Index('ix_title')
  @Column({ type: 'varchar', length: 255, nullable: true })
  title!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  content?: string;

  @ApiProperty()
  @Column({ default: 0 })
  viewCount!: number;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_category_id')
  categoryId!: number;

  @ApiProperty()
  @ManyToOne(() => Category, (category) => category.article, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: Category;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_writer_id')
  writerId!: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.article, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer?: User;

  @ApiProperty()
  @Column({ nullable: true })
  deletedAt?: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  comment?: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.article, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  reaction?: Reaction[];
}
