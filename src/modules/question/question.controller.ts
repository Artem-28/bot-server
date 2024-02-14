import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
// Module

// Controller

// Service
import { QuestionService } from '@/modules/question/question.service';

// Entity
import { Question } from '@/modules/question/question.entity';

// Guard
import { AuthJwtGuard } from '@/modules/auth/passport/guards/auth-jwt.guard';
import { PermissionGuard } from '@/modules/check-permission/guards/permission.guard';
import { Permission } from '@/modules/check-permission/decorators/permission.decorator';
import {
  QUESTION_CREATE,
  QUESTION_DELETE,
  QUESTION_UPDATE,
} from '@/modules/check-permission/access-controllers/permission-controller.access';

// Types
import { QuestionDto } from '@/modules/question/dto/question.dto';
import { formatParamHttp } from '@/base/helpers/formatter.helper';

// Helper

@Controller('projects/:projectId/scripts/:scriptId/questions')
@UseGuards(AuthJwtGuard)
export class QuestionController {
  constructor(readonly questionService: QuestionService) {}
  // Создание нового question
  @Post()
  @UseGuards(PermissionGuard)
  @Permission(QUESTION_CREATE)
  public async create(
    @Param() param,
    @Body() body: QuestionDto,
  ): Promise<Question> {
    try {
      param = formatParamHttp(param);
      body.scriptId = param.scriptId;
      return await this.questionService.createQuestion(body, {
        param,
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Удаление question
  @Delete(':questionId')
  @UseGuards(PermissionGuard)
  @Permission(QUESTION_DELETE)
  public async remove(@Param() param): Promise<boolean> {
    try {
      return await this.questionService.removeQuestion({
        param: formatParamHttp(param),
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Обновление и получение обновленного question
  @Patch(':questionId')
  @UseGuards(PermissionGuard)
  @Permission(QUESTION_UPDATE)
  public async update(
    @Param() param,
    @Body() body: Partial<QuestionDto>,
  ): Promise<Question> {
    try {
      return await this.questionService.updateQuestion(body, {
        param: formatParamHttp(param),
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
