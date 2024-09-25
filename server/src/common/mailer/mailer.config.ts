import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export const mailerConfig = {
  transport: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
  defaults: {
    from: process.env.EMAIL_FROM,
  },
  template: {
    dir: join(process.cwd(), 'src/common/mailer/templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
