import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              type: 'mysql',
              host: configService.get('DB_HOST'),
              port: parseInt(configService.get('DB_PORT'), 10),
              username: configService.get('DB_USER_NAME'),
              password: configService.get('DB_USER_PASSWORD'),
              database: configService.get('DB_NAME'),
              entities: [__dirname + '../../../../**/*.entity{.ts,.js}'],
              namingStrategy: new SnakeNamingStrategy(),

              timezone: 'Z', // UTC

              synchronize: false,
              migrationsRun: true,
              logging: configService.get('PHASE') === 'local',

              migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
              cli: {
                migrationsDir: 'src/database/migrations',
              },
              retryAttempts: 5,
              keepConnectionAlive: false,
            };
          },
        }),
      ],
    };
  }
}
