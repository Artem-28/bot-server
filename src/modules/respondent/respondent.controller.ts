// Module

// Controller

// Service

// Entity

// Guard

// Types

// Helper
import { Body, Controller, HttpException, Param, Post } from '@nestjs/common';
import { RespondentService } from '@/modules/respondent/respondent.service';
import {
  CreateRespondentDto,
  RespondentDto,
} from '@/modules/respondent/dto/respondent.dto';
import { formatParamHttp } from '@/base/helpers/formatter.helper';

@Controller('api/projects/:projectId/respondents')
export class RespondentController {
  constructor(readonly respondentService: RespondentService) {}

  @Post()
  public async create(@Param() param, @Body() body: RespondentDto) {
    try {
      const { projectId } = formatParamHttp(param);
      const dto: CreateRespondentDto = {
        projectId,
        ...body,
      };
      return await this.respondentService.createRespondent(dto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
