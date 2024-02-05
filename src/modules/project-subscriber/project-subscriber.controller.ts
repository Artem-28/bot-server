import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

// Module
// Controller
// Service
import { ProjectSubscriberService } from '@/modules/project-subscriber/project-subscriber.service';
import { User } from '@/modules/user/user.entity';

// Entity
// Guard
import { PermissionGuard } from '@/modules/check-permission/guards/permission.guard';
import { AuthJwtGuard } from '@/modules/auth/passport/guards/auth-jwt.guard';
import { Permission } from '@/modules/check-permission/decorators/permission.decorator';

// Types
import { PermissionEnum } from '@/base/enum/permission/permission.enum';
import { SubscribeProjectDto } from '@/modules/project-subscriber/dto/subscribe-project.dto';
import { IResponseCombineUserSubscriber } from '@/modules/project-subscriber/interfaces/response-project-subscriber.interface';
import { SearchProjectSubscriberDto } from '@/modules/project-subscriber/dto/search-project-subscriber.dto';
import { ProjectSubscriber } from '@/modules/project-subscriber/projectSubscriber.entity';

// Helper

@Controller('project-subscribers')
@UseGuards(AuthJwtGuard)
export class ProjectSubscriberController {
  constructor(readonly projectSubscriberService: ProjectSubscriberService) {}

  // Добавление нового подписчика в проект
  @Post('/subscribe')
  @UseGuards(PermissionGuard)
  @Permission(PermissionEnum.PROJECT_SUBSCRIBE)
  public async subscribe(
    @Req() req,
    @Body() body: SubscribeProjectDto,
  ): Promise<ProjectSubscriber> {
    try {
      // Добавляем пользователя в проект
      return await this.projectSubscriberService.subscribeUserToProject(body, {
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Отписать пользователя или отписаться самому
  @Post('/unsubscribe')
  @Permission(PermissionEnum.PROJECT_UNSUBSCRIBE)
  public async unsubscribe(
    @Req() req,
    @Body() body: SearchProjectSubscriberDto,
  ): Promise<boolean> {
    try {
      // Отписываемся от проекта
      return await this.projectSubscriberService.unsubscribeUserFromProject(
        body,
        {
          throwException: true,
        },
      );
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение всех подписчиков авторизованного пользователя
  @Get()
  public async list(@Req() req): Promise<IResponseCombineUserSubscriber[]> {
    try {
      return await this.projectSubscriberService.getSubscribers(req.user);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получчение подписчиков для проекта
  @Get('/project/:projectId')
  @Permission(PermissionEnum.PROJECT_SUBSCRIBERS_VIEW)
  public async getByProject(@Req() req, @Param() param): Promise<User[]> {
    try {
      return await this.projectSubscriberService.getSubscribeUsers({
        filter: { field: 'projectId', value: param.projectId },
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
