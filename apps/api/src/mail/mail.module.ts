import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_SERVICE_TOKEN } from './mail.service';
import StibeeService from './stibee.service';
import { UnsubscribeStibeeServiceToken } from './unsubscribe-stibee.service';

@Module({
  providers: [
    {
      provide: MAIL_SERVICE_TOKEN,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return new StibeeService(config);
      },
    },
    {
      provide: UnsubscribeStibeeServiceToken,
      useClass: StibeeService,
    },
  ],
  exports: [MAIL_SERVICE_TOKEN, UnsubscribeStibeeServiceToken],
})
export class MailModule {}
