import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';
import { ScriptController } from './script.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/project.entity';
import { Script } from './script.entity';
import { ProjectService } from '../project/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Script])],
  providers: [ScriptService, ProjectService],
  controllers: [ScriptController],
})
export class ScriptModule {}
