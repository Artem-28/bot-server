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
} from '@nestjs/common';
import { AuthJwtGuard } from '../auth/passport/guards/auth-jwt.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { Project } from './project.entity';

@Controller('project')
export class ProjectController {
  constructor(readonly projectService: ProjectService) {}

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

  // Получение списка проектов авторизованного пользователя
  @UseGuards(AuthJwtGuard)
  @Get()
  async list(@Req() req) {
    try {
      const userId = req.user.id;
      return await this.projectService.getListByUserId(userId);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение подробной информации по проекту
  @UseGuards(AuthJwtGuard)
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
