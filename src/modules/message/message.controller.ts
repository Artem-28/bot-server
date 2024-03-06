import { Controller, HttpException, Post } from '@nestjs/common';
import { MessageService } from '@/modules/message/message.service';

@Controller('message')
export class MessageController {
  constructor(readonly messageService: MessageService) {}

  @Post('/send')
  public async sendMessage() {
    try {
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
