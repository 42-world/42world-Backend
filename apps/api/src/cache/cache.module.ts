import { Module } from '@nestjs/common';
import { CacheService } from '@api/cache/cache.service';

@Module({ providers: [CacheService], exports: [CacheService] })
export class CacheModule {}
