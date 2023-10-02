import {
  Body,
  Req,
  Controller,
  Post,
  UseGuards,
  HttpException, Get,
} from '@nestjs/common';
import { ProjectSubscriberService } from './project-subscriber.service';
import { AuthJwtGuard } from '../auth/passport/guards/auth-jwt.guard';
import { CreateProjectSubscriberDto } from './dto/create-project-subscriber.dto';

@Controller('project-subscriber')
export class ProjectSubscriberController {
  constructor(readonly projectSubscriberService: ProjectSubscriberService) {}

  @UseGuards(AuthJwtGuard)
  @Post()
  public async create(@Req() req, @Body() body: CreateProjectSubscriberDto) {
    try {
      return await this.projectSubscriberService.subscribeUserToProject(
        req.user,
        body,
      );
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @UseGuards(AuthJwtGuard)
  @Get()
  public async list(@Req() req) {
    try {
      await this.projectSubscriberService.getSubscribers(req.user);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

}
