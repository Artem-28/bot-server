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
import { GetUserQuery } from '@app-services/user/service/queries/get-user/get-user.query';
import { GetUserQueryHandler } from '@app-services/user/service/queries/get-user/get-user.query-handler';
import { GetUsersQuery } from '@app-services/user/service/queries/get-users/get-users.query';
import { GetUsersQueryHandler } from '@app-services/user/service/queries/get-users/get-users.query-handler';
import { QueryOptionsDto } from '@app-services';

@Injectable()
export class UserFacade {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
    private readonly _eventBus: EventBus,
  ) {}

  commands = {
    createUser: (dto: CreateUserDto, options?: QueryOptionsDto) =>
      this.createUser(dto, options),
    updateUser: (dto: UpdateUserDto, options?: QueryOptionsDto) =>
      this.updateUser(dto, options),
    removeUser: (id: number, options?: QueryOptionsDto) =>
      this.removeUser(id, options),
  };
  queries = {
    getUser: (options?: QueryOptionsDto) => this.getUser(options),
    getUsers: (options?: QueryOptionsDto) => this.getUsers(options),
  };
  events = {};

  private createUser(dto: CreateUserDto, options?: QueryOptionsDto) {
    return this._commandBus.execute<
      CreateUserCommand,
      CreateUserCommandHandler['execute']
    >(new CreateUserCommand(dto, options));
  }

  private updateUser(dto: UpdateUserDto, options?: QueryOptionsDto) {
    return this._commandBus.execute<
      UpdateUserCommand,
      UpdateUserCommandHandler['execute']
    >(new UpdateUserCommand(dto, options));
  }

  private removeUser(id: number, options?: QueryOptionsDto) {
    return this._commandBus.execute<
      RemoveUserCommand,
      RemoveUserCommandHandler['execute']
    >(new RemoveUserCommand(id, options));
  }

  private getUser(options?: QueryOptionsDto) {
    return this._queryBus.execute<GetUserQuery, GetUserQueryHandler['execute']>(
      new GetUserQuery(options),
    );
  }

  private getUsers(options?: QueryOptionsDto) {
    return this._queryBus.execute<
      GetUsersQuery,
      GetUsersQueryHandler['execute']
    >(new GetUsersQuery(options));
  }
}
