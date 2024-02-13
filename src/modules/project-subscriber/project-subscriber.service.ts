import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Module

// Controller

// Service
import { UserService } from '@/modules/user/user.service';
import { ProjectService } from '@/modules/project/project.service';

// Entity
import { ProjectSubscriber } from '@/modules/project-subscriber/projectSubscriber.entity';
import { Project } from '@/modules/project/project.entity';
import { User } from '@/modules/user/user.entity';

// Guard

// Types
import { IResponseCombineUserSubscriber } from '@/modules/project-subscriber/interfaces/response-project-subscriber.interface';
import { SearchProjectSubscriberDto } from '@/modules/project-subscriber/dto/search-project-subscriber.dto';
import { Options } from '@/base/interfaces/service.interface';
import { SubscribeProjectDto } from '@/modules/project-subscriber/dto/subscribe-project.dto';

// Helper
import QueryBuilderHelper from '@/base/helpers/query-builder.helper';

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
  ): IResponseCombineUserSubscriber[];
  private _combineSubscriberByUser(
    subscribers: ProjectSubscriber[],
    combineUserId: number,
  ): IResponseCombineUserSubscriber;
  private _combineSubscriberByUser(
    subscribers: ProjectSubscriber[],
    combineUserId?: number,
  ) {
    const responseMap = subscribers.reduce((acc, current) => {
      const mapKey = current.userId; // Ключ по которому соотавляется мапа
      const user = current.formatUser; // Получение отформотированого пользователя
      const project = current.formatProject; // Получение отформатированого проекта
      // Если в мапе нет еще такого пользователя
      if (!acc.has(mapKey)) {
        // Добавим нового подписчика с проектом
        acc.set(mapKey, { user, projects: [project] });
        return acc;
      }
      // Если в мапе есть уже такой пользователь то добавим проект на который он подписан
      const subscriber = acc.get(mapKey);
      subscriber.projects.push(project);
      acc.set(mapKey, subscriber);
      return acc;
    }, new Map<number, IResponseCombineUserSubscriber>());
    if (!combineUserId) {
      return Array.from(responseMap.values());
    }
    return responseMap.get(combineUserId);
  }

  // Отписать пользователя от проекта
  public async unsubscribeUserFromProject(
    dto: SearchProjectSubscriberDto,
    options?: Options,
  ): Promise<boolean> {
    const response = await this._subscriberRepository
      .createQueryBuilder()
      .delete()
      .from(ProjectSubscriber)
      .where({ userId: dto.userId })
      .andWhere({ projectId: dto.projectId })
      .execute();
    const success = !!response.affected;
    if (!success && options && options.throwException) {
      throw new HttpException('project_subscribe.delete', 500);
    }
    return success;
  }

  // Подписать пользователя на проект
  public async subscribeUserToProject(
    dto: SubscribeProjectDto,
    options: Options,
  ): Promise<ProjectSubscriber | null> {
    // Получаем проект на который нужно подписать
    const project = await this._projectService.getOneProject({
      filter: { field: 'id', value: dto.projectId },
    });
    // Если проекта нет
    if (options.throwException && !project) {
      throw new HttpException('project_subscribe.project_not_found', 404);
    }
    if (!project) return null;
    // Получаем подписчика
    const subscriber = await this._userService.getOneUser({
      filter: { field: 'email', value: dto.email },
    });
    // Если подписчика нет
    if (options.throwException && !subscriber) {
      throw new HttpException('project_subscribe.user_not_found', 404);
    }
    if (!subscriber) return null;

    // Проверяем является ли подписчик владельцем проекта
    const isOwner = project.checkOwner(subscriber.id);
    if (options.throwException && isOwner) {
      throw new HttpException('project_subscribe.user_owner', 500);
    }
    if (isOwner) return null;

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
    const queryHelper = new QueryBuilderHelper(this._subscriberRepository, {
      filter: [
        { field: 'projectId', value: authUser.projectIds },
        { field: 'userId', value: userId },
        // { field: 'projectId', value: authUser.projectIds },
        // { field: 'userId', value: userId },
      ],
      relation: [{ name: 'user' }, { name: 'project' }],
    });
    console.log('<<<<<<<<<<<RES1');
    const projectSubscribers = await queryHelper.builder.getMany();
    console.log('<<<<<<<<<<<RES2', projectSubscribers);
    // Форматируем результат
    return this._combineSubscriberByUser(projectSubscribers, userId);
  }

  // Получение списка всех подписчиков которые подписаны на проекты пользователя
  public async getSubscribers(
    authUser: User,
  ): Promise<IResponseCombineUserSubscriber[]> {
    // Загружаем проекты пользователя
    authUser.projects = await this._projectRepository
      .createQueryBuilder()
      .relation(User, 'projects')
      .of(authUser)
      .loadMany();

    // Получаем подписчиков которые подписаны на проекты пользователя
    const queryHelper = new QueryBuilderHelper(this._subscriberRepository, {
      filter: { field: 'projectId', value: authUser.projectIds },
      relation: [{ name: 'user' }, { name: 'project' }],
    });
    const projectSubscribers = await queryHelper.builder.getMany();
    // Форматируем результат
    return this._combineSubscriberByUser(projectSubscribers);
  }

  // Получает проекты на который подписан
  public async getSubscribeProjects(options?: Options): Promise<Project[]> {
    const { filter, relation } = options;
    const queryHelper = new QueryBuilderHelper(this._subscriberRepository, {
      filter,
      relation,
    });
    const projectSubscribers = await queryHelper
      .relation({ name: 'project' })
      .getMany();
    return projectSubscribers.map((subscribe) => subscribe.formatProject);
  }

  // Получение списка подписчиков для проекта
  public async getSubscribeUsers(options?: Options): Promise<User[]> {
    const { filter, relation } = options;
    // Получаем подписчиков которые подписаны на проекты пользователя
    const queryHelper = new QueryBuilderHelper(this._subscriberRepository, {
      filter,
      relation,
    });

    const projectSubscribers = await queryHelper
      .relation({ name: 'user' })
      .getMany();
    // Форматирование ответа
    return projectSubscribers.map((subscribe) => subscribe.formatUser);
  }
}
