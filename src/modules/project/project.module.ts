import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module
import { UserModule } from '@/modules/user/user.module';
import { ProjectSubscriberModule } from '@/modules/project-subscriber/project-subscriber.module';

// Controller

// Service
import { UserService } from '@/modules/user/user.service';
import { ProjectSubscriberService } from '@/modules/project-subscriber/project-subscriber.service';
import { ProjectService } from '@/modules/project/project.service';
import { ProjectController } from '@/modules/project/project.controller';

// Entity
import { Script } from '@/modules/script/script.entity';
import { Project } from '@/modules/project/project.entity';
import { User } from '@/modules/user/user.entity';
import { ProjectSubscriber } from '@/modules/project-subscriber/projectSubscriber.entity';

// Guard

// Types

// Helper

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
