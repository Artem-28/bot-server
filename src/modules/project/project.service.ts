import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

// Entity
import { Project } from '@/modules/project/project.entity';

// Types
import { UpdateProjectDto } from '@/modules/project/dto/update-project.dto';
import { CreateProjectDto } from '@/modules/project/dto/create-project.dto';
import { Options } from '@/base/interfaces/service.interface';

// Helpers
import QueryBuilderHelper from '@/base/helpers/query-builder.helper';
import { Respondent } from '@/modules/respondent/respondent.entity';
import { checkRequiredField } from '@/base/helpers/object.helper';

@Injectable()
export class ProjectService {
  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(Project)
    private readonly _projectRepository: Repository<Project>,
  ) {}

  // Создание проекта
  public async createProject(
    dto: CreateProjectDto,
    options: Options,
  ): Promise<Project | null> {
    const { throwException } = options;
    const response = await this._projectRepository.save(dto);
    if (!response && throwException) {
      throw new HttpException('project.create', 500);
    }
    if (!response) return null;
    return new Project(response);
  }

  // Обновление проекта
  public async updateProject(
    id: number,
    dto: UpdateProjectDto,
    options: Options = {},
  ): Promise<boolean> {
    const response = await this._projectRepository
      .createQueryBuilder()
      .update()
      .set(dto)
      .where({ id })
      .execute();
    const success = !!response.affected;
    if (!success && options.throwException) {
      throw new HttpException('project.update', 500);
    }
    return success;
  }

  // Добавление респондента в проект
  public async addRespondentToProject(
    respondent: Respondent,
    options: Options,
  ): Promise<Project | null> {
    const { param, throwException, dataSourceManager } = options;
    const isValid = checkRequiredField(param, ['projectId'], throwException);
    if (!isValid) return null;

    const projectId = param.projectId;
    const project = await this.getOneProject({
      filter: { field: 'id', value: projectId },
      relation: { name: 'respondents' },
      throwException,
    });
    if (!project) return null;

    project.insertRespondent(respondent);

    const manager = dataSourceManager || this._dataSource.manager;
    const updatedProject = await manager.save(project);

    if (!updatedProject && throwException) {
      throw new HttpException('project.add_respondent', 500);
    }
    if (!updatedProject) return null;
    return updatedProject;
  }

  // Удаление проекта
  public async removeProject(
    id: number,
    options: Options = {},
  ): Promise<boolean> {
    const response = await this._projectRepository
      .createQueryBuilder()
      .delete()
      .from(Project)
      .where({ id })
      .execute();
    const success = !!response.affected;
    if (!success && options.throwException) {
      throw new HttpException('project.delete', 500);
    }
    return success;
  }

  // Получить один проект
  public async getOneProject(options: Options): Promise<Project | null> {
    const { filter, throwException, relation } = options;
    const queryHelper = new QueryBuilderHelper(this._projectRepository, {
      filter,
      relation,
    });
    const response = await queryHelper.builder.getOne();
    if (!response && throwException) {
      throw new HttpException('project.get', 500);
    }
    if (!response) return null;
    return response;
  }

  // Получить список проектов
  public async getProjects(options: Options = {}): Promise<Project[]> {
    const { filter } = options;
    const queryHelper = new QueryBuilderHelper(this._projectRepository, {
      filter,
    });
    return await queryHelper.builder.getMany();
  }
}
