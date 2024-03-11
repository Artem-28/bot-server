import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserAggregate, User as IUser } from '../domain';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app-services';
import { FindManyOptions, Repository } from 'typeorm';
import { PaginationDto } from '@app-services/common/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserAdapter implements UserRepository {
  private readonly _logger = new Logger(UserAdapter.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async remove(id: number): Promise<boolean> {
    const result = await this._userRepository.delete({ id });
    return !!result;
  }

  async findAll(
    pagination?: PaginationDto,
  ): Promise<[UserAggregate[], number]> {
    // Получаем инстанс класса пагинации с дефолтными полями если такие небыли преданы
    const { take, skip } = plainToInstance(PaginationDto, pagination || {});
    const options: FindManyOptions<UserEntity> = {
      take,
      skip,
      order: {
        createdAt: 'DESC',
      },
    };
    const [data, count] = await this._userRepository.findAndCount(options);
    return [data.map((user) => UserAggregate.create(user)), count];
  }

  async findOne(id: number): Promise<UserAggregate | null> {
    const result = await this._userRepository.findOneBy({ id });
    if (!result) return null;
    return UserAggregate.create(result);
  }

  async save(user: IUser): Promise<UserAggregate> {
    const result = await this._userRepository.save(user);
    return UserAggregate.create(result);
  }

  async update(user: IUser): Promise<boolean> {
    const response = await this._userRepository
      .createQueryBuilder()
      .update()
      .set(user)
      .where({ id: user.id })
      .execute();

    return !!response.affected;
  }
}
