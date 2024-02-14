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
// Module
// Controller
// Service
import { ProjectService } from '@/modules/project/project.service';
import { ProjectSubscriberService } from '@/modules/project-subscriber/project-subscriber.service';

// Entity
import { Project } from '@/modules/project/project.entity';

// Guard
import { AuthJwtGuard } from '@/modules/auth/passport/guards/auth-jwt.guard';
import { PermissionGuard } from '@/modules/check-permission/guards/permission.guard';
import { Permission } from '@/modules/check-permission/decorators/permission.decorator';
import {
  PROJECT_DELETE,
  PROJECT_UPDATE,
  PROJECT_VIEW,
} from '@/modules/check-permission/access-controllers/permission-controller.access';

// Types
import { CreateProjectDto } from '@/modules/project/dto/create-project.dto';
import { UpdateProjectDto } from '@/modules/project/dto/update-project.dto';

// Helper
import { formatParamHttp } from '@/base/helpers/formatter.helper';

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
      return await this.projectService.createProject(body, {
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
  @Permission(PROJECT_VIEW)
  async info(@Param() param): Promise<Project> {
    const { projectId } = formatParamHttp(param);
    try {
      return await this.projectService.getOneProject({
        filter: { field: 'id', value: projectId },
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Обновление проекта
  @Patch(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_UPDATE)
  async update(
    @Param() param,
    @Body() body: UpdateProjectDto,
  ): Promise<Project> {
    try {
      const { projectId } = formatParamHttp(param);
      // Обновляем проект
      await this.projectService.updateProject(projectId, body, {
        throwException: true,
      });
      // Получаем обновленный проект
      return await this.projectService.getOneProject({
        filter: { field: 'id', value: projectId },
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Удаление проекта
  @Delete(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_DELETE)
  async remove(@Param() param): Promise<boolean> {
    try {
      const { projectId } = formatParamHttp(param);
      return await this.projectService.removeProject(projectId, {
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
