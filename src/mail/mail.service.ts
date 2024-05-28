import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAnnouncementEmail(dto: SendEmailDto): Promise<any> {
    try {
      const result = await this.mailerService.sendMail({
        to: dto.recipients,
        subject: dto.subject ? dto.subject : 'Announce acccount',
        template: 'active-user', // Template file name without extension
        context: dto.placeholderReplacement,
      });
      return result;
    } catch (err) {
      throw new Error('Send mail failed - ' + err.message);
    }
  }
}
