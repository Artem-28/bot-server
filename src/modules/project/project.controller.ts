import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

// Guards
import { PermissionGuard } from '../check-permission/guards/permission.guard';
import { Permission } from '../check-permission/decorators/permission.decorator';
import { AuthJwtGuard } from '../auth/passport/guards/auth-jwt.guard';

// Service
import { ProjectService } from './project.service';
import { ProjectSubscriberService } from '../project-subscriber/project-subscriber.service';

// Entity
import { Project } from './project.entity';

// Types
import { CreateProjectDto } from './dto/create-project.dto';
import { PermissionEnum } from '../../base/enum/permission/permission.enum';

@Controller('projects')
@UseGuards(AuthJwtGuard)
export class ProjectController {
  constructor(
    readonly projectService: ProjectService,
    readonly projectSubscriberService: ProjectSubscriberService,
  ) {}

  // Создание проекта
  @Post()
  async create(@Req() req, @Body() body: CreateProjectDto): Promise<Project> {
    try {
      body.userId = req.user.id;
      return await this.projectService.createProjectHandle(body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение списка проектов пользователя и проектов на которые он подписан
  @Get()
  async availableProjects(@Req() req, @Query() query): Promise<Project[]> {
    try {
      const { onlyOwner, onlySubscriber } = query;
      const isLoadAll = !onlyOwner && !onlySubscriber;
      const userId = req.user.id;
      const projects: Project[] = [];
      // Если нужно загрузить все проекты или только которые создал пользователь
      if (isLoadAll || onlyOwner) {
        const ownerProjects = await this.projectService
          .getHandle()
          .projectsByUserId(userId);
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
  @Get(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(PermissionEnum.PROJECT_ACCESS)
  async info(@Req() req, @Param() params: any) {
    try {
      return await this.projectService
        .getHandle()
        .projectById(params.projectId);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Обновление проекта
  @Patch(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.PROJECT_OWNER, PermissionEnum.PROJECT_SUBSCRIBER],
    'or',
  )
  async update(
    @Req() req,
    @Param() params: any,
    @Body() body: Partial<CreateProjectDto>,
  ) {
    try {
      const id = params.projectId;
      const handle = await this.projectService.updateHandle(id, body);
      return await handle.getProject();
      // return await this.projectService
      //   .updateHandle(id, body)
      //   .catch((handle) => handle.getProject());
      // const filters = [{ field: 'userId', value: req.user.id }];
      // return await this.projectService.updateProjectHandle(id, body, filters);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Удаление проекта
  @Delete(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.PROJECT_OWNER, PermissionEnum.PROJECT_SUBSCRIBER],
    'or',
  )
  async remove(@Req() req, @Param() params) {
    try {
      const id = params.projectId;
      const filters = [{ field: 'userId', value: req.user.id }];
      await this.projectService.removeProjectHandle(id, filters);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
