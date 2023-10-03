import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteQueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';

import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';

import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';
import { ProjectSubscriber } from './projectSubscriber.entity';

import {
  IFilterQueryBuilder,
  whereQueryBuilder,
} from '../../base/helpers/where-query-builder';

import {
  IResponseCombineUserSubscriber,
  IResponseSubscriberUser,
} from './interfaces/response-project-subscriber.interface';

import { SearchProjectSubscriberDto } from './dto/search-project-subscriber.dto';
import { SubscribeProjectDto } from './dto/subscribe-project.dto';

@Injectable()
export class ProjectSubscriberService {
  constructor(
    @InjectRepository(ProjectSubscriber)
    private readonly _subscriberRepository: Repository<ProjectSubscriber>,
    @InjectRepository(Project)
    private readonly _projectRepository: Repository<Project>,

    private readonly _userService: UserService,
    private readonly _projectService: ProjectService,
  ) {}

  // Комбинирует подписчиков по пользователю
  private _combineSubscriberByUser(
    subscribers: ProjectSubscriber[],
  ): Map<number, IResponseCombineUserSubscriber> {
    return subscribers.reduce((acc, current) => {
      const mapKey = current.userId; // Ключ по которому соотавляется мапа
      const user = current.formatUser; // Получение отформотированого пользователя
      const project = current.formatProject; // Получение отформатированого проекта
      // Если в мапе нет еще такого пользователя
      if (!acc.has(mapKey)) {
        // Добавим нового подписчика с проектом
        acc.set(mapKey, { ...user, projects: [project] });
        return acc;
      }
      // Если в мапе есть уже такой пользователь то добавим проект на который он подписан
      const subscriber = acc.get(mapKey);
      subscriber.projects.push(project);
      acc.set(mapKey, subscriber);
      return acc;
    }, new Map<number, IResponseCombineUserSubscriber>());
  }
  // Форматирует ответ клиенту
  private _formatterSubscribers(
    subscribers: ProjectSubscriber[],
    combine: 'user' | 'project' = 'user',
  ) {
    // Комбинация по пользователю
    if (combine === 'user') {
      const responseMap = this._combineSubscriberByUser(subscribers);
      return Array.from(responseMap.values());
    }
  }

  // Удаление подписчика с проекта
  private async _removeProjectSubscriber(payload: SearchProjectSubscriberDto) {
    const filter: IFilterQueryBuilder[] = [
      { field: 'projectId', value: payload.projectId },
      { field: 'userId', value: payload.userId },
    ];
    const rootQuery = this._subscriberRepository
      .createQueryBuilder()
      .delete()
      .from(ProjectSubscriber);
    const query = whereQueryBuilder(
      rootQuery,
      filter,
    ) as DeleteQueryBuilder<ProjectSubscriber>;

    const response = await query.execute();
    return !!response.affected;
  }

  // Проверяет существует ли подписчик у проекта
  private async _existSubscriber(
    userId: number,
    projectId: number,
  ): Promise<boolean> {
    // Установка фильтров
    const filters: IFilterQueryBuilder[] = [
      { field: 'userId', value: userId },
      { field: 'projectId', value: projectId },
    ];
    const rootQuery = this._subscriberRepository.createQueryBuilder();
    // Установка фильтров
    const query = whereQueryBuilder(
      rootQuery,
      filters,
    ) as SelectQueryBuilder<Project>;
    const count = await query.getCount();
    return !!count;
  }

  // Отписать пользователя от проекта
  public async unsubscribeUserFromProject(
    user: User,
    payload: SearchProjectSubscriberDto,
  ): Promise<boolean> {
    // Фильтры для выборки
    const filter: IFilterQueryBuilder[] = [
      { field: 'projectId', value: payload.projectId },
      { field: 'userId', value: payload.userId },
    ];
    const rootQuery = this._subscriberRepository
      .createQueryBuilder('projectSubscriber')
      .innerJoinAndSelect('projectSubscriber.project', 'project');
    // Устанавливаем фильтры
    const query = whereQueryBuilder(
      rootQuery,
      filter,
    ) as SelectQueryBuilder<ProjectSubscriber>;
    // Получаем подписчика
    const subscriber = await query.getOne();
    // Если нет подписчика
    if (!subscriber) {
      throw new HttpException('project_subscribe.not_exist', 404);
    }
    // Является ли пользователь владельцем проекта
    const isOwner = subscriber.project.checkOwner(user.id);
    // Является ли пользователь сам подписчиком (т.е. хочет отписаться сам)
    const isSubscriber = user.id === subscriber.userId;
    // Если пользователь не подписчик и не владелец проекта
    if (!isOwner && !isSubscriber) {
      throw new HttpException('project_subscribe.permission_denied', 403);
    }
    // Удаляем пользователя из подписчиков
    return await this._removeProjectSubscriber(payload);
  }

