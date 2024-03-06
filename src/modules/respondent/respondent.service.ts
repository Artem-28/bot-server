import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
// Module

// Controller

// Service
import { ProjectService } from '@/modules/project/project.service';

// Entity
import { Respondent } from '@/modules/respondent/respondent.entity';

// Guard

// Types

// Helper
import { CreateRespondentDto } from '@/modules/respondent/dto/respondent.dto';
import { Options } from '@/base/interfaces/service.interface';
import QueryBuilderHelper from '@/base/helpers/query-builder.helper';

@Injectable()
export class RespondentService {
  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(Respondent)
    private readonly _respondentRepository: Repository<Respondent>,
    public readonly projectService: ProjectService,
  ) {}

  // Создание и добавление нового респондента в проект
  public async createRespondent(
    dto: CreateRespondentDto,
    options?: Options,
  ): Promise<Respondent[]> {
    const throwException = options && options.throwException;
    const respondent = new Respondent(dto);
    const param = { projectId: dto.projectId };
    const project = await this.projectService.addRespondentToProject(
      respondent,
      { param, throwException },
    );
    if (!project) return [];
    return project.respondents;
  }

  public async getOneRespondent(options: Options): Promise<Respondent> {
    const { filter, relation, throwException } = options;
    const queryHelper = new QueryBuilderHelper(this._respondentRepository, {
      filter,
      relation,
    });
    const response = await queryHelper.builder.getOne();
    if (!response && throwException) {
      throw new HttpException('respondent.get', 500);
    }
    if (!response) return null;
    return response;
  }
}
