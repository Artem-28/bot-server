import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Script } from '../script/script.entity';
import { Project } from './project.entity';
import { ProjectSubscriberModule } from '../project-subscriber/project-subscriber.module';
import { ProjectSubscriberService } from '../project-subscriber/project-subscriber.service';
import { ProjectSubscriber } from '../project-subscriber/projectSubscriber.entity';
// UserModule используется в ProjectSubscriberModule
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Script, ProjectSubscriber, User]),
    ProjectSubscriberModule,
    UserModule,
  ],
  providers: [ProjectService, ProjectSubscriberService, UserService],
  controllers: [ProjectController],
})
export class ProjectModule {}
