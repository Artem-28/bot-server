import { HttpException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserAggregate, User as IUser } from '../domain';
import { InjectRepository } from '@nestjs/typeorm';
import {QueryBuilderHelper, QueryOptionsDto, ResponseWithCount, UserEntity} from '@app-services';
import { Repository } from 'typeorm';

@Injectable()
export class UserAdapter implements UserRepository {
  private readonly _logger = new Logger(UserAdapter.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async remove(id: number, options?: QueryOptionsDto): Promise<boolean> {
    const throwExceptions = options && options.throwExceptions;
    const response = await this._userRepository.delete({ id });

    const success = !!response.affected;
    if (!success && throwExceptions) {
      throw new HttpException('user.remove', 400);
    }
    return success;
  }

  async findAll(
    options?: QueryOptionsDto,
  ): Promise<ResponseWithCount<UserAggregate>> {
    const queryHelper = new QueryBuilderHelper(this._userRepository, options);
    const [result, count] = await queryHelper.builder.getManyAndCount();
    const data = result.map((user) => UserAggregate.create(user));
    return { data, count };
  }

  async findOne(options?: QueryOptionsDto): Promise<UserAggregate | null> {
    const throwExceptions = options && options.throwExceptions;
    const queryHelper = new QueryBuilderHelper(this._userRepository, options);
    const result = await queryHelper.builder.getOne();
    if (!result && throwExceptions) {
      throw new HttpException('user.get_one', 400);
    }
    if (!result) return null;
    return UserAggregate.create(result);
  }

  async save(user: IUser): Promise<UserAggregate> {
    const result = await this._userRepository.save(user);
    return UserAggregate.create(result);
  }

  async update(user: IUser, options?: QueryOptionsDto): Promise<boolean> {
    const throwExceptions = options && options.throwExceptions;

    const response = await this._userRepository
      .createQueryBuilder()
      .update()
      .set(user)
      .where({ id: user.id })
      .execute();

    const success = !!response.affected;
    if (!success && throwExceptions) {
      throw new HttpException('user.update', 400);
    }
    return success;
  }
}
