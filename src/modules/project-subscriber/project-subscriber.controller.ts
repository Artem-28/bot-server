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
import { ProjectSubscriberService } from './project-subscriber.service';
import { AuthJwtGuard } from '../auth/passport/guards/auth-jwt.guard';
import { SubscribeProjectDto } from './dto/subscribe-project.dto';
import { SearchProjectSubscriberDto } from './dto/search-project-subscriber.dto';
import {
  IResponseCombineUserSubscriber,
  IResponseSubscriberUser,
} from './interfaces/response-project-subscriber.interface';

@Controller('project-subscribers')
export class ProjectSubscriberController {
  constructor(readonly projectSubscriberService: ProjectSubscriberService) {}

  // Добавление нового подписчика в проект
  @UseGuards(AuthJwtGuard)
  @Post('/subscribe')
  public async subscribe(
    @Req() req,
    @Body() body: SubscribeProjectDto,
  ): Promise<IResponseCombineUserSubscriber> {
    try {
      const user = req.user;
      // Добавляем пользователя в проект
      const projectSubscriber =
        await this.projectSubscriberService.subscribeUserToProject(user, body);
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
  @UseGuards(AuthJwtGuard)
  @Post('/unsubscribe')
  public async unsubscribe(
    @Req() req,
    @Body() body: SearchProjectSubscriberDto,
  ): Promise<boolean> {
    try {
      const user = req.user;
      return await this.projectSubscriberService.unsubscribeUserFromProject(
        user,
        body,
      );
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение всех подписчиков авторизованного пользователя
  @UseGuards(AuthJwtGuard)
  @Get()
  public async list(@Req() req): Promise<IResponseCombineUserSubscriber[]> {
    try {
      return await this.projectSubscriberService.getSubscribers(req.user);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получчение подписчиков для проекта
  @UseGuards(AuthJwtGuard)
  @Get('/project/:projectId')
  public async getByProject(
    @Req() req,
    @Param() param,
  ): Promise<IResponseSubscriberUser[]> {
    try {
      return await this.projectSubscriberService.getSubscribersByProject(
        req.user,
        param.projectId,
      );
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
