import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '@/modules/message/message.entity';
import { SessionService } from '@/modules/session/session.service';
import { Session } from '@/modules/session/session.entity';
import { ProjectService } from '@/modules/project/project.service';
import { Project } from '@/modules/project/project.entity';
import { Respondent } from '@/modules/respondent/respondent.entity';
import { RespondentService } from '@/modules/respondent/respondent.service';
import { Script } from '@/modules/script/script.entity';
import { ScriptService } from '@/modules/script/script.service';
import { ProjectSubscriber } from '@/modules/project-subscriber/projectSubscriber.entity';
import { ProjectSubscriberService } from '@/modules/project-subscriber/project-subscriber.service';
import { User } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      Session,
      Project,
      Respondent,
      Script,
      ProjectSubscriber,
      User,
    ]),
  ],
  providers: [
    MessageService,
    SessionService,
    ProjectService,
    RespondentService,
    ScriptService,
    ProjectSubscriberService,
    UserService,
  ],
  controllers: [MessageController],
})
export class MessageModule {}
