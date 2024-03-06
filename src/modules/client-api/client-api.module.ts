import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Module

// Controller
import { ClientApiController } from './client-api.controller';

// Service
import { ProjectService } from '@/modules/project/project.service';
import { ScriptService } from '@/modules/script/script.service';
import { SessionService } from '@/modules/session/session.service';
import { RespondentService } from '@/modules/respondent/respondent.service';
import { ClientApiService } from './client-api.service';
import { ProjectSubscriberService } from '@/modules/project-subscriber/project-subscriber.service';
import { UserService } from '@/modules/user/user.service';
import { MessageService } from '@/modules/message/message.service';

// Entity
import { Respondent } from '@/modules/respondent/respondent.entity';
import { Project } from '@/modules/project/project.entity';
import { Script } from '@/modules/script/script.entity';
import { Session } from '@/modules/session/session.entity';
import { Message } from '@/modules/message/message.entity';
import { ProjectSubscriber } from '@/modules/project-subscriber/projectSubscriber.entity';
import { User } from '@/modules/user/user.entity';

// Guard

// Types

// Helper

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Respondent,
      Project,
      Script,
      Session,
      Message,
      ProjectSubscriber,
      User,
    ]),
  ],
  providers: [
    ClientApiService,
    RespondentService,
    ProjectService,
    ScriptService,
    SessionService,
    MessageService,
    ProjectSubscriberService,
    UserService,
  ],
  controllers: [ClientApiController],
})
export class ClientApiModule {}
