import { DatabaseModule } from '@app/common/database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminJsModule } from './adminJs/admin-js.module';
import { ormconfig } from './adminJs/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'infra/config/.env',
      isGlobal: true,
      cache: true,
      load: [ormconfig],
    }),
    DatabaseModule.register(),
    AdminJsModule.register(),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
