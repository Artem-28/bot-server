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

// Types
import { PermissionEnum } from '@/base/enum/permission/permission.enum';
import { CreateQuestionDto } from '@/modules/question/dto/create-question.dto';
import { SearchScriptParams } from '@/modules/script/util/search-script.params';
import { SearchQuestionParams } from '@/modules/question/util/search-question.params';

// Helper

@Controller('projects/:projectId/scripts/:scriptId/questions')
@UseGuards(AuthJwtGuard)
export class QuestionController {
  constructor(readonly questionService: QuestionService) {}
  // Создание нового question
  @Post()
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.QUESTION_ACCESS, PermissionEnum.QUESTION_CREATE],
    'or',
  )
  public async create(
    @Param() param: SearchScriptParams,
    @Body() body: CreateQuestionDto,
  ): Promise<Question> {
    try {
      body.scriptId = +param.scriptId;
      return await this.questionService.createQuestion(body, {
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Удаление question
  @Delete(':questionId')
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.QUESTION_ACCESS, PermissionEnum.QUESTION_DELETE],
    'or',
  )
  public async remove(@Param() param: SearchQuestionParams): Promise<boolean> {
    try {
      return await this.questionService.removeQuestion(param, {
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Обновление и получение обновленного question
  @Patch(':questionId')
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.QUESTION_ACCESS, PermissionEnum.QUESTION_DELETE],
    'or',
  )
  public async update(
    @Param() param: SearchQuestionParams,
    @Body() body: Partial<CreateQuestionDto>,
  ): Promise<Question> {
    try {
      return await this.questionService.updateQuestion(param, body, {
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
