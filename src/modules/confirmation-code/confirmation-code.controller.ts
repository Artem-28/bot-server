import { Body, Controller, HttpException, Post } from '@nestjs/common';

// Service
import { ConfirmationCodeService } from '@/modules/confirmation-code/confirmation-code.service';
import { MailingService } from '@/modules/mailing/mailing.service';

// Types

import {
  IResponseCheckCode,
  IResponseSendCode,
} from '@/modules/confirmation-code/interfaces/response-code.interface';
import { CreateConfirmationCodeDto } from '@/modules/confirmation-code/dto/create-confirmation-code.dto';
import { CheckConfirmationCodeDto } from '@/modules/confirmation-code/dto/check-confirmation-code.dto';

@Controller('confirmation-codes')
export class ConfirmationCodeController {
  constructor(
    readonly confirmationCodeService: ConfirmationCodeService,
    readonly mailingService: MailingService,
  ) {}

  @Post('send')
  public async send(
    @Body() body: CreateConfirmationCodeDto,
  ): Promise<IResponseSendCode> {
    try {
      const code = await this.confirmationCodeService.createCode(body);
      // Отправка кода подтверждения на почту
      await this.mailingService.sendConfirmCodeMessage(code);
      return this.confirmationCodeService.getResponseCode(code);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Post('check')
  public async check(
    @Body() body: CheckConfirmationCodeDto,
  ): Promise<IResponseCheckCode> {
    try {
      return this.confirmationCodeService.checkCode(body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
