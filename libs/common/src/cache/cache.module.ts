import { CacheService } from '@app/common/cache/cache.service';
import { Module } from '@nestjs/common';

@Module({ providers: [CacheService], exports: [CacheService] })
export class CacheModule {}
