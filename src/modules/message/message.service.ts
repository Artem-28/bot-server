import { HttpException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Message } from '@/modules/message/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto, SendMessageDto } from '@/modules/message/dto/message.dto';
import { SessionService } from '@/modules/session/session.service';
import { Options } from '@/base/interfaces/service.interface';
import { ProjectSubscriberService } from '@/modules/project-subscriber/project-subscriber.service';
import { ProjectService } from '@/modules/project/project.service';
import { toArray } from '@/base/helpers/array.helper';
import { User } from '@/modules/user/user.entity';
import { Respondent } from '@/modules/respondent/respondent.entity';

@Injectable()
export class MessageService {
  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(Message)
    private readonly _messageRepository: Repository<Message>,
    private readonly _sessionService: SessionService,
    private readonly _projectSubscribeService: ProjectSubscriberService,
    private readonly _projectService: ProjectService,
  ) {}

  // Отправка сообщения респондентом
  public async sendRespondentMessage(
    dto: MessageDto,
    options?: Options,
  ): Promise<boolean> {
    const throwException = options && options.throwException;
    const session = await this._sessionService.getOneSession({
      filter: { field: 'id', value: dto.sessionId },
      relation: { name: 'script' },
      throwException,
    });
    if (!session) return false;

    const project = await this._projectService.getOneProject({
      filter: { field: 'id', value: session.script.projectId },
      relation: { name: 'subscribers' },
      throwException,
    });
    if (!project) return false;

    const subscriberUserIds = project.subscribers.map((s) => s.userId);
    const sendMessageDto: SendMessageDto = {
      toUserId: [project.userId, ...subscriberUserIds],
      message: {
        sessionId: session.id,
        respondentId: session.respondentId,
        text: dto.text,
      },
    };
    const message = await this._sendMessage(sendMessageDto, { throwException });
    return !!message;
  }

  private async _sendMessage(dto: SendMessageDto, options?: Options) {
    const throwException = options && options.throwException;
    const toUsers = toArray(dto.toUserId).map((id) => new User({ id }));
    const toRespondents = toArray(dto.toRespondentId).map(
      (id) => new Respondent({ id }),
    );
    const message = new Message(dto.message);
    message.unreadUsers = toUsers;
    message.unreadRespondents = toRespondents;

    const response = await this._messageRepository.save(message);
    if (!response && throwException) {
      throw new HttpException('message.send', 500);
    }
    if (!response) return null;

    return new Message(response);
  }
}
