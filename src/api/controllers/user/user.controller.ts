import {
  Body,
  Controller,
  Param,
  Post,
  Patch,
  Delete,
  Get,
  HttpException,
} from '@nestjs/common';
import { UserFacade } from '@app-services/user/service';
import { CreateUserDto, UpdateUserDto } from '@/api/controllers/user/dto';
import { QueryOptions } from '@app-services';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    try {
      return await this.userFacade.commands.createUser(dto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Patch('/:userId')
  async updateUser(@Param() param, @Body() dto: UpdateUserDto) {
    const id = Number(param.userId);
    try {
      return await this.userFacade.commands.updateUser(
        { id, ...dto },
        { throwExceptions: true },
      );
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Delete('/:userId')
  async removeUser(@Param() param) {
    const id = Number(param.userId);
    try {
      return await this.userFacade.commands.removeUser(id, {
        throwExceptions: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Get('/:userId')
  async getUser(@Param() param) {
    const id = Number(param.userId);

    try {
      return await this.userFacade.queries.getUser({
        filter: { field: 'id', value: id },
        throwExceptions: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Get()
  async getUsers(@QueryOptions() options) {
    try {
      return await this.userFacade.queries.getUsers({
        ...options,
        filter: { field: 'id', value: [10, 11] },
        throwExceptions: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
