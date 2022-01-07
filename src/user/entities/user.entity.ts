import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 32, nullable: false })
  nickname!: string;

  @Column({ type: 'varchar', length: 140, nullable: false })
  password!: string;

  @Column({ type: 'varchar', length: 140, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 140, nullable: false })
  last_login!: string;

  @Column({ nullable: false, default: false })
  is_active!: boolean;

  @Column({ type: 'varchar', length: 140, nullable: false })
  role!: string;

  @Column({ type: 'varchar', length: 140, nullable: false })
  picture!: string;
}
