import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Module

// Controller
import { SessionController } from './session.controller';

// Service
import { SessionService } from './session.service';
import { ProjectService } from '@/modules/project/project.service';
import { RespondentService } from '@/modules/respondent/respondent.service';
import { ScriptService } from '@/modules/script/script.service';

// Entity
import { Session } from '@/modules/session/session.entity';
import { Respondent } from '@/modules/respondent/respondent.entity';
import { Project } from '@/modules/project/project.entity';
import { Script } from '@/modules/script/script.entity';

// Guard

// Types

// Helper

@Module({
  imports: [TypeOrmModule.forFeature([Session, Respondent, Project, Script])],
  providers: [SessionService, RespondentService, ProjectService, ScriptService],
  controllers: [SessionController],
})
export class SessionModule {}
