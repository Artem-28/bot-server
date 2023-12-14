import {
  Body,
  Req,
  Controller,
  Post,
  UseGuards,
  HttpException,
  Get,
  Param,
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

// Helper

@Controller('project-subscribers')
@UseGuards(AuthJwtGuard)
@UseGuards(PermissionGuard)
export class ProjectSubscriberController {
  constructor(readonly projectSubscriberService: ProjectSubscriberService) {}

  // Добавление нового подписчика в проект
  @Post('/subscribe')
  @Permission(PermissionEnum.PROJECT_SUBSCRIBE)
  public async subscribe(
    @Req() req,
    @Body() body: SubscribeProjectDto,
  ): Promise<IResponseCombineUserSubscriber> {
    try {
      const user = req.user;
      // Добавляем пользователя в проект
      const projectSubscriber =
        await this.projectSubscriberService.subscribeUserToProject(body, {
          throwException: true,
        });
      // Получаем подписчика и все проекты на которые он подписан
      return await this.projectSubscriberService.getSubscriber(
        user,
        projectSubscriber.userId,
      );
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
  ): Promise<IResponseCombineUserSubscriber> {
    try {
      const user = req.user;
      // Отписываемся от проекта
      await this.projectSubscriberService.unsubscribeUserFromProject(body, {
        throwException: true,
      });
      // Получаем подписчика и все проекты на которые он подписан
      return await this.projectSubscriberService.getSubscriber(
        user,
        body.userId,
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
