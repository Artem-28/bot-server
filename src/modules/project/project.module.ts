import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Script } from '../script/script.entity';
import { Project } from './project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Script])],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
