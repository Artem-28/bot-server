import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly _usersRepository: Repository<Users>,
  ) {}

  // Создание нового пользователя
  public async create(payload: CreateUsersDto) {
    const password = await bcrypt.hash(payload.password, 10);
    const data = await this._usersRepository.save({ ...payload, password });
    return new Users(data);
  }
}
