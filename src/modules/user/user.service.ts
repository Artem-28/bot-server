import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { User } from '@/modules/user/user.entity';

// Guard

// Types
import { UserDto } from '@/modules/user/dto/user.dto';
import { Options } from '@/base/interfaces/service.interface';

// Helper
import QueryBuilderHelper from '@/base/helpers/query-builder.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}
  // Создание нового пользователя
  public async create(payload: UserDto): Promise<User> {
    const data = await this._usersRepository.save(payload);
    return new User(data);
  }

  // Получить одного пользователя
  public async getOneUser(options: Options): Promise<User | null> {
    const { filter, relation, throwException } = options;
    const queryHelper = new QueryBuilderHelper(this._usersRepository, {
      filter,
      relation,
    });
    const response = await queryHelper.builder.getOne();
    if (!response && throwException) {
      throw new HttpException('user.get', 500);
    }
    if (!response) return null;
    return new User(response);
  }

  public async checkSubscriptionToProject(
    userId: number,
    projectId: number,
    options?: Options,
  ): Promise<boolean> {
    const throwException = options && options.throwException;
    const queryHelper = new QueryBuilderHelper(this._usersRepository, {
      filter: [
        { field: 'id', value: userId },
        { field: 'subscribedProjects.projectId', value: projectId },
      ],
      relation: [{ name: 'subscribedProjects', select: 'projectId' }],
    });
    const count = await queryHelper.builder.getCount();
    if (throwException && !count) {
      throw new HttpException('user.check_subscription_to_project', 500);
    }
    return !!count;
  }
}
