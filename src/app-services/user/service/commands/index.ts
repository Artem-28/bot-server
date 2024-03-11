import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from '@app-services/user/service/commands/create-user/create-user.command-handler';
import { UpdateUserCommandHandler } from '@app-services/user/service/commands/update-user/update-user.command-handler';
import { RemoveUserCommandHandler } from '@app-services/user/service/commands/remove-user/remove-user.command-handler';

export const USER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler as Type<ICommandHandler>,
  UpdateUserCommandHandler as Type<ICommandHandler>,
  RemoveUserCommandHandler as Type<ICommandHandler>,
];
