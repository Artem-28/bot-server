import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import configuration from '../config/configuration';
import { MailMessageOptionsDto } from './dto/mailMessageOptionsDto';

@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
  private setTransport() {
    configuration();
    const config = {
      host: this.configService.get('mailing.host'),
      port: this.configService.get<number>('mailing.port'),
      secure: true,
      auth: {
        user: this.configService.get<string>('mailing.username'),
        pass: this.configService.get<string>('mailing.password'),
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  async sendMessage(options: MailMessageOptionsDto): Promise<boolean> {
    try {
      this.setTransport();
      await this.mailerService.sendMail({
        transporterName: 'gmail',
        from: this.configService.get<string>('mailing.username'),
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
