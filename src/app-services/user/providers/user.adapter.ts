import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserAggregate, User as IUser } from '../domain';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app-services';
import { Repository } from 'typeorm';

@Injectable()
export class UserAdapter implements UserRepository {
  private readonly _logger = new Logger(UserAdapter.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async delete(id: number): Promise<boolean> {
    const result = await this._userRepository.delete({ id });
    return !!result;
  }

  async findAll(): Promise<[UserAggregate[], number]> {
    const [data, count] = await this._userRepository.findAndCount();
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
}
