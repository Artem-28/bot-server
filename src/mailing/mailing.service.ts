import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { MailMessageOptionsDto } from './dto/mailMessageOptionsDto';
import { ConfirmationCode } from '../confirmation-code/confirmation-code.entity';
import { EnumConfirmation } from '../enum/EnumConfirmation';

@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
  // Установка транспортного протокола
  private _setTransport() {
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

  // Отправка сообщения
  private async _sendMessage(options: MailMessageOptionsDto): Promise<boolean> {
    try {
      this._setTransport();
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

  // Отправка сообщения подтверждения
  async sendConfirmCodeMessage(code: ConfirmationCode) {
    const subjects = {
      [EnumConfirmation.TYPE_REGISTRATION]: 'Подтверждение регистрации',
    };
    const options = {
      to: code.email,
      subject: subjects[code.type],
      template: `./confirmation/${code.type}`,
      context: { code: code.value },
    };
    await this._sendMessage(options);
  }
}
