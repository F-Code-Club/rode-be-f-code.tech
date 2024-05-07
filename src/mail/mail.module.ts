import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from './mail.config';

@Module({
  imports: [MailerModule.forRoot(MailConfig)],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
