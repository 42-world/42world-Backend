import { IntraAuthSeederService } from '@app/common/database/seeder/intra-auth/intra-auth-seeder.service';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([IntraAuth])],
  providers: [IntraAuthSeederService],
  exports: [IntraAuthSeederService],
})
export class IntraAuthSeederModule {}
