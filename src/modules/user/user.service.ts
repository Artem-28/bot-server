import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}

  // Создание нового пользователя
  public async create(payload: CreateUsersDto): Promise<User> {
    const data = await this._usersRepository.save(payload);
    return new User(data);
  }

  // Получение пользователя по email
  public async getByEmail(email: string): Promise<User | null> {
    const data = await this._usersRepository.findOneBy({ email });
    if (!data) return null;
    return new User(data);
  }
}
