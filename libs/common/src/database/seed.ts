import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { SeederModule } from '@app/common/database/seeder/seeder.module';
import { Seeder } from '@app/common/database/seeder/seeder';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(Seeder);
      seeder
        .seed()
        .then(() => {
          logger.debug('Seeding complete!');
        })
        .catch((error) => {
          logger.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
