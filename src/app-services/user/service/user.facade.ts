import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserDto,
  UpdateUserDto,
} from '@app-services/user/service/commands/dto';
import { CreateUserCommand } from '@app-services/user/service/commands/create-user/create-user.command';
import { CreateUserCommandHandler } from '@app-services/user/service/commands/create-user/create-user.command-handler';
import { UpdateUserCommand } from '@app-services/user/service/commands/update-user/update-user.command';
import { UpdateUserCommandHandler } from '@app-services/user/service/commands/update-user/update-user.command-handler';
import { RemoveUserCommand } from '@app-services/user/service/commands/remove-user/remove-user.command';
import { RemoveUserCommandHandler } from '@app-services/user/service/commands/remove-user/remove-user.command-handler';

@Injectable()
export class UserFacade {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
    private readonly _eventBus: EventBus,
  ) {}

  commands = {
    createUser: (dto: CreateUserDto) => this.createUser(dto),
    updateUser: (dto: UpdateUserDto) => this.updateUser(dto),
    removeUser: (id: number) => this.removeUser(id),
  };
  queries = {};
  events = {};

  private createUser(dto: CreateUserDto) {
    return this._commandBus.execute<
      CreateUserCommand,
      CreateUserCommandHandler['execute']
    >(new CreateUserCommand(dto));
  }

  private updateUser(dto: UpdateUserDto) {
    return this._commandBus.execute<
      UpdateUserCommand,
      UpdateUserCommandHandler['execute']
    >(new UpdateUserCommand(dto));
  }

  private removeUser(id: number) {
    return this._commandBus.execute<
      RemoveUserCommand,
      RemoveUserCommandHandler['execute']
    >(new RemoveUserCommand(id));
  }
}
