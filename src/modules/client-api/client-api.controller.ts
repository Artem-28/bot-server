import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ClientApiService } from '@/modules/client-api/client-api.service';
import { StartScriptDto } from '@/modules/client-api/dto/start-script.dto';
import { SessionService } from '@/modules/session/session.service';
import { CreateSessionDto } from '@/modules/session/dto/session.dto';
import { MessageDto } from '@/modules/message/dto/message.dto';
import { MessageService } from '@/modules/message/message.service';

@Controller('api')
export class ClientApiController {
  constructor(
    readonly clientService: ClientApiService,
    readonly sessionService: SessionService,
    readonly messageService: MessageService,
  ) {}

  @Post('/start')
  public async start(@Body() body: StartScriptDto) {
    try {
      return await this.clientService.startScript(body, {
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Post('/sessions')
  public async createSession(@Body() body: CreateSessionDto) {
    try {
      return await this.sessionService.createSession(body, {
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Post('/messages/send')
  public async sendMessage(@Body() body: MessageDto) {
    try {
      await this.messageService.sendRespondentMessage(body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
