import { DatabaseModule } from '@app/common/database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminJsModule } from './adminJs/admin-js.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'infra/config/.env',
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule.register(),
    AdminJsModule.register(),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
