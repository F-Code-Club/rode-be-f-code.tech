import RodeConfig from '@etc/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const MailConfig: MailerOptions = {
  transport: {
    host: RodeConfig.MAIL_HOST,
    port: 587,
    secure: false, // Set to true if using SSL/TLS
    auth: {
      user: 'rinjin2004@gmail.com',
      pass: 'fagm fstt khqf tjsd',
    },
  },
  defaults: {
    from: RodeConfig.MAIL_SENDER + `<${RodeConfig.MAIL_SENDER_EMAIL}>`,
  },
  template: {
    dir: __dirname + '/templates',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
