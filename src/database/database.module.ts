import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconifg from '../ormconfig';

@Module({ imports: [TypeOrmModule.forRoot(ormconifg)] })
export class DatabaseModule {}
