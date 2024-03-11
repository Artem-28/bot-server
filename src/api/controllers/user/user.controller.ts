import {
  Body,
  Controller,
  Param,
  Post,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';
import { UserFacade } from '@app-services/user/service';
import { CreateUserDto, UpdateUserDto } from '@/api/controllers/user/dto';
import { QueryOptions } from '@app-services';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userFacade.commands.createUser(dto);
  }

  @Patch('/:userId')
  async updateUser(@Param() param, @Body() dto: UpdateUserDto) {
    const id = Number(param.userId);
    return await this.userFacade.commands.updateUser({ id, ...dto });
  }

  @Delete('/:userId')
  async removeUser(@Param() param) {
    const id = Number(param.userId);
    return await this.userFacade.commands.removeUser(id);
  }

  @Get('/:userId')
  async getUser(@Param() param) {
    const id = Number(param.userId);
    return await this.userFacade.queries.getUser(id);
  }

  @Get()
  async getUsers(@QueryOptions() { pagination }) {
    return await this.userFacade.queries.getUsers(pagination);
  }
}
