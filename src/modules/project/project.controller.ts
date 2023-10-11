import {
  Body,
  Controller,
  HttpException,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { AuthJwtGuard } from '../auth/passport/guards/auth-jwt.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { ProjectSubscriberService } from '../project-subscriber/project-subscriber.service';

@Controller('projects')
export class ProjectController {
  constructor(
    readonly projectService: ProjectService,
    readonly projectSubscriberService: ProjectSubscriberService,
  ) {}

  // Создание проекта
  @UseGuards(AuthJwtGuard)
  @Post()
  async create(@Req() req, @Body() body: CreateProjectDto): Promise<Project> {
    try {
      return await this.projectService.create(req.user.id, body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение списка проектов пользователя и проектов на которые он подписан
  @UseGuards(AuthJwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async availableProjects(@Req() req, @Query() query): Promise<Project[]> {
    try {
      const { onlyOwner, onlySubscriber } = query;
      const isLoadAll = !onlyOwner && !onlySubscriber;
      const userId = req.user.id;
      const projects: Project[] = [];
      // Если нужно загрузить все проекты или только которые создал пользователь
      if (isLoadAll || onlyOwner) {
        const ownerProjects =
          await this.projectService.getProjectsByUserId(userId);
        projects.push(...ownerProjects);
      }
      // Если нужно загрузить все проекты или только на которые подписан пользователь
      if (isLoadAll || onlySubscriber) {
        const subscribeProjects =
          await this.projectSubscriberService.getSubscribeProjects(userId);
        projects.push(...subscribeProjects);
      }
      return projects;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение подробной информации по проекту
  @UseGuards(AuthJwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async info(@Req() req, @Param() params: any) {
    try {
      const id = params.id;
      const filters = [{ field: 'userId', value: req.user.id }];
      return await this.projectService.getById(id, filters);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Обновление проекта
  @UseGuards(AuthJwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param() params: any,
    @Body() body: Partial<CreateProjectDto>,
  ) {
    try {
      const id = params.id;
      const filters = [{ field: 'userId', value: req.user.id }];
      return await this.projectService.updateProjectHandle(id, body, filters);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Удаление проекта
  @UseGuards(AuthJwtGuard)
  @Delete(':id')
  async remove(@Req() req, @Param() params) {
    try {
      const id = params.id;
      const filters = [{ field: 'userId', value: req.user.id }];
      await this.projectService.removeProjectHandle(id, filters);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
