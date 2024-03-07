import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from '@app-services/user/service/commands/dto';
import { CreateUserCommand } from '@app-services/user/service/commands/create-user/create-user.command';
import { CreateUserCommandHandler } from '@app-services/user/service/commands/create-user/create-user.command-handler';

@Injectable()
export class UserFacade {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
    private readonly _eventBus: EventBus,
  ) {}

  commands = {
    createUser: (dto: CreateUserDto) => this.createUser(dto),
  };
  queries = {};
  events = {};

  private createUser(dto: CreateUserDto) {
    return this._commandBus.execute<
      CreateUserCommand,
      CreateUserCommandHandler['execute']
    >(new CreateUserCommand(dto));
  }
}
