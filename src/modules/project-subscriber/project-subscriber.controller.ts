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

// Guards
import { PermissionGuard } from '../check-permission/guards/permission.guard';
import { Permission } from '../check-permission/decorators/permission.decorator';
import { AuthJwtGuard } from '../auth/passport/guards/auth-jwt.guard';

// Service
import { ProjectSubscriberService } from './project-subscriber.service';

// Entity
import { User } from '../user/user.entity';

// Types
import { SubscribeProjectDto } from './dto/subscribe-project.dto';
import { SearchProjectSubscriberDto } from './dto/search-project-subscriber.dto';
import { IResponseCombineUserSubscriber } from './interfaces/response-project-subscriber.interface';
import { PermissionEnum } from '../../base/enum/permission/permission.enum';

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
  @UseGuards(PermissionGuard)
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
  @UseGuards(PermissionGuard)
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
