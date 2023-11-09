import { HttpException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import {
  DeleteQueryBuilder,
  Repository,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from 'typeorm';

import {
  IFilterQueryBuilder,
  whereQueryBuilder,
} from '../../base/helpers/where-query-builder';
import { QueryHandler } from '../../base/helpers/QueryHandler';
import {
  IProjectGetQueryHandle,
  IProjectGetQueryMethods,
  IProjectUpdateQueryHandle,
} from './interfaces/query-helper';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly _projectRepository: Repository<Project>,
  ) {}

  // Создание нового проекта
  private async _create(dto: CreateProjectDto) {
    const response = await this._projectRepository.save(dto);
    return new Project(response);
  }

  // Обновление проекта
  private async _update(
    projectId: number,
    payload: Partial<CreateProjectDto>,
    filters: IFilterQueryBuilder[] = [],
  ): Promise<boolean> {
    const rootQuery = this._projectRepository
      .createQueryBuilder()
      .update()
      .set(payload);

    filters.push({ field: 'id', value: projectId });
    const query = whereQueryBuilder(
      rootQuery,
      filters,
    ) as UpdateQueryBuilder<Project>;

    const response = await query.execute();
    return !!response.affected;
  }

  // Удаление проекта
  private async _remove(
    projectId: number,
    filters: IFilterQueryBuilder[] = [],
  ): Promise<boolean> {
    const rootQuery = this._projectRepository
      .createQueryBuilder()
      .delete()
      .from(Project);

    filters.push({ field: 'id', value: projectId });
    const query = whereQueryBuilder(
      rootQuery,
      filters,
    ) as DeleteQueryBuilder<Project>;

    const response = await query.execute();
    return !!response.affected;
  }

  // Обработка обновления проекта
  public async updateProjectHandle(
    projectId: number,
    payload: Partial<CreateProjectDto>,
    filters: IFilterQueryBuilder[] = [],
  ): Promise<Project> {
    const success = await this._update(projectId, payload, filters);
    if (!success) {
      throw new HttpException('project.update', 500);
    }
    return this.getById(projectId, filters);
  }

  // Обработка удаления проекта
  public async removeProjectHandle(
    projectId: number,
    filters: IFilterQueryBuilder[] = [],
  ): Promise<void> {
    const success = await this._remove(projectId, filters);
    if (!success) {
      throw new HttpException('project.remove', 500);
    }
  }

  // Получение всех проектов пользователя
  public async getProjectsByUserId(userId: number): Promise<Project[]> {
    return await this._projectRepository
      .createQueryBuilder('project')
      .where({ userId })
      .getMany();
  }

  // Получение проекта по id
  public async getById(
    projectId: number,
    filters: IFilterQueryBuilder[] = [],
  ): Promise<Project | null> {
    const rootQuery = this._projectRepository.createQueryBuilder('project');
    filters.push({ field: 'id', value: projectId });

    const query = whereQueryBuilder(
      rootQuery,
      filters,
    ) as SelectQueryBuilder<Project>;
    const response = await query.getOne();

    if (!response) return null;
    return new Project(response);
  }

  // Обработка создания проекта
  public async createProjectHandle(dto: CreateProjectDto): Promise<Project> {
    return await this._create(dto);
  }

  private async _byId(
    id: number,
    queryHandler: IProjectGetQueryHandle | IProjectUpdateQueryHandle,
  ): Promise<Project> {
    const filter = { field: 'id', value: id };
    const builder = queryHandler.filter(filter).builder;
    const response = await builder.getOne();

    if (!response) return null;
    return new Project(response);
  }

  private async _byUserId(
    userId: number,
    queryHandler: IProjectGetQueryHandle,
  ): Promise<Project[]> {
    const filter = { field: 'userId', value: userId };
    const builder = queryHandler.filter(filter).builder;
    return await builder.getMany();
  }

  private async _updateProject(
    queryHandler: IProjectUpdateQueryHandle,
    payload: Partial<CreateProjectDto>,
  ) {
    const builder = queryHandler.builder.update().set(payload);
    const response = await builder.execute();
    return !!response.affected;
  }

  public getHandle() {
    const methods: IProjectGetQueryMethods = {
      projectById: (id: number) => this._byId(id, queryHandler),
      projectsByUserId: (id: number) => this._byUserId(id, queryHandler),
    };
    const queryHandler = new QueryHandler(this._projectRepository, methods);

    return queryHandler.methods;
  }

  public async updateHandle(
    projectId: number,
    payload: Partial<CreateProjectDto>,
  ) {
    const methods = {
      getProject: () => queryHandler.builder.getOne(),
    };
    const filter = { field: 'id', value: projectId };
    const queryHandler = new QueryHandler(this._projectRepository, methods);
    queryHandler.filter(filter);
    await this._updateProject(queryHandler, payload);
    return queryHandler.methods;
  }
}
