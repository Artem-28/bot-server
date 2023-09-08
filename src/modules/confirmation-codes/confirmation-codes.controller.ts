import { Body, Controller, HttpException, Post } from '@nestjs/common';

import { MailingService } from '../mailing/mailing.service';
import { ConfirmationCodesService } from './confirmation-codes.service';

import { CreateConfirmationCodesDto } from './dto/create-confirmation-codes.dto';
import { CheckConfirmationCodesDto } from './dto/check-confirmation-codes.dto';

@Controller('confirmation-code')
export class ConfirmationCodesController {
  constructor(
    readonly confirmationCodesService: ConfirmationCodesService,
    readonly mailingService: MailingService,
  ) {}

  @Post('send')
  public async send(@Body() body: CreateConfirmationCodesDto) {
    try {
      const code = await this.confirmationCodesService.createCode(body);
      // Отправка кода подтверждения на почту
      await this.mailingService.sendConfirmCodeMessage(code);
      return this.confirmationCodesService.getResponseCode(code);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Post('check')
  public async check(@Body() body: CheckConfirmationCodesDto) {
    try {
      return this.confirmationCodesService.checkCode(body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
