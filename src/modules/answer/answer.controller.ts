import {Body, Controller, HttpException, Post, UseGuards} from '@nestjs/common';

// Module

// Controller

// Service
import { AnswerService } from '@/modules/answer/answer.service';

// Entity

// Guard
import { AuthJwtGuard } from '@/modules/auth/passport/guards/auth-jwt.guard';

// Types
import { AnswerDto } from '@/modules/answer/dto/answer.dto';

// Helper

@Controller('projects/:projectId/scripts/:scriptId/answers')
@UseGuards(AuthJwtGuard)
export class AnswerController {
  constructor(readonly answerService: AnswerService) {}

  @Post()
  public async create(@Body() body: AnswerDto) {
    try {
      return await this.answerService.createAnswer(body, {
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
