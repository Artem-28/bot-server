import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';
import { CreateProjectSubscriberDto } from './dto/create-project-subscriber.dto';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../project/project.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ProjectSubscriber } from './projectSubscriber.entity';
import {
  IFilterQueryBuilder,
  whereQueryBuilder,
} from '../../base/helpers/where-query-builder';

@Injectable()
export class ProjectSubscriberService {
  constructor(
    @InjectRepository(ProjectSubscriber)
    private readonly _subscriberRepository: Repository<ProjectSubscriber>,
    @InjectRepository(Project)
    private readonly _projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private readonly _userService: UserService,
    private readonly _projectService: ProjectService,
  ) {}

  private async _getSubscriber(
    userId: number,
    projectId: number,
  ): Promise<ProjectSubscriber | null> {
    const filters: IFilterQueryBuilder[] = [
      { field: 'userId', value: userId },
      { field: 'projectId', value: projectId },
    ];
    const rootQuery = this._subscriberRepository.createQueryBuilder();
    const query = whereQueryBuilder(
      rootQuery,
      filters,
    ) as SelectQueryBuilder<Project>;
    const response = await query.getOne();
    if (!response) return null;
    return new ProjectSubscriber(response);
  }

  public async subscribeUserToProject(
    user: User,
    payload: CreateProjectSubscriberDto,
  ): Promise<void> {
    const project = await this._projectService.getById(payload.projectId);
    if (!project) {
      throw new HttpException('project.not_found', 404);
    }
    const isOwner = project.checkOwner(user.id);
    if (!isOwner) {
      throw new HttpException('base.permission_denied', 403);
    }
    const subscriber = await this._userService.getByEmail(payload.email);
    if (!subscriber) {
      throw new HttpException('user.not_found', 404);
    }
    const existsSubscriber = await this._getSubscriber(
      subscriber.id,
      project.id,
    );
    if (existsSubscriber) {
      console.log('IS EXISTS', existsSubscriber);
      return;
    }
    const projectSubscriber = new ProjectSubscriber({
      project,
      user: subscriber,
    });
    await this._subscriberRepository.save(projectSubscriber);
  }

  // public async getSubscribers(user: User) {
  //   user.projects = await this._projectRepository
  //     .createQueryBuilder()
  //     .relation(User, 'projects')
  //     .of(user)
  //     .loadMany();
  //   const subscribersMap = new Map<number, User[]>();
  //   for (const project of user.projects) {
  //     const subscribers = await this._projectRepository
  //       .createQueryBuilder()
  //       .relation(Project, 'subscribers')
  //       .of(project)
  //       .loadMany();
  //     subscribersMap.set(project.id, subscribers);
  //   }
  //   console.log(subscribersMap);
  // }
  public async getSubscribers(user: User) {}
}
