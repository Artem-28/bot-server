import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from '@app-services/user/service/commands/create-user/create-user.command-handler';

export const USER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler as Type<ICommandHandler>,
];
