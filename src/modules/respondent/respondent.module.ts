import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Module

// Controller
import { RespondentController } from './respondent.controller';

// Service
import { RespondentService } from './respondent.service';
import { ProjectService } from '@/modules/project/project.service';

// Entity
import { Respondent } from '@/modules/respondent/respondent.entity';
import { Project } from '@/modules/project/project.entity';

// Guard

// Types

// Helper

@Module({
  imports: [TypeOrmModule.forFeature([Respondent, Project])],
  providers: [RespondentService, ProjectService],
  controllers: [RespondentController],
})
export class RespondentModule {}
