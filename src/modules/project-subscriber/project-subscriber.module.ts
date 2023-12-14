import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module

// Controller
import { ProjectSubscriberController } from '@/modules/project-subscriber/project-subscriber.controller';

// Service
import { ProjectSubscriberService } from '@/modules/project-subscriber/project-subscriber.service';
import { UserService } from '@/modules/user/user.service';
import { ProjectService } from '@/modules/project/project.service';

// Entity
import { User } from '@/modules/user/user.entity';
import { Project } from '@/modules/project/project.entity';
import { ProjectSubscriber } from '@/modules/project-subscriber/projectSubscriber.entity';

// Guard

// Types

// Helper

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, ProjectSubscriber])],
  providers: [ProjectSubscriberService, UserService, ProjectService],
  controllers: [ProjectSubscriberController],
})
export class ProjectSubscriberModule {}
