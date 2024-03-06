import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module

// Controller
import { ScriptController } from '@/modules/script/script.controller';

// Service
import { ScriptService } from '@/modules/script/script.service';
import { RespondentService } from '@/modules/respondent/respondent.service';
import { ProjectService } from '@/modules/project/project.service';

// Entity
import { Script } from '@/modules/script/script.entity';
import { Respondent } from '@/modules/respondent/respondent.entity';
import { Project } from '@/modules/project/project.entity';

// Guard

// Types

// Helper

@Module({
  imports: [TypeOrmModule.forFeature([Script, Respondent, Project])],
  providers: [ScriptService, RespondentService, ProjectService],
  controllers: [ScriptController],
})
export class ScriptModule {}