  // Подписать пользователя на проект
  public async subscribeUserToProject(
    user: User, // Владелец проекта на который подписываем
    payload: SubscribeProjectDto,
  ): Promise<ProjectSubscriber> {
    // Получаем проект на который нужно подписать
    const project = await this._projectService.getById(payload.projectId);
    // Если проекта нет
    if (!project) {
      throw new HttpException('project.not_found', 404);
    }
    // Проверяем является ли пользователь владельцем проета
    const isOwner = project.checkOwner(user.id);
    if (!isOwner) {
      throw new HttpException('base.permission_denied', 403);
    }
    // Получаем подписчика
    const subscriber = await this._userService.getByEmail(payload.email);
    // Если подписчика нет
    if (!subscriber) {
      throw new HttpException('user.not_found', 404);
    }
    // Проверяем подписан ли пользователь уже на этот проект
    const existsSubscriber = await this._existSubscriber(
      subscriber.id,
      project.id,
    );
    // Если подписан
    if (existsSubscriber) {
      throw new HttpException('project_subscribe.is_exist', 500);
    }
    // Подписываем на проект
    const projectSubscriber = new ProjectSubscriber({
      project,
      user: subscriber,
    });
    return await this._subscriberRepository.save(projectSubscriber);
  }

  // Получает подписчика со всеми проектами на которые он подписан если эти проекты являются проектами авторизованного пользователя
  public async getSubscriber(
    authUser: User,
    userId: number,
  ): Promise<IResponseCombineUserSubscriber> {
    // Загружаем проекты авторизованного пользователя
    authUser.projects = await this._projectRepository
      .createQueryBuilder()
      .relation(User, 'projects')
      .of(authUser)
      .loadMany();
    // Загружаем подписика и все проекты
    const projectSubscribers = await this._subscriberRepository
      .createQueryBuilder('projectSubscriber')
      .innerJoinAndSelect('projectSubscriber.user', 'user')
      .innerJoinAndSelect('projectSubscriber.project', 'project')
      .where('projectSubscriber.projectId IN (:...projectIds)', {
        projectIds: authUser.projectIds,
      })
      .andWhere('projectSubscriber.userId = :userId', { userId })
      .getMany();
    // Форматируем результат
    const subscribers = this._formatterSubscribers(projectSubscribers);
    if (!subscribers.length) return null;
    return subscribers[0];
  }

  // Получение списка всех подписчиков которые подписаны на проекты пользователя
  public async getSubscribers(authUser: User) {
    // Загружаем проекты пользователя
    authUser.projects = await this._projectRepository
      .createQueryBuilder()
      .relation(User, 'projects')
      .of(authUser)
      .loadMany();

    // Получаем подписчиков которые подписаны на проекты пользователя
    const projectSubscribers = await this._subscriberRepository
      .createQueryBuilder('projectSubscriber')
      .innerJoinAndSelect('projectSubscriber.user', 'user')
      .innerJoinAndSelect('projectSubscriber.project', 'project')
      .where('projectSubscriber.projectId IN (:...projectIds)', {
        projectIds: authUser.projectIds,
      })
      .getMany();
    // Форматируем результат
    return this._formatterSubscribers(projectSubscribers);
  }

  // Получение списка подписчиков для проекта
  public async getSubscribersByProject(
    authUser: User,
    projectId: number,
  ): Promise<IResponseSubscriberUser[]> {
    // Получаем проект у которого надо получить подписчиков
    const project = await this._projectService.getById(projectId);
    // Если проекта нет
    if (!project) {
      throw new HttpException('project.not_found', 404);
    }
    // Проверяем является ли пользователь владельцем проета
    const isOwner = project.checkOwner(authUser.id);
    if (!isOwner) {
      throw new HttpException('base.permission_denied', 403);
    }
    // Получаем подписчиков которые подписаны на проекты пользователя
    const projectSubscribers = await this._subscriberRepository
      .createQueryBuilder('projectSubscriber')
      .innerJoinAndSelect('projectSubscriber.user', 'user')
      .where('projectSubscriber.projectId = :projectId', { projectId })
      .getMany();
    // Форматирование ответа
    return projectSubscribers.map((subscriber) => subscriber.formatUser);
  }
}
