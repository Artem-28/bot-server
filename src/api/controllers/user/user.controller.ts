import { Body, Controller, Post } from '@nestjs/common';
import { UserFacade } from '@app-services/user/service';
import { CreateUserDto } from '@/api/controllers/user/dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userFacade.commands.createUser(dto);
  }
}
