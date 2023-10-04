import { HttpException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity';
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
import { ProjectSubscriberService } from '../project-subscriber/project-subscriber.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly _projectRepository: Repository<Project>,
  ) {}

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

  // Создание нового проекта
  public async create(userId: number, payload: CreateProjectDto) {
    // const project = new Project(payload);
    // project.user = user;
    // const response = await this._projectRepository.save(project);
    const response = await this._projectRepository.save({
      userId,
      ...payload,
    });
    return new Project(response);
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

  // Получение колличества записей Project в бд
  public async getCountOfProjects(
    filters: IFilterQueryBuilder[] = [],
  ): Promise<number> {
    const rootQuery = this._projectRepository.createQueryBuilder();
    const query = whereQueryBuilder(
      rootQuery,
      filters,
    ) as SelectQueryBuilder<Project>;
    console.log(filters);
    return await query.getCount();
  }

  // Проверка прав пользователя для проекта
  public async checkPermissionProject(
    projectId: number,
    user: User,
    throwException: boolean = false,
  ): Promise<boolean> {
    const filters: IFilterQueryBuilder[] = [
      { field: 'id', value: projectId },
      { field: 'userId', value: user.id },
    ];
    const count = await this.getCountOfProjects(filters);
    const check = !!count;
    if (throwException && !check) {
      throw new HttpException('base.permission_denied', 403);
    }
    return check;
  }
}
