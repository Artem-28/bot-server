import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Entity
import { User } from './user.entity';

// Types
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Options } from '../../base/interfaces/service.interface';

// Helpers
import QueryBuilderHelper from '../../base/helpers/query-builder-helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}
  // Создание нового пользователя
  public async create(payload: CreateUserDto): Promise<User> {
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
}
