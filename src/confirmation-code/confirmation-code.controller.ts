import { Body, Controller, Post } from '@nestjs/common';

import { MailingService } from '../mailing/mailing.service';
import { ConfirmationCodeService } from './confirmation-code.service';

import { CreateConfirmationCodeDto } from './dto/create-confirmation-code.dto';
import { CheckConfirmationCodeDto } from './dto/check-confirmation-code.dto';


@Controller('confirmation-code')
export class ConfirmationCodeController {
  constructor(
    readonly confirmationCodeService: ConfirmationCodeService,
    readonly mailingService: MailingService,
  ) {}

  @Post('send')
  public async send(@Body() body: CreateConfirmationCodeDto) {
    try {
      const code = await this.confirmationCodeService.createCode(body);
      // Отправка кода подтверждения на почту
      await this.mailingService.sendConfirmCodeMessage(code);
      return this.confirmationCodeService.getResponseCode(code);
    } catch (e) {
      return e.message;
    }
  }

  @Post('check')
  public async check(@Body() body: CheckConfirmationCodeDto) {
    try {
      return this.confirmationCodeService.checkCode(body);
    } catch (e) {
      return e.message;
    }
  }
}
