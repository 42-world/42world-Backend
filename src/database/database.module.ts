import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

export class DatabaseModule {
  static register(): DynamicModule {
    return TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER_NAME,
      password: process.env.DB_USER_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '../../**/*.entity{.ts,.js}'],

      synchronize: true,
      migrationsRun: false,
      logging: process.env.NODE_ENV === 'dev',

      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        migrationsDir: 'migrations',
      },
    });
  }
}
