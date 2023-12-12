import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Entity
import { Project } from './project.entity';

// Types
import { Repository } from 'typeorm';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { Options } from '../../base/interfaces/service.interface';

// Helpers
import QueryBuilderHelper from '../../base/helpers/query-builder-helper';

@Injectable()
export class ProjectService {
  constructor(
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
    if (!response) return null
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
