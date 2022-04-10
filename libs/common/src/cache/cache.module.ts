import { Module } from '@nestjs/common';
import { CacheService } from '@app/common/cache/cache.service';

@Module({ providers: [CacheService], exports: [CacheService] })
export class CacheModule {}
