import { Body, Controller, Param, Post, Patch, Delete } from '@nestjs/common';
import { UserFacade } from '@app-services/user/service';
import { CreateUserDto, UpdateUserDto } from '@/api/controllers/user/dto';

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
}
