import {
  Body,
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
import { UpdateProjectDto } from './dto/update-project.dto';

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
      const dto = { ...body, userId: req.user.id };
      return await this.projectService.createProject(dto, {
        throwException: true,
      });
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
        const ownerProjects = await this.projectService.getProjects({
          filter: { field: 'userId', value: userId },
        });
        projects.push(...ownerProjects);
      }
      // Если нужно загрузить все проекты или только на которые подписан пользователь
      if (isLoadAll || onlySubscriber) {
        const subscribeProjects =
          await this.projectSubscriberService.getSubscribeProjects({
            filter: { field: 'userId', value: userId },
          });
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
  @Permission(
    [PermissionEnum.PROJECT_ACCESS, PermissionEnum.PROJECT_VIEW],
    'or',
  )
  async info(@Req() req, @Param() params: any) {
    try {
      return await this.projectService.getOneProject({
        filter: { field: 'id', value: params.projectId },
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Обновление проекта
  @Patch(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.PROJECT_ACCESS, PermissionEnum.PROJECT_UPDATE],
    'or',
  )
  async update(
    @Req() req,
    @Param() params: any,
    @Body() body: UpdateProjectDto,
  ) {
    try {
      const id = params.projectId;
      // Обновляем проект
      await this.projectService.updateProject(id, body, {
        throwException: true,
      });
      // Получаем обновленный проект
      return await this.projectService.getOneProject({
        filter: { field: 'id', value: id },
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Удаление проекта
  @Delete(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.PROJECT_ACCESS, PermissionEnum.PROJECT_DELETE],
    'or',
  )
  async remove(@Req() req, @Param() params) {
    try {
      const id = params.projectId;
      await this.projectService.removeProject(id, { throwException: true });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение скриптов у проекта
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.PROJECT_ACCESS, PermissionEnum.PROJECT_VIEW],
    'or',
  )
  @Get(':projectId/scripts')
  async getProjectScripts(@Req() req, @Param() params) {
    try {
      return await this.projectService.getOneProject({
        filter: { field: 'id', value: params.projectId },
        relation: { name: 'scripts' },
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
