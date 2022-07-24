import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailServiceToken } from './mail.service';
import StibeeService from './stibee.service';
import { UnsubscribeStibeeServiceToken } from './unsubscribe-stibee.service';

@Module({
  providers: [
    {
      provide: MailServiceToken,
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
  exports: [MailServiceToken, UnsubscribeStibeeServiceToken],
})
export class MailModule {}
