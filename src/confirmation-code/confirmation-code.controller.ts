import { Body, Controller, Post } from '@nestjs/common';
import { CreateConfirmationCodeDto } from './dto/create-confirmation-code.dto';
import { ConfirmationCodeService } from './confirmation-code.service';

@Controller('confirmation-code')
export class ConfirmationCodeController {
  constructor(readonly confirmationCodeService: ConfirmationCodeService) {}

  @Post('send')
  public async send(@Body() body: CreateConfirmationCodeDto) {
    try {
      const res = await this.confirmationCodeService.send(body);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }
}
