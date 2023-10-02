import { Module } from '@nestjs/common';
import { ProjectSubscriberService } from './project-subscriber.service';
import { ProjectSubscriberController } from './project-subscriber.controller';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';
import { ProjectService } from '../project/project.service';
import { ProjectSubscriber } from './projectSubscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, ProjectSubscriber])],
  providers: [ProjectSubscriberService, UserService, ProjectService],
  controllers: [ProjectSubscriberController],
})
export class ProjectSubscriberModule {}
