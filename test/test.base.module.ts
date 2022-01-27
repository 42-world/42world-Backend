import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'ft_world',
      password: 'ft_world',
      database: 'ft_world',
      entities: [path.join(__dirname, '../src/**/*.entity{.ts,.js}')],
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: true,
      logging: true,
    }),
    ConfigModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class TestBaseModule {}
